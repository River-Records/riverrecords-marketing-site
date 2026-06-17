#!/usr/bin/env python3
"""
Generate the AANP 2026 QR handout for the /np landing page.

Outputs two files next to this script:
  - stream-aanp-qr.png      standalone high-res QR (brand green on white)
  - stream-aanp-handout.pdf print-ready US Letter sheet, 12 tear-off tickets/page

The QR encodes the /np page with UTM tracking so conference scans are
attributable in GTM/GA (campaign: aanp-frank-2026). A clean, readable URL
(riverrecords.ai/aanp, which 301s to /np) is printed under each code.

Usage:
    pip install "qrcode[pil]" reportlab
    python generate_handout.py

Edit URL / SHORT / COLS / ROWS below to retarget or change the layout.
"""

import os
import qrcode
from qrcode.constants import ERROR_CORRECT_Q
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

# --- What the QR points at (tracked) and the human-readable URL we print ---
URL = ("https://www.riverrecords.ai/np"
       "?utm_source=aanp-conference&utm_medium=qr"
       "&utm_campaign=aanp-frank-2026&utm_content=frank-handout")
SHORT = "riverrecords.ai/aanp"

# --- Layout ---
COLS, ROWS = 3, 4          # tickets per page (3x4 = 12)

# --- Brand palette (mirrors public/shared.css) ---
GREEN = HexColor("#1e5a3e")
INK   = HexColor("#0f1a14")
MUTE  = HexColor("#566b60")
RULE  = HexColor("#cfd8d2")

HERE = os.path.dirname(os.path.abspath(__file__))
QR_PATH  = os.path.join(HERE, "stream-aanp-qr.png")
PDF_PATH = os.path.join(HERE, "stream-aanp-handout.pdf")


def make_qr():
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_Q, box_size=20, border=2)
    qr.add_data(URL)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0f3a26", back_color="white").convert("RGB")
    img.save(QR_PATH)
    return QR_PATH


def ticket(c, qr_reader, x, y, w, h):
    # dashed cut border
    c.setStrokeColor(RULE); c.setLineWidth(0.5); c.setDash(3, 3)
    c.rect(x + 3, y + 3, w - 6, h - 6, stroke=1, fill=0); c.setDash()
    cx = x + w / 2
    # header
    c.setFillColor(INK); c.setFont("Times-Bold", 11)
    c.drawCentredString(cx, y + h - 20, "Stream")
    c.setFont("Helvetica", 6.7); c.setFillColor(MUTE)
    c.drawCentredString(cx, y + h - 29, "BY RIVER RECORDS")
    # QR
    qsize = min(w, h) * 0.46
    c.drawImage(qr_reader, cx - qsize / 2, y + h - 34 - qsize, qsize, qsize)
    # short url
    yb = y + h - 44 - qsize
    c.setFont("Helvetica-Bold", 8.5); c.setFillColor(GREEN)
    c.drawCentredString(cx, yb, SHORT)
    # value line
    c.setFont("Helvetica", 6.6); c.setFillColor(INK)
    c.drawCentredString(cx, yb - 12, "Documentation & care ops for")
    c.drawCentredString(cx, yb - 20, "NP-led primary care practices")
    # frank / pilot line
    c.setFont("Helvetica-Oblique", 6.4); c.setFillColor(MUTE)
    c.drawCentredString(cx, yb - 32, "Met us through Frank? Mention it")
    c.drawCentredString(cx, yb - 40, "for a 60-day no-cost pilot.")


def make_pdf(qr_path):
    qr_reader = ImageReader(qr_path)
    pw, ph = letter
    margin = 0.4 * inch
    gw = (pw - 2 * margin) / COLS
    gh = (ph - 2 * margin) / ROWS

    c = canvas.Canvas(PDF_PATH, pagesize=letter)
    c.setTitle("Stream x AANP 2026 - QR handout")
    for r in range(ROWS):
        for col in range(COLS):
            ticket(c, qr_reader, margin + col * gw,
                   ph - margin - (r + 1) * gh, gw, gh)
    c.showPage(); c.save()


if __name__ == "__main__":
    qr_path = make_qr()
    make_pdf(qr_path)
    print(f"Wrote {QR_PATH}")
    print(f"Wrote {PDF_PATH}  ({COLS * ROWS} tickets/page)")
