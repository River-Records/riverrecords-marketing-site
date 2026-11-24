// verify-forms-waitlist.mjs — Form Filler is launched: no waitlist on any page, and the
// pages do not oversell.
//
// Before launch this asserted the opposite: the early-access block present on
// /form-filler/ and both paperwork guides, and "coming soon" on the page. Form Filler is
// now part of Stream Pro, so the block is gone from all three and the hero asks for a
// demo. What did NOT change is the list the product handoff keeps off the page until each
// is true — time-saved figures, fax-back, compliance claims beyond /security/ — and the
// guides must no longer tell a reader form filling is unavailable.
//
// The FormsWaitlist component and /api/forms-waitlist remain in the repo, unused by any
// page; the endpoint tests at the bottom still run so it does not rot unnoticed.
//
//   npm run build && npx --yes http-server dist -p 4321 --silent &
//   CHROME_PATH=... node scripts/verify-forms-waitlist.mjs

import { chromium } from 'playwright';
let fails=0; const ck=(n,c,d)=>{console.log((c?'  PASS  ':'  FAIL  ')+n+(d?'  '+d:'')); if(!c)fails++;};
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const BASE = 'http://127.0.0.1:4321';
const PRELAUNCH = /coming soon|early[- ]access|wait[- ]?list|in development|not available (today|yet)|not switched on/i;

// The guides: no waitlist, no "we do not do this", and a quiet pointer to the page.
const p = await b.newPage();
for (const [path, fit] of [['/guides/school-sports-physicals/', '.sp-fit'], ['/guides/fmla-disability-paperwork/', '.fm-fit']]) {
  await p.goto(BASE+path, {waitUntil:'networkidle'});
  ck('no waitlist block on '+path, (await p.locator('#early-access').count())===0 && (await p.locator('form[action="/api/forms-waitlist"]').count())===0);
  const t = await p.evaluate(()=>document.querySelector('main').innerText);
  ck('no pre-launch wording on '+path, !PRELAUNCH.test(t), JSON.stringify((t.match(PRELAUNCH)||[''])[0]));
  ck('does not say Stream cannot fill forms on '+path, !/does not (fill in|complete)[^.]*forms|Not today/i.test(t));
  ck('"Where Stream fits" links to /form-filler/ on '+path, (await p.locator(fit+' a[href="/form-filler/"]').count())===1);
  const g = await p.evaluate(()=>{
    const s=[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>{try{return JSON.parse(x.textContent)}catch{return null}}).find(x=>x&&x['@type']==='FAQPage');
    return {schema: s?s.mainEntity.length:0, visible: document.querySelectorAll('details').length, text: s?JSON.stringify(s):''};
  });
  ck('FAQ schema matches visible questions on '+path, g.schema>0 && g.schema===g.visible, `${g.visible} visible, ${g.schema} in schema`);
  ck('FAQ schema carries no pre-launch wording on '+path, !PRELAUNCH.test(g.text) && !/Not today/.test(g.text));
}

// /form-filler/ — launched, and the claims the handoff keeps off the page until each is
// true.
const f = await b.newPage();
await f.goto(BASE+'/form-filler/', {waitUntil:'networkidle'});
ck('/form-filler/ carries no waitlist', (await f.locator('#early-access').count())===0 && (await f.locator('form[action="/api/forms-waitlist"]').count())===0);
ck('hero button goes to /book-demo/', (await f.locator('.ff-actions a.btn-primary-lg').getAttribute('href'))==='/book-demo/');
ck('closing button goes to /book-demo/', (await f.locator('.ff-cta a.btn-primary-lg').getAttribute('href'))==='/book-demo/');
ck('no link left pointing at #early-access', (await f.locator('a[href$="#early-access"]').count())===0);
const ff = await f.evaluate(()=>document.querySelector('main').innerText);
ck('does not say coming soon / early access / waitlist', !PRELAUNCH.test(ff), JSON.stringify((ff.match(PRELAUNCH)||[''])[0]));
ck('says it is included with Stream Pro', /Included with Stream Pro/i.test(ff));
const meta = await f.locator('meta[name="description"]').getAttribute('content');
ck('meta description is post-launch', !PRELAUNCH.test(meta) && !/Coming to/i.test(meta) && /Included with Stream Pro/i.test(meta), JSON.stringify(meta));
ck('limits section still there', /does not do yet/i.test(ff) && /not from your EHR/i.test(ff) && /no time-saved figure/i.test(ff));
ck('no time-saved figure', !/\d+\s*(minutes?|hours?)\s*(per|a|each)\b/i.test(ff) && !/hours of clinic time/i.test(ff));
// Neither claimed nor denied until the owner decides: no "fax it back from Stream", and
// no "does not fax" either (code has a Fax button on form rows when outbound fax is on).
ck('no fax-back denial', !/does not fax/i.test(ff));
ck('no fax-back claim', !/fax(es|ed)? (it|the form)? ?back from stream/i.test(ff));
ck('no compliance overclaim', !/HIPAA[- ]certified|HIPAA[- ]aligned|SOC ?2/i.test(ff));
const fq = await f.evaluate(()=>{
  const s=[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>{try{return JSON.parse(x.textContent)}catch{return null}}).find(x=>x&&x['@type']==='FAQPage');
  return {schema: s?s.mainEntity.length:0, visible: document.querySelectorAll('.ff-faq details').length, text: s?JSON.stringify(s):''};
});
ck('FAQ schema matches visible questions', fq.schema>0 && fq.schema===fq.visible, `${fq.visible} visible, ${fq.schema} in schema`);
ck('FAQ schema carries no pre-launch wording', !PRELAUNCH.test(fq.text));

// phone width
const m = await b.newPage({viewport:{width:390,height:900}});
for (const path of ['/guides/school-sports-physicals/', '/guides/fmla-disability-paperwork/', '/form-filler/']) {
  await m.goto(BASE+path, {waitUntil:'networkidle'});
  ck('no horizontal overflow at 390px on '+path, !(await m.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1)));
}
await b.close();

// The endpoint itself, with fetch stubbed — no network. No page posts to it any more,
// but it stays deployed. Every ticked box must reach
// HubSpot: formData.get() returns only the first, which silently dropped the rest.
const { onRequestPost } = await import('../functions/api/forms-waitlist.js');
let sent = null;
globalThis.fetch = async (_u, init) => { sent = JSON.parse(init.body); return new Response('{}', {status:200}); };
const body = new URLSearchParams([['email','a@b.co'],['forms_wanted','fmla'],['forms_wanted','utility'],['forms_detail','the MA shut-off form'],['company','Test Practice'],['return_to','/form-filler/']]);
const res = await onRequestPost({ request: new Request('https://www.riverrecords.ai/api/forms-waitlist', {method:'POST', body}), env: { HUBSPOT_WAITLIST_FORM_GUID: 'x' } });
const val = (n) => (sent?.fields.find((x)=>x.name===n)||{}).value;
ck('every ticked form reaches HubSpot', val('forms_wanted')==='fmla;utility', JSON.stringify(val('forms_wanted')));
ck('free-text answer reaches HubSpot', val('forms_detail')==='the MA shut-off form');
ck('practice name reaches HubSpot', val('company')==='Test Practice');
ck('redirects back to /form-filler/', res.status===303 && new URL(res.headers.get('Location')).pathname==='/form-filler/');
ck('an unlisted return_to is refused', await (async()=>{const r=await onRequestPost({request:new Request('https://x/api/forms-waitlist',{method:'POST',body:new URLSearchParams({email:'a@b.co',return_to:'https://evil.example/'})}),env:{}});return new URL(r.headers.get('Location')).hostname==='x';})());
console.log('\n'+(fails?fails+' FAILED':'ALL CHECKS PASSED'));
process.exit(fails?1:0);
