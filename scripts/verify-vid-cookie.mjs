// verify-vid-cookie.mjs — checks the /rr/id Pages Function issues a durable cookie.
//
// Safari's ITP caps script-written cookies at 7 days, so attribution.js's 180-day
// max-age is silently ignored on much of a clinician audience. This endpoint re-issues
// the same id as a real Set-Cookie, which is not capped. The checks below cover the
// two ways that quietly breaks: a Domain attribute naming another site (rejected on
// *.pages.dev previews) and Secure over plain http (rejected on localhost).
//
// No wrangler needed — Node 22 has the Request/Response/crypto globals the Workers
// runtime provides, so the handler runs directly.
//   node scripts/verify-vid-cookie.mjs

import { onRequestGet, buildCookie, readCookie } from '../functions/rr/id.js';
let fails=0;
const check=(n,c,d)=>{console.log((c?'  PASS  ':'  FAIL  ')+n+(d?'\n          '+d:''));if(!c)fails++;};
const call = (url, cookie) => onRequestGet({ request: new Request(url, cookie?{headers:{Cookie:cookie}}:{}) });
const setCookies = r => r.headers.getSetCookie ? r.headers.getSetCookie() : [r.headers.get('set-cookie')];

console.log('\nMinting a new id on production');
let r = await call('https://www.riverrecords.ai/rr/id');
let sc = setCookies(r); let body = await r.json();
check('two cookies issued (id + marker)', sc.length===2, sc.join('\n          '));
check('id looks like a uuid', /^[0-9a-f-]{36}$/.test(body.rr_vid), body.rr_vid);
check('not a reuse', body.reused===false);
check('180-day Max-Age', sc[0].includes('Max-Age=15552000'));
check('Domain pinned to parent', sc[0].includes('Domain=.riverrecords.ai'));
check('Secure on https', sc[0].includes('Secure'));
check('SameSite=Lax', sc[0].includes('SameSite=Lax'));
check('never cached', r.headers.get('Cache-Control').includes('no-store'));

console.log('\nReusing the id the client already wrote (the normal path)');
r = await call('https://www.riverrecords.ai/rr/id', 'rr_vid=abc-123; other=x');
body = await r.json();
check('reuses client value, does not mint a new one', body.rr_vid==='abc-123' && body.reused===true, JSON.stringify(body));

console.log('\nPreview + localhost must not silently fail');
r = await call('https://feat-x.riverrecords-marketing-site.pages.dev/rr/id');
sc = setCookies(r);
check('no Domain attr off the parent domain (else cookie is rejected)', !sc[0].includes('Domain='), sc[0]);
r = await call('http://127.0.0.1:8788/rr/id');
sc = setCookies(r);
check('no Secure over http (else cookie is rejected)', !sc[0].includes('Secure'), sc[0]);

console.log('\nCookie parsing edge cases');
check('absent header', readCookie(null,'rr_vid')===null);
check('name is not matched as a substring', readCookie('xrr_vid=nope; rr_vid=yes','rr_vid')==='yes');
check('missing name', readCookie('a=1; b=2','rr_vid')===null);

console.log('\n'+(fails?`${fails} FAILED`:'ALL CHECKS PASSED'));
process.exit(fails?1:0);
