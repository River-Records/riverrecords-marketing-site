/**
 * Interviews and podcast appearances — the proof that is not us talking about ourselves.
 *
 * Every other page here is the company describing the company. That is the weakest
 * evidence there is, and every competitor has exactly as much of it. An interview is
 * somebody else putting their name and their audience behind the same conversation, and
 * it is the one claim on the site a visitor can check without trusting us first. That is
 * why these link out to the publisher rather than being re-hosted, embedded or
 * paraphrased: the point is that the source is somewhere we do not control.
 *
 * WHAT THIS IS NOT
 * Not a logo wall. Two appearances shown as two appearances reads as true; two dressed
 * up as "featured in" reads as a company padding, and the audience is clinicians who have
 * been sold to by better-funded vendors all year. Same rule as the comparison pages and
 * the `limits` FAQs — conceding the size of the thing is what makes it believable.
 *
 * FOUR EDITING RULES
 *  - **Say what each one actually is.** `kind` drives a visible label, and a written Q&A
 *    is labelled a written Q&A. Calling it a podcast is a small lie in front of a link
 *    that disproves it in one click.
 *  - **Link the publisher's own page**, never a re-upload, a transcript we host, or a
 *    player embed. A third-party URL is the entire mechanism.
 *  - **Nothing here is dated by guess.** `date` is optional precisely so that an undated
 *    piece stays undated rather than acquiring a plausible-looking one.
 *  - **External links rot and the build cannot tell.** `verify-internal-links.mjs` only
 *    reads hrefs starting with `/`, so a dead interview link would sit on /about/
 *    indefinitely — which is worse than no section, because the visitor who clicks it is
 *    the visitor who was checking. Re-run the live check below when you touch this file.
 *
 * `people` matches the same way `authorMatch` does on the team pages, so an appearance
 * shows up on its speaker's profile without a second list to keep in sync.
 */

/**
 * Last checked by opening every URL in this file. Re-check when editing, and update this
 * date — a link list nobody has opened is a link list that is probably wrong.
 *
 * The weekly CI job (.github/workflows/press-links.yml) opens them too, so a link that
 * dies goes red without anybody remembering. This date is still worth keeping: CI tells
 * you a URL resolves, not that it still leads to the interview it used to.
 *
 * Both URLs answered 200 from CI on 22 September 2026, so they resolve and neither
 * publisher blocks the runner. The remaining gap is narrower but real: the titles, outlet,
 * host and date below were taken from search results rather than read off the pages, and
 * a 200 cannot tell you an outlet has re-titled or replaced a piece at the same URL. Read
 * both once and drop this paragraph.
 */
export const PRESS_VERIFIED = '22 September 2026 (URLs resolve; metadata unread — see above)';

export type PressItem = {
  /** Stable key. Used by the verify script and safe to reference from analytics later. */
  key: string;
  /** What the thing is, verbatim, in the visitor's terms. Drives the visible label. */
  kind: 'podcast' | 'written-interview';
  /** Who published it — the name that carries the credibility, so it leads visually. */
  outlet: string;
  /** The piece's own title, not a rewritten one. */
  title: string;
  /** The publisher's canonical page for it. */
  url: string;
  /** Interviewer, where naming them tells the visitor something. */
  host?: string;
  /** ISO date, omitted rather than guessed. */
  date?: string;
  /** Human-readable runtime for audio. Omit for anything that is not timed. */
  duration?: string;
  /** One line on what was actually discussed. Not a pitch — they can hear the pitch. */
  note: string;
  /** Who from the team appears in it. Matched against the team pages' `authorMatch`. */
  people: string[];
};

export const KIND_LABEL: Record<PressItem['kind'], string> = {
  podcast: 'Podcast',
  'written-interview': 'Written Q&A',
};

export const press: PressItem[] = [
  {
    key: 'uprising-show-2025',
    kind: 'podcast',
    outlet: 'The Uprising Show',
    title:
      'How River Records Is Transforming Medical Documentation With AI and Problem-Oriented Charting',
    url: 'https://podcasts.apple.com/us/podcast/how-river-records-is-transforming-medical-documentation/id1748631029?i=1000711748485',
    host: 'Vivek Nanda',
    date: '2025-06-05',
    duration: '52 min',
    note: 'Where the problem-oriented chart came from — the 2018 discharge-summary idea, the research that followed, and why LLMs made the original plan buildable.',
    people: ['Jacob Kantrowitz'],
  },
  {
    key: 'offcall-physician-builder',
    kind: 'written-interview',
    outlet: 'Offcall',
    title: 'Physician Builder Spotlight: River Records Co-Founder Jacob Kantrowitz',
    url: 'https://www.offcall.com/learn/discussions/q-and-a-with-river-records-chief-medical-and-scientific-officer-dr-jake-kantrowitz',
    note: 'A Q&A for an audience of practising physicians, on building software while still seeing patients.',
    people: ['Jacob Kantrowitz'],
  },
];

/** Appearances by one person, newest first, undated ones last. Used by TeamMember. */
export function pressBy(matches: readonly string[]): PressItem[] {
  const m = matches.map((s) => s.toLowerCase());
  return press
    // Same direction as the team pages' post matching: the entry's name contains one of
    // the profile's match strings. Not bidirectional — "Jake" would then match anyone.
    .filter((item) => item.people.some((p) => m.some((x) => p.toLowerCase().includes(x))))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

/** Everything, newest first, undated last. */
export const pressNewestFirst: PressItem[] = [...press].sort((a, b) =>
  (b.date || '').localeCompare(a.date || ''),
);
