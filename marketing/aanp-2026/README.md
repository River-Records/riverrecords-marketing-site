# AANP 2026 — QR handout for the /np landing page

Print materials for nurse-practitioner outreach at the 2026 AANP National
Conference (and ongoing NP outreach via Frank / NNPEN). They point to the
[`/np`](../../src/pages/np/index.astro) landing page.

## Files
- **`stream-aanp-handout.pdf`** — print-ready, US Letter, **12 tear-off tickets
  per page** with dashed cut guides. Hand these out / leave on tables.
- **`stream-aanp-qr.png`** — standalone high-res QR (brand green) for badges,
  posters, or slides.
- **`generate_handout.py`** — regenerates both files.

## What the QR encodes
```
https://www.riverrecords.ai/np?utm_source=aanp-conference&utm_medium=qr&utm_campaign=aanp-frank-2026&utm_content=frank-handout
```
Scans are attributable in GTM/GA under campaign `aanp-frank-2026`, separate from
web traffic. The readable URL printed on each ticket is `riverrecords.ai/aanp`,
which 301-redirects to `/np`. "Mention Frank" gives person-level attribution on
top of the UTM source.

## Regenerate / edit
```bash
pip install "qrcode[pil]" reportlab
python generate_handout.py
```
Edit `URL`, `SHORT`, or `COLS`/`ROWS` at the top of `generate_handout.py` to
retarget the link or change the layout (e.g. fewer, larger cards).

## Printing tips
- Print on white cardstock (80–100 lb cover) and cut along the dashed guides, or
  upload the PDF to an online printer and ask for **perforated card sheets**.
- Always print one test page and scan all corners with a phone before a big run.
- Keep each QR ≥ ~0.8 in so it scans reliably.
