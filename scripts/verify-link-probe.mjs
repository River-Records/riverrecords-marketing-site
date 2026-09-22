// verify-link-probe.mjs — does the link check actually tell a dead page from a grumpy one?
//
// WHY THIS EXISTS
// verify-press.mjs --live is the thing that goes red when an interview link dies. A test
// that goes red for the wrong reason is worse than no test: people stop reading it, and
// then the genuinely dead link sits on /about/ behind a green tick. So the probe's own
// behaviour is asserted here, against a local server that can be made to misbehave on
// demand — no network, no third party, runs in a few seconds.
//
//   node scripts/verify-link-probe.mjs

import { createServer } from 'node:http';
import { probe } from './lib/link-probe.mjs';

let fails = 0;
const check = (n, c, d) => {
  console.log((c ? '  PASS  ' : '  FAIL  ') + n + (d ? '\n          ' + d : ''));
  if (!c) fails++;
};

// Counts requests per path so the retry behaviour can be asserted rather than assumed.
const hits = {};
const server = createServer((req, res) => {
  hits[req.url] = (hits[req.url] || 0) + 1;
  const end = (code, body = '') => { res.writeHead(code); res.end(body); };
  switch (req.url) {
    case '/ok': return end(200, 'hello');
    case '/gone': return end(404);
    case '/retired': return end(410);
    // The common real-world case: HEAD refused, GET fine. Apple and several publishers
    // behave like this, and calling it a dead link would be the false alarm that matters.
    case '/head-refused': return req.method === 'HEAD' ? end(405) : end(206, 'hello');
    case '/bot-challenge': return req.method === 'HEAD' ? end(403) : end(200, 'hello');
    case '/always-500': return end(500);
    // HEAD says gone, GET says fine. Rare, but it is why a 404 is confirmed with a GET
    // before the link is called dead rather than trusted on the cheap request alone.
    case '/head-404-get-ok': return req.method === 'HEAD' ? end(404) : end(200, 'hello');
    // Fails once, then recovers — a bad minute, which is exactly what retries are for.
    case '/flaky': return hits['/flaky'] === 1 ? end(503) : end(200, 'hello');
    case '/moved':
      res.writeHead(301, { location: '/ok' });
      return res.end();
    default: return end(404);
  }
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

console.log('\nA live page passes');
check('200 is ok', (await probe(`${base}/ok`)).ok === true);
check('a redirect is followed to the live page', (await probe(`${base}/moved`)).ok === true);

console.log('\nA page the publisher merely guards is NOT reported as dead');
const headRefused = await probe(`${base}/head-refused`);
check('405 on HEAD falls back to a ranged GET', headRefused.ok === true, JSON.stringify(headRefused));
const challenged = await probe(`${base}/bot-challenge`);
check('403 on HEAD falls back to a ranged GET', challenged.ok === true, JSON.stringify(challenged));

console.log('\nA transient failure is retried rather than reported');
const flaky = await probe(`${base}/flaky`);
check('one 503 then a 200 passes', flaky.ok === true, JSON.stringify(flaky));

console.log('\nA dead page fails, and says it is dead rather than "check by hand"');
const gone = await probe(`${base}/gone`);
check('404 fails', gone.ok === false);
check('404 is reported as gone', gone.gone === true, JSON.stringify(gone));
// Two requests, not one: the HEAD 404 is confirmed with a GET before the link is called
// dead. Two, not six — a definite answer ends the retry loop.
check('404 is confirmed with a GET, then not retried', hits['/gone'] === 2, `${hits['/gone']} request(s)`);
const headOnly404 = await probe(`${base}/head-404-get-ok`);
check('a 404 on HEAD alone is not enough to call it dead', headOnly404.ok === true, JSON.stringify(headOnly404));
const retired = await probe(`${base}/retired`);
check('410 is reported as gone', retired.ok === false && retired.gone === true, JSON.stringify(retired));

console.log('\nA host that never answers fails, but is not called dead');
const down = await probe(`${base}/always-500`);
check('persistent 5xx fails', down.ok === false);
check('persistent 5xx is not reported as gone', down.gone === false, JSON.stringify(down));
check('persistent 5xx was retried', hits['/always-500'] >= 3, `${hits['/always-500']} request(s)`);

server.close();
console.log('\n' + (fails ? `${fails} CHECK(S) FAILED` : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
