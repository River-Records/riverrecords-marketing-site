/**
 * GET /organization.jsonld — the machine-readable description of this site.
 *
 * The homepage returns `Link: </organization.jsonld>; rel="describedby"` (see
 * public/_headers), which is RFC 8288's "a resource providing information about the
 * link's context". An agent can fetch ~1KB of structured description instead of parsing
 * a 10KB page.
 *
 * WHAT THIS DELIBERATELY IS NOT
 * Agent-readiness scanners also want `api-catalog`, `service-desc` and `service-doc`.
 * All three describe APIs — RFC 9727 requires api-catalog to be a catalog of APIs at a
 * fixed well-known URI, and RFC 8631's service-desc is a machine-readable API
 * description. This site has no public API. Publishing an empty catalogue to turn a
 * scorecard green would hand any agent that followed the link precisely nothing, so
 * `describedby` is the only one of the four claimed here.
 *
 * Generated from src/config/organization.ts, the same source as the inline JSON-LD in
 * Base.astro, so the two cannot disagree.
 */
import type { APIRoute } from 'astro';
import { organizationDocument } from '../config/organization';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(organizationDocument, null, 2) + '\n', {
    headers: {
      // Also set in public/_headers, because a static build writes a file and Cloudflare
      // types it from the extension — it does not know `.jsonld`. Set in both places so
      // the type is right in local preview too.
      'Content-Type': 'application/ld+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
