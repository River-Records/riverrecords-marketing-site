/**
 * POST /api/forms-waitlist — early-access signups for form completion, from the foot
 * of the two paperwork guides and from /form-filler/.
 *
 * WHY THIS EXISTS AT ALL
 * Form filling is in development, and search cannot tell us whether anyone wants it:
 * the category does not exist, so volume reads as zero regardless of demand. A waitlist
 * is the only instrument available. The `forms` field matters more than the email —
 * if most people tick prior authorisation rather than school physicals, that changes
 * what gets built first, and nothing else would have told us.
 *
 * SAME SHAPE AS functions/api/calculator.js, deliberately:
 *   - the form posts NATIVELY, never via fetch. HubSpot's Collected Forms captures
 *     real submissions by watching them; intercepting the submit switches that off
 *     silently and nothing looks broken.
 *   - the handler never throws. Someone who asked to be told when a feature ships
 *     gets their confirmation whatever any third party is doing.
 *   - outcomes come back in X-RR-Waitlist so a misconfiguration is diagnosable with
 *     curl rather than a redeploy.
 *   - NO INBOX PROMISE. The calculator shipped one that silently never fired for
 *     every visitor. The confirmation is the page you land on.
 *
 * Degrades to nothing: with HUBSPOT_WAITLIST_FORM_GUID unset it still redirects to the
 * confirmation, and Collected Forms still captures the submission.
 */

const PORTAL_ID_DEFAULT = '46752060';

/** Only these reach HubSpot. An allow-list, same rule as the event collector. */
const FIELD_MAP = {
  email: 'email',
  forms_wanted: 'forms_wanted',
  practice_role: 'practice_role',
  company: 'company',
  forms_detail: 'forms_detail',
};

/**
 * Checkbox groups send one entry per ticked box, and `formData.get` returns only the
 * first — which for `forms_wanted` silently threw away every choice after the first.
 * Joined with `;`, the separator HubSpot's multi-checkbox properties expect.
 */
const MULTI = new Set(['forms_wanted']);
const valueOf = (form, name) =>
  MULTI.has(name)
    ? form.getAll(name).map((v) => clip(v, 60)).filter(Boolean).join(';')
    : clip(form.get(name), name === 'forms_detail' ? 1000 : 300).trim();

const clip = (v, n = 300) => (typeof v === 'string' ? v.slice(0, n) : '');

export async function onRequestPost(context) {
  const { request, env } = context;
  const outcomes = [];

  // Where to send them back to. Restricted to our own guides so the endpoint cannot be
  // used as an open redirect.
  const ALLOWED = new Set([
    '/guides/school-sports-physicals/',
    '/guides/fmla-disability-paperwork/',
    '/form-filler/',
  ]);
  let back = '/guides/school-sports-physicals/';

  try {
    const form = await request.formData();
    const origin = clip(form.get('return_to'), 120);
    if (ALLOWED.has(origin)) back = origin;

    const email = clip(form.get('email'), 200).trim();
    if (!email || !email.includes('@')) {
      return redirect(request, back, 'invalid', outcomes);
    }

    const guid = env && env.HUBSPOT_WAITLIST_FORM_GUID;
    if (!guid) {
      outcomes.push('hubspot:unconfigured');
    } else {
      const portal = (env && env.HUBSPOT_PORTAL_ID) || PORTAL_ID_DEFAULT;
      const fields = [];
      for (const [name, hsName] of Object.entries(FIELD_MAP)) {
        const value = valueOf(form, name);
        if (value) fields.push({ name: hsName, value });
      }

      // hutk is what retroactively attaches everything this visitor already browsed to
      // the new contact. Without it the signup arrives with no history.
      const cookie = request.headers.get('Cookie') || '';
      const hutk = (cookie.match(/(?:^|;\s*)hubspotutk=([^;]*)/) || [])[1];

      try {
        const res = await fetch(
          `https://api.hsforms.com/submissions/v3/integration/submit/${portal}/${guid}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fields,
              context: {
                pageUri: request.headers.get('Referer') || back,
                pageName: 'Form completion waitlist',
                ...(hutk ? { hutk } : {}),
              },
            }),
          },
        );
        // HubSpot returns 200 for unknown field names and silently drops them, so a
        // 200 here does NOT prove the properties exist. Verify in the CRM after the
        // first real submission — see docs/HUBSPOT-SETUP.md.
        outcomes.push(res.ok ? 'hubspot:ok' : `hubspot:${res.status}`);
      } catch {
        outcomes.push('hubspot:error');
      }
    }
  } catch {
    outcomes.push('parse:error');
  }

  return redirect(request, back, 'ok', outcomes);
}

function redirect(request, path, status, outcomes) {
  const to = new URL(path, request.url);
  to.searchParams.set('waitlist', status === 'ok' ? '1' : status);
  return new Response(null, {
    status: 303,
    headers: {
      Location: to.toString(),
      'X-RR-Waitlist': outcomes.join(',') || 'none',
      'Cache-Control': 'no-store',
    },
  });
}
