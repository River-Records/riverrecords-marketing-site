// verify-calculator-fanout.mjs — the calculator endpoint, exercised handler-first.
//
// The point of these checks is the FLOOR. HubSpot's Collected Forms already captures
// these submissions into the CRM by watching native form submissions, so the form must
// keep posting natively and this endpoint must never make things worse than they were.
// Hence: with no environment variables at all, the notification still goes out and the
// visitor still lands on their guide.
//
// Runs the handler directly on Node's Workers-compatible globals with fetch stubbed —
// no wrangler, and no live calls to HubSpot or Mandrill.
//   node scripts/verify-calculator-fanout.mjs

import { onRequestPost, collect, buildHubSpotPayload, buildEmail, looksLikeEmail, readCookie }
  from '../functions/api/calculator.js';
let fails=0;
const check=(n,c,d)=>{console.log((c?'  PASS  ':'  FAIL  ')+n+(d?'\n          '+d:''));if(!c)fails++;};

const FORM = { email:'doc@practice.com', providers:'3', visits_per_provider:'3500',
  undercode_rate_pct:'8', medicare_share_pct:'35', estimate_em:'$33,953',
  estimate_g2211:'$60,270', estimate_total:'$94,223', visitor_id:'abc-123' };

function req(fields=FORM, cookie='hubspotutk=HUTK123; other=x') {
  const body = new URLSearchParams(fields).toString();
  return new Request('https://www.riverrecords.ai/api/calculator', {
    method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded', Cookie: cookie }, body });
}
function spyFetch() {
  const calls=[];
  globalThis.fetch = async (u, o) => { calls.push({u:String(u), body:o&&o.body}); return new Response('{}', {status:200}); };
  return calls;
}

console.log('\nUnconfigured — exactly how it ships, and how it behaves today');
let calls = spyFetch();
let res = await onRequestPost({ request: req(), env: {} });
check('redirects to the confirmation', res.status===303 && res.headers.get('Location').includes('?sent=1'), res.status+' → '+res.headers.get('Location'));
check('no HubSpot call without a form GUID', !calls.some(c=>c.u.includes('hsforms')));
check('no Mandrill call without a key', !calls.some(c=>c.u.includes('mandrill')));
check('notification still goes out, so nothing regresses', calls.some(c=>c.u.includes('formsubmit')), calls.map(c=>c.u).join(' '));
check('diagnostic header reports what ran', /notify:ok/.test(res.headers.get('X-RR-Fanout')), res.headers.get('X-RR-Fanout'));

console.log('\nHubSpot configured');
calls = spyFetch();
res = await onRequestPost({ request: req(), env: { HUBSPOT_FORM_GUID:'GUID-1' } });
const hs = calls.find(c=>c.u.includes('hsforms'));
check('posts to the UNAUTHENTICATED endpoint', !!hs && hs.u.includes('/integration/submit/') && !hs.u.includes('/secure/'), hs && hs.u);
check('uses the right portal', !!hs && hs.u.includes('/46752060/'));
const payload = hs && JSON.parse(hs.body);
check('carries hutk — this is what stitches their history', payload?.context?.hutk==='HUTK123', JSON.stringify(payload?.context));
check('maps our fields to HubSpot properties', payload?.fields?.some(f=>f.name==='practice_providers'&&f.value==='3'), JSON.stringify(payload?.fields?.map(f=>f.name)));
check('sends the estimate', payload?.fields?.some(f=>f.name==='undercoding_estimate'&&f.value==='$94,223'));
check('does not forward unmapped fields', !payload?.fields?.some(f=>f.name==='visitor_id'||f.name==='medicare_share_pct'));

console.log('\nMandrill configured');
calls = spyFetch();
res = await onRequestPost({ request: req(), env: { MANDRILL_API_KEY:'KEY', MANDRILL_FROM_EMAIL:'hello@riverrecords.ai' } });
const md = calls.find(c=>c.u.includes('mandrill'));
check('calls Mandrill', !!md);
const mp = md && JSON.parse(md.body);
check('key sent, and to the right person', mp?.key==='KEY' && mp?.message?.to?.[0]?.email==='doc@practice.com');
check('email carries their own numbers', mp?.message?.text.includes('$94,223') && mp.message.text.includes('3500'));
check('email links the guide', mp?.message?.text.includes('/guides/the-defensible-visit/'));
check('notification drops out once Mandrill is live', !calls.some(c=>c.u.includes('formsubmit')), calls.map(c=>c.u).join(' '));

console.log('\nFailure must never reach the visitor');
globalThis.fetch = async () => { throw new Error('third party down'); };
res = await onRequestPost({ request: req(), env: { HUBSPOT_FORM_GUID:'G', MANDRILL_API_KEY:'K' } });
check('still redirects when everything fails', res.status===303 && res.headers.get('Location').includes('?sent=1'));
check('failures recorded for diagnosis', /failed/.test(res.headers.get('X-RR-Fanout')), res.headers.get('X-RR-Fanout'));

console.log('\nRubbish input');
spyFetch();
res = await onRequestPost({ request: req({ email:'not-an-email' }), env:{ HUBSPOT_FORM_GUID:'G', MANDRILL_API_KEY:'K' } });
check('bad email is not sent onward', !/hubspot:ok|mandrill:ok/.test(res.headers.get('X-RR-Fanout')), res.headers.get('X-RR-Fanout'));
check('visitor still redirected', res.status===303);

console.log('\nUnits');
check('email validation', looksLikeEmail('a@b.co') && !looksLikeEmail('a@b') && !looksLikeEmail('nope'));
check('cookie not matched as substring', readCookie('xhubspotutk=no; hubspotutk=yes','hubspotutk')==='yes');
const f=new URLSearchParams({email:' a@b.co ', junk:'x'});
check('only known fields collected, trimmed', JSON.stringify(collect(f))==='{"email":"a@b.co"}', JSON.stringify(collect(f)));

console.log('\n'+(fails?`${fails} FAILED`:'ALL CHECKS PASSED'));
process.exit(fails?1:0);
