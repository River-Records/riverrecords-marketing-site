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

// phone width
const m = await b.newPage({viewport:{width:390,height:900}});
await m.goto('http://127.0.0.1:4321/guides/school-sports-physicals/', {waitUntil:'networkidle'});
ck('no horizontal overflow at 390px', !(await m.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1)));
await b.close();
console.log('\n'+(fails?fails+' FAILED':'ALL CHECKS PASSED'));
process.exit(fails?1:0);
