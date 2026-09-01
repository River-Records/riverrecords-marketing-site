// verify-calculator.mjs — checks the undercoding calculator's arithmetic.
//
// A revenue calculator that is wrong is worse than no calculator: it is wrong with a
// confident face, in front of exactly the cautious, numerate audience we are trying to
// earn. So every line is asserted against hand-computed values, not just "a number
// appears".
//
// It also asserts the things that keep the tool honest — the rates-effective stamp, the
// anti-upcoding guardrail, and the list of what the estimate deliberately excludes —
// because those are what make the number defensible rather than promotional.
//
// This repo has no test runner and no devDependencies; keeping it that way.
//   npm run build && npx --yes http-server dist -p 4321 --silent &
//   CHROME_PATH=... node scripts/verify-calculator.mjs

import { chromium } from 'playwright';
const B='http://127.0.0.1:4321/tools/undercoding-calculator/'; let fails=0;
const check=(n,c,d)=>{console.log((c?'  PASS  ':'  FAIL  ')+n+(d?'\n          '+d:''));if(!c)fails++;};
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const p = await (await b.newContext()).newPage();
await p.goto(B, {waitUntil:'domcontentloaded'});
await p.waitForTimeout(1200);

const read = () => p.evaluate(()=>({
  total:document.getElementById('uc-total').textContent,
  sub:document.getElementById('uc-total-sub').textContent,
  em:document.getElementById('uc-em-val').textContent,
  emMath:document.getElementById('uc-em-math').textContent,
  g:document.getElementById('uc-g-val').textContent,
  gMath:document.getElementById('uc-g-math').textContent,
}));

console.log('\nDefaults: 3 providers x 3,500 visits, 8% undercoded, 35% Medicare');
let r = await read();
console.log('   total:', r.total, '|', r.sub);
console.log('   E/M  :', r.em, '   ', r.emMath);
console.log('   G2211:', r.g, '   ', r.gMath);
// 3*3500 = 10500 visits; 8% = 840; 840*40.42 = 33,952.80
// 10500*35% = 3675; 3675*16.40 = 60,270  -> total 94,222.80
check('E/M line arithmetic', r.em === '$33,953', 'expected $33,953 (840 x 40.42)');
check('G2211 line arithmetic', r.g === '$60,270', 'expected $60,270 (3,675 x 16.40)');
check('total adds up', r.total === '$94,223', 'expected $94,223');
check('per-provider shown', r.sub.includes('$31,408'), r.sub);

console.log('\nSingle provider, zero undercoding, zero Medicare -> must be $0');
await p.fill('#uc-providers','1');
await p.evaluate(()=>{ const s=(id,v)=>{const e=document.getElementById(id);e.value=v;e.dispatchEvent(new Event('input'));};
  s('uc-rate','0'); s('uc-medicare','0'); });
await p.waitForTimeout(300);
r = await read();
check('zero inputs give zero, not NaN', r.total === '$0', r.total);

console.log('\nOne provider, 4,000 visits, 10% undercoded, 40% Medicare');
await p.evaluate(()=>{ const s=(id,v)=>{const e=document.getElementById(id);e.value=v;e.dispatchEvent(new Event('input'));};
  s('uc-visits','4000'); s('uc-rate','10'); s('uc-medicare','40'); });
await p.waitForTimeout(300);
r = await read();
// 4000*10% = 400 * 40.42 = 16,168 ; 4000*40% = 1600 * 16.40 = 26,240 ; total 42,408
check('matches the blog post\'s ~$15k order of magnitude for E/M', r.em === '$16,168', r.em + ' (blog says ~$15k/provider)');
check('total correct', r.total === '$42,408', r.total);

console.log('\nRates stamp is visible (numbers expire)');
check('effective-date stamp on page', (await p.textContent('.uc-stamp')).includes('January 2026'), await p.textContent('.uc-stamp'));
check('anti-upcoding guardrail present', (await p.textContent('.uc-guard')).includes('not an argument for upcoding'));
check('exclusions listed', (await p.locator('.uc-excl li').count()) >= 4, (await p.locator('.uc-excl li').count())+' items');

console.log('\nCapture carries the inputs');
await p.fill('#uc-email','doctor@practice.com');
await p.evaluate(()=>document.getElementById('uc-email-form').addEventListener('submit',e=>e.preventDefault(),false));
await p.click('#uc-email-form button[type="submit"]');
await p.waitForTimeout(500);
const fd = await p.evaluate(()=>Object.fromEntries(new FormData(document.getElementById('uc-email-form')).entries()));
check('inputs travel with the email', fd.providers==='1' && fd.visits_per_provider==='4000' && fd.undercode_rate_pct==='10',
  `providers=${fd.providers} visits=${fd.visits_per_provider} rate=${fd.undercode_rate_pct}`);
check('result travels too', fd.estimate_total==='$42,408', 'estimate_total='+fd.estimate_total);
check('visitor id attached', !!fd.visitor_id, String(fd.visitor_id).slice(0,12)+'…');
const dl = await p.evaluate(()=>(window.dataLayer||[]).filter(e=>e&&e.event==='calculator_submit'));
check('calculator_submit pushed', dl.length===1, JSON.stringify(dl[0]));
const noPII = await p.evaluate(()=>JSON.stringify(window.dataLayer||[]));
check('email NOT in dataLayer', !noPII.includes('doctor@practice.com'));

await b.close();
console.log('\n'+(fails?`${fails} CHECK(S) FAILED`:'ALL CHECKS PASSED'));
process.exit(fails?1:0);
