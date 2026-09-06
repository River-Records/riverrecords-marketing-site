// csv.mjs — streaming CSV reader/writer, no dependencies.
//
// The source files are large (the Doctors and Clinicians file is ~2.9M rows, the
// Physician & Other Practitioners file ~1.2M) so nothing here loads a whole file into
// memory, and rows are handed to the caller as arrays rather than objects: building a
// 30-key object per row costs more than the rest of the pipeline put together.
//
// Records are found by quote parity rather than by splitting on newlines, because a
// quoted field may legally contain one. Every quote character either toggles quoting or
// is half of an escaped "" pair, so a record is complete exactly when the accumulated
// text holds an even number of them.

import { createReadStream } from 'node:fs';
import { createGunzip } from 'node:zlib';

// CMS ships the same column under different spellings across releases and across the
// CSV download vs the JSON API ("Rndrng_NPI" / "rndrng_npi", "City/Town" / "city_town").
// Normalising the header once means callers can look up one canonical name.
export const normKey = (h) =>
  h.replace(/^﻿/, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

function parseLine(line) {
  if (line.indexOf('"') === -1) return line.split(',');
  const out = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else field += c;
    } else if (c === '"' && field === '') inQuotes = true;
    else if (c === ',') { out.push(field); field = ''; }
    else field += c;
  }
  out.push(field);
  return out;
}

const countQuotes = (s) => { let n = 0; for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) === 34) n++; return n; };

/**
 * Stream a CSV. `onHeader(headerKeys)` runs once with normalised column names;
 * `onRow(fields)` runs per data row. Returning `false` from onRow stops the read.
 */
export async function readCsv(path, { onHeader, onRow }) {
  let stream = createReadStream(path, { highWaterMark: 1 << 20 });
  if (path.endsWith('.gz')) stream = stream.pipe(createGunzip());

  let pending = '';
  let quotes = 0;
  let header = null;
  let rows = 0;
  let stop = false;

  const flush = (record) => {
    if (record === '') return;
    const fields = parseLine(record);
    if (header === null) {
      header = fields.map(normKey);
      if (onHeader) onHeader(header);
      return;
    }
    rows++;
    if (onRow(fields) === false) stop = true;
  };

  for await (const chunk of stream) {
    if (stop) { stream.destroy(); break; }
    let buf = pending + chunk.toString('utf8');
    pending = '';
    let start = 0;
    let nl;
    while ((nl = buf.indexOf('\n', start)) !== -1) {
      const candidate = buf.slice(start, nl);
      quotes += countQuotes(candidate);
      if (quotes % 2 === 0) {
        // A complete record: everything from the last record boundary to here.
        flush(buf.slice(0, nl).replace(/\r$/, ''));
        buf = buf.slice(nl + 1);
        start = 0;
        quotes = 0;
        if (stop) break;
      } else {
        // Newline inside a quoted field — keep scanning past it.
        start = nl + 1;
      }
    }
    pending = buf;
    quotes = countQuotes(pending);
  }
  if (!stop) flush(pending.replace(/\r$/, '').replace(/\n$/, ''));
  return { header, rows };
}

const needsQuote = /[",\n\r]|^\s|\s$/;
export const csvCell = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return needsQuote.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};
export const csvLine = (values) => values.map(csvCell).join(',') + '\n';
