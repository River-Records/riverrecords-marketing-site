/**
 * POST /api/calculator — where a calculator submission fans out.
 *
 * THE FLOOR THIS MUST NOT BREAK
 * HubSpot's Collected Forms already captures these submissions into the CRM, and it does
 * so by watching *native* form submissions in the browser. That is why the form still
 * posts natively to this endpoint rather than being intercepted with fetch(): switching
 * to fetch would silently stop Collected Forms and lose the one thing already working.
 * If you ever change the front end to submit by XHR, you must replace that capture
 * deliberately, not discover it missing later.
 *
 * WHAT THIS ADDS, AS EACH PIECE IS CONFIGURED
 *   1. HubSpot Forms API — a real contact with the submitted fields, and crucially the
 *      `hutk` cookie in context, which retroactively attaches everything that visitor
 *      already browsed to the contact record.
 *   2. Mandrill — sends the person their own numbers plus the guide.
 *
 * Everything is optional and independently gated. With nothing set, the visitor is
 * still redirected to the confirmation that hands over the guide, and HubSpot's
 * Collected Forms still captures them.
 *
 * WHY THERE IS NO FORMSUBMIT FALLBACK
 * There was one, briefly. It cannot work: formsubmit.co answers server-side POSTs with a
 * 403 Cloudflare bot challenge, because it is built for browser-originated form posts.
 * Verified against the live endpoint rather than assumed. It was redundant anyway —
 * Collected Forms already notifies on these submissions — so it is gone rather than
 * replaced. The browser-posted form on /contact is unaffected; that path still works.
 *
 * ON MANDRILL BEING OPTIONAL
 * Marketing Hub Starter includes simple workflows attached to forms — one per form, up
 * to ten actions, "send a marketing email" among them — and a Forms API submission
 * triggers them. So HubSpot can send the follow-up itself, personalised from the contact
 * properties written below, and editable without a deploy. Mandrill stays supported for
 * when the send needs to be genuinely transactional or to sidestep the marketing-contact
 * limit, but it is not required.
 *
 * ENVIRONMENT (Cloudflare Pages → Settings → Environment variables)
 *   MANDRILL_API_KEY     secret. Without it, no visitor email is sent.
 *   MANDRILL_FROM_EMAIL  e.g. hello@riverrecords.ai
 *   MANDRILL_FROM_NAME   e.g. River Records
 *   HUBSPOT_FORM_GUID    from the HubSpot form. Not a secret.
 *   HUBSPOT_PORTAL_ID    optional; defaults to the portal already in Base.astro.
 *
 * THIS HANDLER MUST NEVER THROW. A person who filled in a form and pressed a button gets
 * their guide regardless of which third party is having a bad day.
 */

const PORTAL_ID_DEFAULT = '46752060';
const CONFIRM_PATH = '/tools/undercoding-calculator/?sent=1';

/** Fields we accept off the form. Anything else is ignored rather than forwarded. */
const KNOWN_FIELDS = [
  'email', 'providers', 'visits_per_provider', 'undercode_rate_pct',
  'medicare_share_pct', 'estimate_em', 'estimate_g2211', 'estimate_total',
  'first_source', 'landing_page', 'visitor_id',
];

/**
 * Our field names → HubSpot contact properties. `email` is the only one HubSpot has out
 * of the box; the rest must exist on the form in HubSpot or the submission is rejected,
 * so unmapped extras are deliberately not sent.
 */
const HUBSPOT_FIELD_MAP = {
  email: 'email',
  providers: 'practice_providers',
  visits_per_provider: 'annual_visits_per_provider',
  estimate_total: 'undercoding_estimate',
};

export function readCookie(header, name) {
  if (!header) return null;
  const m = header.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  if (!m) return null;
  try { return decodeURIComponent(m[1]); } catch { return null; }
}

/** Only what we recognise, trimmed, with anything empty dropped. */
export function collect(form) {
  const out = {};
  for (const k of KNOWN_FIELDS) {
    const v = form.get(k);
    if (typeof v === 'string' && v.trim()) out[k] = v.trim().slice(0, 500);
  }
  return out;
}

export function looksLikeEmail(v) {
  return typeof v === 'string' && /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(v);
}

export function buildHubSpotPayload(data, { hutk, pageUri }) {
  const fields = Object.entries(HUBSPOT_FIELD_MAP)
    .filter(([ours]) => data[ours])
    .map(([ours, hs]) => ({ objectTypeId: '0-1', name: hs, value: data[ours] }));
  const context = { pageUri, pageName: 'Undercoding calculator' };
  // The whole point: this is what stitches their prior anonymous browsing to the contact.
  if (hutk) context.hutk = hutk;
  return { fields, context };
}

export function buildEmail(data, from) {
  const line = (label, value) => (value ? `${label}: ${value}\n` : '');
  const text =
`Thanks for running the numbers.

Here is the guide we mentioned — how to document medical decision-making so it survives
review, written for independent primary care:

https://www.riverrecords.ai/guides/the-defensible-visit/

It covers the 2-of-3 MDM rule, what actually counts as data, why prescription drug
management carries moderate risk on most primary care visits, and the five phrases that
quietly cost you a level. There is a one-page checklist at the end.

Your estimate
${line('  Billing providers', data.providers)}${line('  Visits per provider', data.visits_per_provider)}${line('  Coded a level down', data.undercode_rate_pct ? data.undercode_rate_pct + '%' : '')}${line('  E/M levels', data.estimate_em)}${line('  G2211 not billed', data.estimate_g2211)}${line('  Total', data.estimate_total)}
Treat that as a floor rather than a forecast. It deliberately leaves out separately
billable problems addressed during preventive visits, commercial rates above Medicare,
and time-based codes. Rates are the CY2026 Medicare Physician Fee Schedule, national and
non-facility.

None of this is an argument for billing a level you did not earn. It is an argument for
documentation that can defend the level you already did.

If it would help to talk it through with a physician who uses Stream daily:
https://www.riverrecords.ai/book-demo

— The team at River Records`;

  return {
    from_email: from.email,
    from_name: from.name,
    subject: 'Your undercoding estimate, and The Defensible Visit',
    text,
    to: [{ email: data.email, type: 'to' }],
    track_opens: true,
    track_clicks: true,
  };
}

/** Never let a third party's failure surface to the person who filled in the form. */
async function attempt(label, fn, report) {
  try {
    const ok = await fn();
    report.push(`${label}:${ok ? 'ok' : 'skipped'}`);
  } catch (err) {
    report.push(`${label}:failed`);
  }
}

export async function onRequestPost({ request, env }) {
  const report = [];
  let data = {};

  try {
    const form = await request.formData();
    data = collect(form);
  } catch {
    // Unparseable body — still send them somewhere useful rather than an error page.
    return Response.redirect(new URL(CONFIRM_PATH, request.url).toString(), 303);
  }

  const url = new URL(request.url);
  const hutk = readCookie(request.headers.get('Cookie'), 'hubspotutk');
  const pageUri = url.origin + '/tools/undercoding-calculator/';

  // 1. CRM. Additive to Collected Forms, which is already capturing these.
  const formGuid = env && env.HUBSPOT_FORM_GUID;
  await attempt('hubspot', async () => {
    if (!formGuid || !looksLikeEmail(data.email)) return false;
    const portal = (env && env.HUBSPOT_PORTAL_ID) || PORTAL_ID_DEFAULT;
    const res = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portal}/${formGuid}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildHubSpotPayload(data, { hutk, pageUri })),
      },
    );
    return res.ok;
  }, report);

  // 2. The visitor's own copy.
  const mandrillKey = env && env.MANDRILL_API_KEY;
  await attempt('mandrill', async () => {
    if (!mandrillKey || !looksLikeEmail(data.email)) return false;
    const from = {
      email: (env && env.MANDRILL_FROM_EMAIL) || 'hello@riverrecords.ai',
      name: (env && env.MANDRILL_FROM_NAME) || 'River Records',
    };
    const res = await fetch('https://mandrillapp.com/api/1.0/messages/send.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: mandrillKey, message: buildEmail(data, from) }),
    });
    return res.ok;
  }, report);

  // Whatever happened above, the person gets their guide.
  const to = new URL(CONFIRM_PATH, url.origin);
  return new Response(null, {
    status: 303,
    headers: {
      Location: to.toString(),
      'Cache-Control': 'no-store',
      // Visible in curl -I, so a failing integration can be diagnosed without a deploy.
      'X-RR-Fanout': report.join(' '),
    },
  });
}
