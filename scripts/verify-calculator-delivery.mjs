// verify-calculator-delivery.mjs — the promise made must be the promise kept.
//
// The calculator first shipped saying "we'll email this to you", relying on FormSubmit's
// _autoresponse. That never fired: FormSubmit does not send an autoresponse when
// _captcha is false, which this form sets. The offer was therefore broken for every
// visitor, and silently — the submission succeeded, so nothing looked wrong.
//
// The fix was to stop depending on email for content that is a public URL. The guide is
// now handed over on the page itself when the relay returns. These checks exist so that
// nobody reintroduces an inbox promise the site cannot keep.
//
//   npm run build && npx --yes http-server dist -p 4321 --silent &
//   CHROME_PATH=... node scripts/verify-calculator-delivery.mjs

import { chromium } from 'playwright';
const B='http://127.0.0.1:4321/tools/undercoding-calculator/'; let fails=0;
const check=(n,c,d)=>{console.log((c?'  PASS  ':'  FAIL  ')+n+(d?'\n          '+d:''));if(!c)fails++;};
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const p = await (await b.newContext()).newPage();

console.log('\nBefore submitting');
await p.goto(B, {waitUntil:'domcontentloaded'});
await p.waitForTimeout(1000);
check('confirmation hidden', !(await p.locator('#uc-sent').isVisible()));
check('form visible', await p.locator('#uc-email-form').isVisible());
check('copy promises a link, not just an email', (await p.textContent('.uc-capture p')).includes('link straight away'));
check('no dead _autoresponse field', (await p.locator('[name="_autoresponse"]').count())===0);

console.log('\nReturning from the relay (?sent=1)');
await p.goto(B+'?sent=1', {waitUntil:'domcontentloaded'});
await p.waitForTimeout(1000);
check('form hidden', !(await p.locator('#uc-email-form').isVisible()));
check('confirmation shown', await p.locator('#uc-sent').isVisible());
check('guide link present and correct', (await p.locator('#uc-sent a[href="/guides/the-defensible-visit/"]').count())===1);
check('guide link is clickable, not buried', await p.locator('#uc-sent a.btn-primary-lg').isVisible());
const txt = await p.textContent('#uc-sent');
check('does not promise an inbox delivery', !/check your inbox|spam/i.test(txt), txt.replace(/\s+/g,' ').slice(0,80)+'…');

console.log('\nThe guide the link points at actually resolves');
await p.click('#uc-sent a[href="/guides/the-defensible-visit/"]');
await p.waitForTimeout(1200);
check('lands on the guide', p.url().includes('/guides/the-defensible-visit/'), p.url());
check('guide content there', (await p.locator('.dv-check li').count())===7);

await b.close();
console.log('\n'+(fails?`${fails} CHECK(S) FAILED`:'ALL CHECKS PASSED'));
process.exit(fails?1:0);
