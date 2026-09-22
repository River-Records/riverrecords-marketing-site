// link-probe.mjs — "is this URL still there?", answered conservatively.
//
// Its own file so it can be exercised against a local server. The whole value of the
// weekly link check is that a red run means something, and a probe that reports a dead
// page whenever a publisher is fussy about HEAD requests would teach everyone to ignore
// it — at which point the genuinely dead link sits on /about/ behind a green tick.
//
// Three rules:
//   - a browser user-agent, because several publishers bot-challenge a bare fetch
//   - HEAD first because it is cheap, ranged GET as a fallback for hosts that refuse it
//   - 404/410 is the publisher saying it is gone, so it returns immediately; everything
//     else is retried, because a timeout or a 5xx is usually a bad minute, not link rot
//
// `gone` is the caller's cue to say "replace this URL" rather than "check by hand".

export const TRIES = 3;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

export async function probe(url) {
  let last = 'no response';
  for (let attempt = 0; attempt < TRIES; attempt++) {
    if (attempt) await sleep(1500 * attempt);
    try {
      const opts = { redirect: 'follow', headers: { 'user-agent': UA }, signal: AbortSignal.timeout(15000) };
      // HEAD first because it is cheap. Some publishers 403 or 405 it, so fall back to a
      // ranged GET rather than reporting a page that is merely fussy about verbs.
      let r = await fetch(url, { ...opts, method: 'HEAD' });
      if (!r.ok) r = await fetch(url, { ...opts, headers: { ...opts.headers, range: 'bytes=0-2048' } });
      if (r.ok) return { ok: true, status: r.status };
      // 404/410 is the publisher saying it is gone. Retrying will not change that.
      if (r.status === 404 || r.status === 410) return { ok: false, gone: true, status: r.status };
      last = `HTTP ${r.status}`;
    } catch (e) {
      last = e.name === 'TimeoutError' ? 'timed out' : e.message;
    }
  }
  return { ok: false, gone: false, status: last };
}
