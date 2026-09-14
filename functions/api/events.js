/**
 * POST /api/events — record behavioural events against the anonymous visitor id.
 *
 * Counterpart to public/event-collector.js. See migrations/0001_create_events.sql for
 * why this is D1 rather than an analytics product.
 *
 * FOUR RULES THIS HANDLER FOLLOWS
 *
 * 1. It never throws and never returns an error to the browser. Analytics failing is
 *    not a reason for anything on the page to change behaviour, and a collector that
 *    retries on error would turn one bad deploy into a request storm. Everything
 *    answers 204.
 *
 * 2. It works with no database bound. Until the D1 binding exists in the Pages project
 *    the endpoint accepts and discards, so deploying this ahead of the database — or
 *    running a preview branch without one — changes nothing on the site.
 *
 * 3. The client's clock is not trusted for `ts`. Server time is used instead: device
 *    clocks are wrong often enough to poison any ordering built on them.
 *
 * 4. The user agent is read and discarded. It is used only to set the `bot` flag; it is
 *    never stored, because a UA string plus a durable visitor id is more identifying
 *    than anything this table needs to hold.
 *
 * Diagnose with `curl -i -X POST .../api/events -d '{"events":[]}'` and read X-RR-Events:
 * `stored:N`, `nodb`, `empty`, or `badjson`. Same idea as X-RR-Fanout on the calculator —
 * a misconfiguration should be visible without a redeploy.
 */

/** Hard caps. A batch that exceeds them is truncated, not rejected — partial data beats none. */
const MAX_EVENTS_PER_BATCH = 50;
const MAX_STRING = 512;
const MAX_PROPS_BYTES = 2048;

/**
 * Crawlers, preview fetchers and uptime checks. Not a security control — anything
 * determined will pass it — just enough that "how many people read this" is not
 * dominated by machines. Stored as a flag so the definition can change later without
 * losing the rows.
 */
const BOT_PATTERN =
  /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|pingdom|uptime|curl|wget|python-requests|node-fetch|axios|facebookexternalhit|preview|monitor|scan/i;

const clip = (value, max = MAX_STRING) =>
  typeof value === 'string' ? value.slice(0, max) : null;

/** Exported for the verification script, which asserts the caps without a browser. */
export function normalise(raw, { ts, country, bot }) {
  if (!raw || typeof raw !== 'object') return null;

  const rrVid = clip(raw.rr_vid, 64);
  const event = clip(raw.event, 64);
  // Both are required: a row with no visitor cannot join to anything, and a row with
  // no event name cannot be counted. Either one missing means the row is noise.
  if (!rrVid || !event) return null;

  let props = null;
  if (raw.props && typeof raw.props === 'object') {
    try {
      const encoded = JSON.stringify(raw.props);
      if (encoded.length <= MAX_PROPS_BYTES) props = encoded;
    } catch {
      // Circular or otherwise unserialisable — drop the props, keep the event.
    }
  }

  return {
    rr_vid: rrVid,
    event,
    path: clip(raw.path),
    ts,
    country,
    bot: bot ? 1 : 0,
    props,
  };
}

export async function onRequestPost(context) {
  const { request, env } = context;
  let outcome = 'nodb';

  try {
    const ua = request.headers.get('User-Agent') || '';
    const bot = BOT_PATTERN.test(ua);
    const country = clip(request.cf?.country || null, 2);
    const ts = Date.now();

    let payload;
    try {
      payload = await request.json();
    } catch {
      return done('badjson');
    }

    const incoming = Array.isArray(payload?.events) ? payload.events : [];
    const rows = incoming
      .slice(0, MAX_EVENTS_PER_BATCH)
      .map((raw) => normalise(raw, { ts, country, bot }))
      .filter(Boolean);

    if (!rows.length) return done('empty');

    const db = env.SITE_EVENTS;
    if (!db) return done('nodb');

    // One prepared statement, many bindings — D1 runs the batch in a single round trip.
    const stmt = db.prepare(
      'INSERT INTO events (rr_vid, event, path, ts, country, bot, props) VALUES (?, ?, ?, ?, ?, ?, ?)',
    );
    await db.batch(
      rows.map((r) => stmt.bind(r.rr_vid, r.event, r.path, r.ts, r.country, r.bot, r.props)),
    );

    outcome = `stored:${rows.length}`;
  } catch (err) {
    // Deliberately swallowed. The visitor gets 204 whatever the database is doing, and
    // the collector does not retry, so a failure costs these events and nothing else.
    outcome = 'error';
  }

  return done(outcome);
}

function done(outcome) {
  return new Response(null, {
    status: 204,
    headers: {
      'X-RR-Events': outcome,
      'Cache-Control': 'no-store',
    },
  });
}
