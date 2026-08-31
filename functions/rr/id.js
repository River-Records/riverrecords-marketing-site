/**
 * GET /rr/id — issue the visitor id as a *server-set* cookie.
 *
 * Why this exists at all: attribution.js writes `rr_vid` with document.cookie and a
 * 180-day Max-Age, but Safari's ITP caps script-written cookies at 7 days. A large
 * share of clinician traffic is iPhone and Mac, so on that traffic the 180-day intent
 * silently became one week and any consideration cycle longer than that lost first
 * touch. Cookies set by an HTTP response header are not capped that way.
 *
 * The client writes the cookie first (so links are decorated with no round-trip), then
 * calls this endpoint once to have the same value re-issued durably. Because the
 * browser sends the cookie it just wrote, this handler normally *reuses* that id
 * rather than minting a new one — the value stays stable, only its lifetime changes.
 *
 * `rr_vids` is a marker meaning "the server has already issued a durable cookie", so
 * the client makes this call once rather than on every page view.
 *
 * This is a Cloudflare Pages Function. It runs per-request and returns no-store, so it
 * is never cached. That matters: a cached HTML response carrying Set-Cookie would hand
 * every visitor the same id, which is why the cookie is issued from a dedicated
 * endpoint instead of from middleware wrapping the pages themselves.
 */

const COOKIE_NAME = 'rr_vid';
const MARKER_NAME = 'rr_vids';
const MAX_AGE = 60 * 60 * 24 * 180; // 180 days, matching attribution.js
const PARENT_DOMAIN = 'riverrecords.ai';

/** Read one cookie out of a Cookie header. Exported for the test. */
export function readCookie(header, name) {
  if (!header) return null;
  const match = header.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

/**
 * Build a Set-Cookie value.
 *
 * Domain is only pinned to `.riverrecords.ai` when we are actually being served from
 * that domain — on a *.pages.dev preview or localhost, a Domain attribute naming
 * another site is rejected outright and the cookie silently fails to set. Leaving it
 * off means the cookie still works for testing, just host-only.
 */
export function buildCookie(name, value, { hostname, protocol, maxAge = MAX_AGE }) {
  const onParentDomain = hostname === PARENT_DOMAIN || hostname.endsWith('.' + PARENT_DOMAIN);
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${maxAge}`,
    'SameSite=Lax',
  ];
  if (onParentDomain) parts.push(`Domain=.${PARENT_DOMAIN}`);
  // Secure would make the cookie unsettable over plain http (local preview).
  if (protocol === 'https:') parts.push('Secure');
  return parts.join('; ');
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const existing = readCookie(request.headers.get('Cookie'), COOKIE_NAME);
  const id = existing || crypto.randomUUID();

  const headers = new Headers({
    'Content-Type': 'application/json',
    // Never cache: this response carries Set-Cookie and is per-visitor.
    'Cache-Control': 'no-store, private',
  });
  const opts = { hostname: url.hostname, protocol: url.protocol };
  headers.append('Set-Cookie', buildCookie(COOKIE_NAME, id, opts));
  headers.append('Set-Cookie', buildCookie(MARKER_NAME, '1', opts));

  return new Response(JSON.stringify({ rr_vid: id, reused: !!existing }), { headers });
}
