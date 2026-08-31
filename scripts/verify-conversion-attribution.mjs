// verify-conversion-attribution.mjs — checks the two conversion points carry attribution.
//
// A booked demo is the highest-intent action on the site and used to arrive with no
// idea where the person came from; the contact form posts to an email relay and used
// to arrive as name/email/message alone. Both now carry first touch.
//
// The first check is the one that matters most: /book-demo no longer uses Calendly's
// auto-init, so if the manual init ever breaks, the booking box renders EMPTY. That
// would cost bookings outright, not just data.
//
// This repo has no test runner and no devDependencies; keeping it that way.
//   npm run build && npx --yes http-server dist -p 4321 --silent &
//   CHROME_PATH=... node scripts/verify-conversion-attribution.mjs

import { chromium } from 'playwright';
const BASE='http://127.0.0.1:4321'; let fails=0;
const check=(n,c,d)=>{console.log((c?'  PASS  ':'  FAIL  ')+n+(d?'\n          '+d:''));if(!c)fails++;};
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });

console.log('\nCalendly — paid click, then book a demo');
let ctx = await b.newContext(); let p = await ctx.newPage();
await p.goto(BASE+'/?utm_source=google&utm_medium=cpc&utm_campaign=brand-q3', {waitUntil:'domcontentloaded'});
await p.waitForTimeout(600);
await p.goto(BASE+'/book-demo/', {waitUntil:'networkidle'});
await p.waitForTimeout(6000);
const iframeSrc = await p.evaluate(()=>{const f=document.querySelector('#calendly-embed iframe');return f?f.src:null;});
check('Calendly widget actually rendered', !!iframeSrc, iframeSrc? iframeSrc.slice(0,72)+'…' : 'NO IFRAME — booking box is empty');
if (iframeSrc) {
  const u = new URL(iframeSrc);
  check('first-touch source reaches the booking', u.searchParams.get('utm_source')==='google', 'utm_source='+u.searchParams.get('utm_source'));
  check('medium + campaign carried', u.searchParams.get('utm_medium')==='cpc' && u.searchParams.get('utm_campaign')==='brand-q3',
    `${u.searchParams.get('utm_medium')} / ${u.searchParams.get('utm_campaign')}`);
  check('rr_vid rides along for the join', !!u.searchParams.get('salesforce_uuid'), 'salesforce_uuid='+String(u.searchParams.get('salesforce_uuid')).slice(0,12)+'…');
  check('utm_content marks the booking page', u.searchParams.get('utm_content')==='book-demo');
}
await ctx.close();

console.log('\nCalendly — direct visitor still gets a working booking form');
ctx = await b.newContext(); p = await ctx.newPage();
await p.goto(BASE+'/book-demo/', {waitUntil:'networkidle'});
await p.waitForTimeout(6000);
const direct = await p.evaluate(()=>{const f=document.querySelector('#calendly-embed iframe');return f?f.src:null;});
check('renders for a direct visit', !!direct);
check('falls back to direct/none rather than blank', !!direct && new URL(direct).searchParams.get('utm_source')==='direct',
  direct? 'utm_source='+new URL(direct).searchParams.get('utm_source') : 'n/a');
await ctx.close();

console.log('\nContact form — hidden fields fill on submit');
ctx = await b.newContext(); p = await ctx.newPage();
await p.goto(BASE+'/blog/?utm_source=linkedin&utm_medium=social&utm_campaign=aug', {waitUntil:'domcontentloaded'});
await p.waitForTimeout(600);
await p.goto(BASE+'/contact/', {waitUntil:'networkidle'});
await p.waitForTimeout(800);
check('fields start empty (not stamped at load)', await p.inputValue('[name="first_source"]')==='');
await p.fill('#name','Test'); await p.fill('#email','t@x.com'); await p.fill('#message','hi');
await p.evaluate(()=>{ // capture values at submit without actually posting offsite
  const f=document.getElementById('contact-form');
  f.addEventListener('submit', e=>{ e.preventDefault();
    window.__captured = Object.fromEntries(new FormData(f).entries()); }, false);
});
await p.click('button[type="submit"]');
await p.waitForTimeout(400);
const cap = await p.evaluate(()=>window.__captured);
check('first_source captured', cap.first_source==='linkedin', 'first_source='+cap.first_source);
check('campaign + landing page captured', cap.first_campaign==='aug' && cap.landing_page.includes('/blog'),
  `${cap.first_campaign} / ${cap.landing_page}`);
check('visitor_id captured', !!cap.visitor_id, String(cap.visitor_id).slice(0,12)+'…');
check('submitted_from captured', cap.submitted_from==='/contact/');
check('optional fields present but empty', cap.practice==='' && cap.role==='');
const dl = await p.evaluate(()=>(window.dataLayer||[]).filter(e=>e&&e.event==='contact_form_submit'));
check('contact_form_submit pushed', dl.length===1, JSON.stringify(dl[0]));
await b.close();
console.log('\n'+(fails?`${fails} CHECK(S) FAILED`:'ALL CHECKS PASSED'));
process.exit(fails?1:0);
