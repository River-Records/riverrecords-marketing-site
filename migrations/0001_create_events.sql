-- Behavioural events from the marketing site, keyed by the anonymous visitor id.
--
-- WHY A DATABASE AND NOT AN ANALYTICS PRODUCT
-- The site already generates good anonymous data — rr_vid, first/last touch, engaged
-- read time, scroll depth, video plays — and until now discarded all of it. Cloudflare
-- Web Analytics keeps aggregates that cannot be joined to anything, and no GTM tag
-- listens to the dataLayer at all.
--
-- Cloudflare Analytics Engine was the other candidate and is the wrong shape here: it
-- retains 90 days, samples under load, and answers "how many plays last week" rather
-- than "what did this visitor do before they filled in the calculator". The second
-- question is the whole point, and it is a row lookup. D1 also lets a person's rows be
-- deleted on request, which Analytics Engine cannot do at all.
--
-- ONE TABLE ON PURPOSE
-- Sessions, visitor summaries and first-touch attribution are all derivable from this
-- with SQL. Materialising them now would mean maintaining them forever, before anyone
-- knows which questions get asked twice.

CREATE TABLE IF NOT EXISTS events (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,

  -- The anonymous first-party id from attribution.js. Same value as the
  -- .riverrecords.ai cookie, so once a visitor identifies themselves anywhere their
  -- entire prior anonymous history can be attached to that person.
  rr_vid   TEXT    NOT NULL,

  -- dataLayer event name: video_play, post_read, cta_click_signup, page_view…
  event    TEXT    NOT NULL,
  path     TEXT,

  -- Server-assigned epoch ms. Deliberately not the client's clock, which is wrong
  -- often enough — wrong timezone, wrong date, deliberately skewed — to poison any
  -- ordering built on it.
  ts       INTEGER NOT NULL,

  -- Two-letter country from Cloudflare's edge. Coarse enough not to identify anyone,
  -- useful enough to spot that a spike came entirely from one place.
  country  TEXT,

  -- Set server-side from the user agent, which is then discarded rather than stored.
  -- Kept as a column rather than dropped at write time so the filter can be revised
  -- later against data already collected.
  bot      INTEGER NOT NULL DEFAULT 0,

  -- Event-specific fields as JSON: engaged_seconds, scroll_depth, video_key,
  -- video_trigger, cta_label, first-touch source. Allow-listed on the client, so a
  -- field cannot start arriving here just because someone added it to a dataLayer push.
  props    TEXT
);

-- Journey for one visitor, newest first. The query this table exists to answer.
CREATE INDEX IF NOT EXISTS idx_events_vid_ts ON events (rr_vid, ts DESC);

-- Time-range scans: "everything last week", which every rollup starts with.
CREATE INDEX IF NOT EXISTS idx_events_ts ON events (ts DESC);

-- Counting one kind of event across a period, e.g. video_play by week.
CREATE INDEX IF NOT EXISTS idx_events_event_ts ON events (event, ts DESC);
