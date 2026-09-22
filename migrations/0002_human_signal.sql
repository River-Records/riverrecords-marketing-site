-- Separating people from machines, as a view rather than a rule at write time.
--
-- WHY THIS EXISTS
-- The `bot` column reads the user agent, which catches crawlers that announce
-- themselves and nothing else. In the first week of collection, 40% of rows marked
-- bot = 0 were automated: 225 visitors, each loading /baa/ exactly once, no referrer,
-- two events apiece, then gone. They execute JavaScript, so the collector fired normally
-- and the user agent looked like a browser.
--
-- WHY A VIEW AND NOT A BETTER FLAG
-- Whether someone is a person is not knowable when their first event arrives — a bot's
-- page_view and a human's page_view are identical. It only becomes knowable from what
-- they do next, which means it belongs in a query, not in a column. Keeping the raw rows
-- and classifying on read also means the definition can be revised against data already
-- collected, which a write-time decision throws away permanently.
--
-- THE TEST IS POSITIVE, NOT A BLOCKLIST
-- `human_signal` is emitted once when a visitor does something a page-fetcher has no
-- reason to do. Its absence is not proof of a bot — a person can land, read what is on
-- screen, and leave — but its presence is strong evidence of a person. We would rather
-- undercount humans than report bots as traffic.
--
-- IMPORTANT: THIS IS FORWARD-LOOKING.
-- Nothing collected before public/event-collector.js shipped the signal can satisfy it,
-- so these views are empty for the earlier rows by construction. That is correct, not a
-- bug — those rows genuinely cannot be classified this way. docs/DATA-PIPELINE.md has a
-- separate query for reading the historical period with the cruder heuristic.

DROP VIEW IF EXISTS human_events;
CREATE VIEW human_events AS
SELECT e.*
FROM events e
WHERE e.bot = 0
  -- navigator.webdriver, which automation tools are specified to set. Trivially
  -- spoofable; worth having because plenty of automation does not bother.
  AND NOT EXISTS (
    SELECT 1 FROM events w
    WHERE w.rr_vid = e.rr_vid
      AND json_extract(w.props, '$.webdriver') IN (1, 'true')
  )
  AND EXISTS (
    SELECT 1 FROM events h
    WHERE h.rr_vid = e.rr_vid
      AND h.event = 'human_signal'
  );

-- One row per person, for the question actually asked most often: how many, from where,
-- how deep, and did they come back.
DROP VIEW IF EXISTS human_visitors;
CREATE VIEW human_visitors AS
SELECT
  rr_vid,
  MIN(ts)                                        AS first_seen,
  MAX(ts)                                        AS last_seen,
  COUNT(*)                                       AS events,
  COUNT(DISTINCT path)                           AS pages,
  COUNT(DISTINCT date(ts / 1000, 'unixepoch'))   AS days_active,
  MAX(country)                                   AS country
FROM human_events
GROUP BY rr_vid;
