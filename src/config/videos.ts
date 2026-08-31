/**
 * Product walkthrough videos (Loom).
 *
 * Single source of truth — the homepage section, /intake and /features/huddle all
 * read from here, so a re-recorded video means changing the id in one place.
 *
 * `ratio` is the real video dimension (1280x828), not what Loom's oEmbed reports.
 * oEmbed returns 1668x1251 for these, which is its default player box rather than
 * the footage; building to that would letterbox every video. Verified by reading
 * videoWidth/videoHeight off the <video> element in the actual embed.
 *
 * Thumbnails are the first frame of Loom's animated preview GIF, saved as static
 * JPEGs in public/images/videos/ so the homepage doesn't pull ~1MB of animated GIF
 * from Loom's CDN on every load. To refresh one after re-recording:
 *   curl -s "https://www.loom.com/v1/oembed?url=<share url>"   # -> thumbnail_url
 *   curl -sL -o /tmp/x.gif "<thumbnail_url>"
 *   sips -s format jpeg -s formatOptions 80 --resampleWidth 900 /tmp/x.gif \
 *        --out public/images/videos/<key>.jpg
 *
 * All three show the fictional "John A. Doe" demo patient — no real patient data.
 */

export type ProductVideo = {
  /** Loom id — the part after /share/ or /embed/ */
  id: string;
  /** Stable key: used for the dataLayer event and the thumbnail filename */
  key: string;
  /** Monospace eyebrow, e.g. "01 · INTAKE" */
  label: string;
  title: string;
  blurb: string;
  durationLabel: string;
  /** Seconds — drives the VideoObject schema */
  durationSeconds: number;
  thumb: string;
  thumbAlt: string;
  /** ISO 8601 date the video was published, for schema */
  uploadDate: string;
};

export const videoRatio = { width: 1280, height: 828 };

export const productVideos: ProductVideo[] = [
  {
    id: '8c5894ee659347fe8f83ab5db614f306',
    key: 'intake',
    label: '01 · INTAKE',
    title: 'Fax and document upload',
    blurb:
      'Turn external documents into clinic assets that help you take care of your patients.',
    durationLabel: '3:35',
    durationSeconds: 215,
    thumb: '/images/videos/intake.jpg',
    thumbAlt:
      'Stream with a chest CT report uploading and pending review, before any problems have been extracted',
    uploadDate: '2026-08-31',
  },
  {
    id: 'cb2cbf0453c64c3aadfd77c8387999f6',
    key: 'scribe',
    label: '02 · AI SCRIBE',
    title: 'AI scribe',
    blurb:
      'Turn your visits into structured notes that you can review and reuse easily.',
    durationLabel: '3:09',
    durationSeconds: 189,
    thumb: '/images/videos/scribe.jpg',
    thumbAlt:
      'Stream after a visit transcription completes, offering to generate problems from the encounter',
    uploadDate: '2026-08-31',
  },
  {
    id: 'd7cb0d5e35c54056b396c086054a0976',
    key: 'huddle',
    label: '03 · HUDDLE',
    title: 'Huddle',
    blurb:
      'Review your visits right alongside the external documents and tasks you need to get done. Nothing is lost. Nothing needs to be resurfaced.',
    durationLabel: '4:19',
    durationSeconds: 259,
    thumb: '/images/videos/huddle.jpg',
    thumbAlt:
      'Stream Huddle showing hyperlipidemia, hypertension and prediabetes with their most recent assessment and plan',
    uploadDate: '2026-08-31',
  },
];

/** Look one up by key — for pages that embed a single video. */
export const videoByKey = (key: string): ProductVideo => {
  const found = productVideos.find((v) => v.key === key);
  if (!found) throw new Error(`Unknown product video: ${key}`);
  return found;
};
