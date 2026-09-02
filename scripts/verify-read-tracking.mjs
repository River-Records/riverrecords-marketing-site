// verify-read-tracking.mjs — checks the blog measures reading, not loading.
//
// The check that matters most is the idle one. Naive time-on-page counts a tab left
// open overnight as the most engaging content on the site, which would make every
// later decision about "high value pages" wrong. The clock must stop.
//
// Slow by nature — it spends over a minute actually reading a post, because that is
// the only honest way to test a sixty-second threshold.
//
//   npm run build && npx --yes http-server dist -p 4321 --silent &
//   CHROME_PATH=... node scripts/verify-read-tracking.mjs

import { chromium } from 'playwright';
const B='http://127.0.0.1:4321/blog/the-undercoding-tax/'; let fails=0;
const check=(n,c,d)=>{console.log((c?'  PASS  ':'  FAIL  ')+n+(d?'\n          '+d:''));if(!c)fails++;};
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const ev = p => p.evaluate(()=> (window.dataLayer||[]).filter(e=>e&&/^post_/.test(e.event||'')));

console.log('\nScrolling fires milestones against the ARTICLE, not the page');
let ctx = await b.newContext(); let p = await ctx.newPage();
await p.goto(B, {waitUntil:'domcontentloaded'});
await p.waitForTimeout(800);
await p.evaluate(async ()=>{ // walk down the article
  const a=document.querySelector('.blog-post');
  const end=a.getBoundingClientRect().height;
  for(let y=0;y<end;y+=300){ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,25)); }
});
await p.waitForTimeout(600);
let e = await ev(p);
const ms = e.filter(x=>x.event==='post_scroll').map(x=>x.milestone);
check('milestones fire in order', JSON.stringify(ms)===JSON.stringify([25,50,75,100]), JSON.stringify(ms));
check('each fires once only', new Set(ms).size===ms.length);
check('slug captured', e[0]?.post_slug==='the-undercoding-tax', e[0]?.post_slug);

console.log('\nA full scroll is NOT a read without engaged time');
check('no post_read from scrolling alone', !e.some(x=>x.event==='post_read'),
  'engaged_seconds='+e[e.length-1]?.engaged_seconds);

console.log('\nIdle time must not count — the whole point of "engaged"');
await p.waitForTimeout(12000); // 12s with no interaction at all
const idle = (await ev(p)).slice(-1)[0];
check('clock stops while idle', idle.engaged_seconds < 6, idle.engaged_seconds+'s counted over ~13s elapsed');

console.log('\nActive reading does count, and crosses the threshold');
ctx = await b.newContext(); p = await ctx.newPage();
await p.goto(B, {waitUntil:'domcontentloaded'});
await p.evaluate(async ()=>{ const a=document.querySelector('.blog-post');
  const end=a.getBoundingClientRect().height;
  for(let y=0;y<end;y+=400){ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,20)); } });
for (let i=0;i<62;i++){ await p.mouse.move(300, 200+(i%40)); await p.waitForTimeout(1000); }
e = await ev(p);
const read = e.find(x=>x.event==='post_read');
check('post_read fired', !!read, read && JSON.stringify({s:read.engaged_seconds,d:read.scroll_depth,n:read.posts_read_total}));
check('fired once only', e.filter(x=>x.event==='post_read').length===1);
check('carries engaged time and depth', read?.engaged_seconds>=60 && read?.scroll_depth>=70);
check('reader profile counted it', await p.evaluate(()=>JSON.parse(localStorage.getItem('rr_reader')||'{}').count)===1);
await b.close();
console.log('\n'+(fails?`${fails} CHECK(S) FAILED`:'ALL CHECKS PASSED'));
process.exit(fails?1:0);
