// verify-blog-offers.mjs — checks each post ends on an ask that fits what it is about.
//
// The regression this guards against is the one it replaced: a single trial CTA on all
// 88 posts, most of which are essays where asking for a credit card is the wrong move.
// So the philosophy-post check asserts the link does NOT go to signup.
//
// It also asserts the click is measurable. Without that, "did topic-matching beat one
// generic CTA" is unanswerable and the whole change is faith-based.
//
//   npm run build && npx --yes http-server dist -p 4321 --silent &
//   CHROME_PATH=... node scripts/verify-blog-offers.mjs

import { chromium } from 'playwright';
const B='http://127.0.0.1:4321'; let fails=0;
const check=(n,c,d)=>{console.log((c?'  PASS  ':'  FAIL  ')+n+(d?'\n          '+d:''));if(!c)fails++;};
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const p = await (await b.newContext()).newPage();

console.log('\nA revenue post ends on the calculator');
await p.goto(B+'/blog/the-undercoding-tax/', {waitUntil:'domcontentloaded'});
await p.waitForTimeout(600);
check('offer is calculator', await p.getAttribute('.blog-cta-card','data-offer')==='calculator');
check('links to the calculator', (await p.getAttribute('[data-offer-cta]','href'))==='/tools/undercoding-calculator/');

console.log('\nA philosophy post no longer asks for a credit card');
await p.goto(B+'/blog/the-hidden-danger-of-perfect-looking-notes/', {waitUntil:'domcontentloaded'});
await p.waitForTimeout(600);
check('offer is the guide', await p.getAttribute('.blog-cta-card','data-offer')==='guide');
const href = await p.getAttribute('[data-offer-cta]','href');
check('does NOT point at signup', !href.includes('onboard'), href);

console.log('\nThe click is measurable — otherwise we cannot tell if matching helped');
await p.evaluate(()=>document.addEventListener('click',e=>e.preventDefault(),true));
await p.click('[data-offer-cta]');
await p.waitForTimeout(400);
const ev = await p.evaluate(()=>(window.dataLayer||[]).filter(e=>e&&e.event==='blog_cta_click'));
check('blog_cta_click fired with the offer', ev.length===1 && ev[0].offer==='guide', JSON.stringify(ev[0]));

console.log('\nEvery offer destination actually resolves');
for (const u of ['/tools/undercoding-calculator/','/guides/the-defensible-visit/','/book','/book-demo']) {
  const r = await p.goto(B+u, {waitUntil:'domcontentloaded'});
  check(`${u} → ${r.status()}`, r.status()===200);
}

console.log('\nRead tracking still works alongside it');
await p.goto(B+'/blog/the-undercoding-tax/', {waitUntil:'domcontentloaded'});
await p.evaluate(async ()=>{const a=document.querySelector('.blog-post');const end=a.getBoundingClientRect().height;
  for(let y=0;y<end;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,20));}});
await p.waitForTimeout(700);
check('post_scroll still firing', (await p.evaluate(()=>(window.dataLayer||[]).some(e=>e&&e.event==='post_scroll'))));
await b.close();
console.log('\n'+(fails?`${fails} CHECK(S) FAILED`:'ALL CHECKS PASSED'));
process.exit(fails?1:0);
