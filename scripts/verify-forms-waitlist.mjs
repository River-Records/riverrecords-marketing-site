// verify-forms-waitlist.mjs — the early-access block behaves and does not oversell.
//
// Three things here are not cosmetic. It must sit AFTER the honest "Stream does not do
// this yet" statement, or the guide becomes a bait-and-switch and loses the credibility
// that makes it worth reading. The confirmation must not promise an email — the
// calculator shipped that once and it silently never fired for a single visitor. And
// the form posts natively; converting it to fetch would switch off HubSpot's Collected
// Forms capture with nothing appearing broken.
//
//   npm run build && npx --yes http-server dist -p 4321 --silent &
//   CHROME_PATH=... node scripts/verify-forms-waitlist.mjs

import { chromium } from 'playwright';
const parse=c=>{const m=(c.match(/[\d.]+/g)||[]).map(Number);return [m[0]||0,m[1]||0,m[2]||0,m.length>3?m[3]:1]};
const over=(f,b)=>{const[r,g,bl,a]=parse(f);const[br,bg,bb]=parse(b);return [a*r+(1-a)*br,a*g+(1-a)*bg,a*bl+(1-a)*bb]};
const lumOf=([r,g,b])=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)};
const contrast=(f,b)=>{const L1=lumOf(over(f,b)),L2=lumOf(parse(b).slice(0,3));return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05)};
let fails=0; const ck=(n,c,d)=>{console.log((c?'  PASS  ':'  FAIL  ')+n+(d?'  '+d:'')); if(!c)fails++;};
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });

const p = await b.newPage();
await p.goto('http://127.0.0.1:4321/guides/school-sports-physicals/', {waitUntil:'networkidle'});
ck('waitlist block present', await p.locator('#early-access').count()===1);
ck('form is visible by default', !(await p.locator('.fw-form').isHidden()));
ck('confirmation hidden by default', await p.locator('#fw-done').isHidden());
ck('school pre-ticked on the pediatric guide', await p.locator('input[value="school"]').isChecked());
ck('others not pre-ticked', !(await p.locator('input[value="prior-auth"]').isChecked()));
// It must sit AFTER the honest limitation, not before it.
const order = await p.evaluate(()=>{
  const t=document.body.innerText;
  return t.indexOf('does not fill in forms') < t.indexOf('Want to know when it ships');
});
ck('sits after the "we do not do this" statement', order);
const em = await p.evaluate(()=>{const e=document.querySelector('#fw-email');const cs=getComputedStyle(e);
  let n=e,bg='rgba(0, 0, 0, 0)'; while(n&&(bg==='rgba(0, 0, 0, 0)'||bg==='transparent')){bg=getComputedStyle(n).backgroundColor;n=n.parentElement;}
  return {c:cs.color,bg};});
ck('input text readable', contrast(em.c,em.bg)>=4.5, contrast(em.c,em.bg).toFixed(1)+':1');

// The confirmation swap, without a real POST.
const q = await b.newPage();
await q.goto('http://127.0.0.1:4321/guides/fmla-disability-paperwork/?waitlist=1', {waitUntil:'networkidle'});
ck('form hidden after redirect back', await q.locator('.fw-form').isHidden());
ck('confirmation shown', !(await q.locator('#fw-done').isHidden()));
const txt = await q.locator('#fw-done').innerText();
ck('no inbox promise in the confirmation', !/email|inbox/i.test(txt), JSON.stringify(txt.slice(0,60)));
ck('fmla pre-ticked on the adult guide', await (await b.newPage().then(async x=>{await x.goto('http://127.0.0.1:4321/guides/fmla-disability-paperwork/');return x;})).locator('input[value="fmla"]').isChecked());

// /form-filler/ — the detailed variant, and the claims the handoff keeps off the page
// until each is true.
const f = await b.newPage();
await f.goto('http://127.0.0.1:4321/form-filler/', {waitUntil:'networkidle'});
ck('/form-filler/ carries the waitlist', await f.locator('#early-access').count()===1);
ck('/form-filler/ posts natively to the endpoint', await f.locator('form.fw-form[action="/api/forms-waitlist"][method="POST"]').count()===1);
ck('/form-filler/ returns to itself', await f.locator('input[name="return_to"]').inputValue()==='/form-filler/');
ck('/form-filler/ asks which forms, in free text', await f.locator('textarea[name="forms_detail"]').count()===1);
ck('nothing pre-ticked on /form-filler/', (await f.locator('.fw-opt input:checked').count())===0);
ck('guides stay on the short form', await p.locator('textarea[name="forms_detail"]').count()===0);
const ff = await f.evaluate(()=>document.querySelector('main').innerText);
ck('says coming soon', /coming soon/i.test(ff));
ck('no time-saved figure', !/\d+\s*(minutes?|hours?)\s*(per|a|each)\b/i.test(ff) && !/hours of clinic time/i.test(ff));
ck('no fax-back claim', !/fax(es|ed)? (it|the form)? ?back from stream/i.test(ff));
ck('no compliance overclaim', !/HIPAA[- ]certified|HIPAA[- ]aligned|SOC ?2/i.test(ff));
const fq = await f.evaluate(()=>{
  const s=[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>{try{return JSON.parse(x.textContent)}catch{return null}}).find(x=>x&&x['@type']==='FAQPage');
  return {schema: s?s.mainEntity.length:0, visible: document.querySelectorAll('.ff-faq details').length};
});
ck('FAQ schema matches visible questions', fq.schema>0 && fq.schema===fq.visible, `${fq.visible} visible, ${fq.schema} in schema`);

// phone width
const m = await b.newPage({viewport:{width:390,height:900}});
for (const path of ['/guides/school-sports-physicals/', '/form-filler/']) {
  await m.goto('http://127.0.0.1:4321'+path, {waitUntil:'networkidle'});
  ck('no horizontal overflow at 390px on '+path, !(await m.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1)));
}
await b.close();

// The endpoint itself, with fetch stubbed — no network. Every ticked box must reach
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
