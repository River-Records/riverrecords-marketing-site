#!/usr/bin/env python3
"""
Generate the Stream x NNPEN partnership one-pager (US Letter, portrait).

Outputs next to this script:
  - stream-nnpen-onepager.pdf   shareable / print-ready
  - stream-nnpen-onepager.png   high-res render for email/Slack/slides

Co-branded with the River Records mark and the NNPEN logo (both pulled from
public/). The QR + URL point to the /np landing page with NNPEN tracking.

Usage:
    pip install "qrcode[pil]" reportlab pymupdf
    python generate_onepager.py
"""

import os
import qrcode
from qrcode.constants import ERROR_CORRECT_Q
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
ICON = os.path.join(ROOT, "public", "RiverRecords_Logo_Icon_Color_200x200.png")
NNPEN = os.path.join(ROOT, "public", "images", "nnpen-logo.png")
QR_TMP = os.path.join(HERE, "stream-nnpen-qr.png")
PDF = os.path.join(HERE, "stream-nnpen-onepager.pdf")
PNG = os.path.join(HERE, "stream-nnpen-onepager.png")

URL = ("https://www.riverrecords.ai/np"
       "?utm_source=nnpen&utm_medium=onepager&utm_campaign=nnpen-partnership")

NAVY   = HexColor("#24599e")
DARK   = HexColor("#0c2747")
TEAL   = HexColor("#1f8e96")
TEALLT = HexColor("#7fd0d6")
INK    = HexColor("#20303a")
MUTE   = HexColor("#5d6b76")
RULE   = HexColor("#d7dee4")
WHITE  = HexColor("#ffffff")

PW, PH = letter            # 612 x 792
M = 54                     # margin
CW = PW - 2 * M            # content width


def wrap(c, text, font, size, maxw):
    words, lines, line = text.split(), [], ""
    for w in words:
        t = (line + " " + w).strip()
        if c.stringWidth(t, font, size) <= maxw:
            line = t
        else:
            if line:
                lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines


def tracked(c, text, x, y, font, size, color, tracking=1.2):
    c.setFont(font, size)
    c.setFillColor(color)
    cx = x
    for ch in text:
        c.drawString(cx, y, ch)
        cx += c.stringWidth(ch, font, size) + tracking


CAPS = [
    ("Problem-structured notes",
     "Ambient scribe writes an A&P per problem, not date-organized paragraphs."),
    ("Longitudinal chart",
     "Organized around the problems you're actively managing, across time."),
    ("Document upload",
     "Identifies the patient, summarizes content, and extracts tasks to review."),
    ("Branded referrals",
     "Referral letters from your chart data, ready to fax or send."),
    ("Pre-visit huddle",
     "Active problems, recent vitals, current meds, and stale issues at a glance."),
    ("Task management",
     "Pulled from notes and documents, assigned, and tracked to completion."),
]


def make_qr():
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_Q, box_size=16, border=1)
    qr.add_data(URL)
    qr.make(fit=True)
    qr.make_image(fill_color="#0c2747", back_color="white").convert("RGB").save(QR_TMP)


def build():
    make_qr()
    c = canvas.Canvas(PDF, pagesize=letter)
    c.setTitle("Stream x NNPEN - one-pager")

    # ---- Header ----
    top = PH - M
    c.drawImage(ImageReader(ICON), M, top - 36, 36, 36, mask="auto")
    c.setFont("Times-Bold", 19); c.setFillColor(INK)
    c.drawString(M + 46, top - 18, "Stream")
    c.setFont("Helvetica", 7); c.setFillColor(MUTE)
    c.drawString(M + 46, top - 30, "BY RIVER RECORDS")
    # NNPEN, right aligned
    nw = 122; nh = nw * 604 / 1832
    c.setFont("Helvetica", 6.5); c.setFillColor(MUTE)
    c.drawRightString(PW - M, top - 6, "IN PARTNERSHIP WITH")
    c.drawImage(ImageReader(NNPEN), PW - M - nw, top - 12 - nh, nw, nh, mask="auto")
    # rule
    ry = top - 50
    c.setStrokeColor(RULE); c.setLineWidth(1); c.line(M, ry, PW - M, ry)

    y = ry - 30
    # ---- Eyebrow ----
    tracked(c, "FOR NURSE PRACTITIONERS IN INDEPENDENT PRIMARY CARE",
            M, y, "Helvetica-Bold", 8.5, TEAL, 1.4)

    # ---- Headline ----
    y -= 30
    c.setFont("Times-Bold", 25); c.setFillColor(NAVY)
    c.drawString(M, y, "Documentation and care operations")
    y -= 29
    c.drawString(M, y, "for the practice you actually run.")

    # ---- Subhead ----
    y -= 28
    sub = ("Stream is the AI-native platform built for independent primary care — "
           "including NP-led practices. The note is just the start: it closes the loop "
           "on tasks, referrals, faxes, and follow-up.")
    c.setFillColor(MUTE)
    for ln in wrap(c, sub, "Helvetica", 10.5, CW):
        c.setFont("Helvetica", 10.5)
        c.drawString(M, y, ln)
        y -= 15

    # ---- What Stream does ----
    y -= 16
    tracked(c, "WHAT STREAM DOES", M, y, "Helvetica-Bold", 8.5, TEAL, 1.4)
    y -= 22
    col_w = (CW - 26) / 2
    row_top = y
    for i, (term, desc) in enumerate(CAPS):
        col = i % 2
        row = i // 2
        x = M + col * (col_w + 26)
        cy = row_top - row * 50
        c.setFont("Helvetica-Bold", 11); c.setFillColor(TEAL)
        c.drawString(x, cy, "✓")
        c.setFont("Helvetica-Bold", 9.7); c.setFillColor(INK)
        c.drawString(x + 15, cy, term)
        c.setFillColor(MUTE)
        dy = cy - 13
        for ln in wrap(c, desc, "Helvetica", 8.5, col_w - 15):
            c.setFont("Helvetica", 8.5)
            c.drawString(x + 15, dy, ln)
            dy -= 11
    y = row_top - 3 * 50 - 6

    # ---- Offer box ----
    box_h = 92
    box_y = y - box_h
    c.setFillColor(DARK)
    c.roundRect(M, box_y, CW, box_h, 10, stroke=0, fill=1)
    pad = 20
    bx = M + pad
    by = y - pad - 4
    tracked(c, "A PARTNER OF NNPEN", bx, by, "Helvetica-Bold", 8, TEALLT, 1.4)
    by -= 22
    c.setFont("Times-Bold", 17); c.setFillColor(WHITE)
    c.drawString(bx, by, "A 60-day no-cost pilot for NP-led practices")
    by -= 19
    offer = ("No credit card, no commitment. We set you up, train your team, and you "
             "decide at 60 days. Onboarding with a physician — Jake Kantrowitz, MD, PhD.")
    c.setFillColor(HexColor("#cdd8e6"))
    for ln in wrap(c, offer, "Helvetica", 9.5, CW - 2 * pad):
        c.setFont("Helvetica", 9.5)
        c.drawString(bx, by, ln)
        by -= 13

    # ---- Footer ----
    fy = box_y - 26
    c.setStrokeColor(RULE); c.setLineWidth(1); c.line(M, fy + 8, PW - M, fy + 8)
    qsize = 64
    c.drawImage(ImageReader(QR_TMP), M, fy - qsize, qsize, qsize)
    fx = M + qsize + 16
    c.setFont("Helvetica-Bold", 12); c.setFillColor(NAVY)
    c.drawString(fx, fy - 14, "Talk to a clinician — no pitch, just the product.")
    c.setFont("Helvetica-Bold", 10.5); c.setFillColor(TEAL)
    c.drawString(fx, fy - 31, "riverrecords.ai/np")
    c.setFont("Helvetica", 9.5); c.setFillColor(MUTE)
    c.drawString(fx, fy - 46, "jacob@riverrecords.ai")
    c.setFont("Helvetica", 7.5); c.setFillColor(MUTE)
    c.drawRightString(PW - M, fy - qsize + 4,
                      "Built by physicians · Published in JAMA Network Open")

    c.showPage()
    c.save()

    # ---- PNG render ----
    try:
        import fitz
        doc = fitz.open(PDF)
        doc[0].get_pixmap(dpi=200).save(PNG)
    except Exception as e:
        print("PNG render skipped:", e)


if __name__ == "__main__":
    build()
    print("Wrote", PDF)
    print("Wrote", PNG)
