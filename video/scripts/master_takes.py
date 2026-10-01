"""Turn raw recorded takes into narration for one video.

  python3 scripts/master_takes.py <slug> <dir>

<dir> holds one recording per line, named <line id>.<ext> (m4a, mp3, wav, webm…).
Each is decoded with Remotion's bundled ffmpeg, then:

  - trimmed to the speech, with a 0.12s lead-in and 0.3s tail
  - cleared of an isolated click or tap at either end (a burst under 0.3s set
    more than a second apart from the speech — the phone's record button)
  - level-matched to -20 dB speech RMS behind a -1.5 dBFS peak limiter, so every
    line, and every video, reads at the same loudness

Writes public/narration/<slug>/<id>.wav, marks the video "recorded" (so the TTS
script leaves the takes alone) and re-measures its timing. Needs numpy and
soundfile.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
HOP = 0.02
HEAD, TAIL = 0.12, 0.3
TARGET_RMS_DB = -20.0
CEILING = 10 ** (-1.5 / 20)


def frames_db(x, r):
    w = int(r * HOP)
    fr = np.array([np.sqrt(np.mean(x[i:i + w] ** 2)) for i in range(0, len(x) - w, w)])
    return fr, 20 * np.log10(fr + 1e-9)


def speech_runs(x, r):
    _, db = frames_db(x, r)
    active = db > max(np.percentile(db, 10) + 12, np.percentile(db, 99) - 35)
    runs, i = [], 0
    while i < len(active):
        if not active[i]:
            i += 1
            continue
        j = i
        while j < len(active) and active[j]:
            j += 1
        if runs and (i - runs[-1][1]) * HOP < 0.35:
            runs[-1][1] = j
        else:
            runs.append([i, j])
        i = j
    if not runs:
        raise ValueError("no speech found")
    is_click = lambda run, gap: (run[1] - run[0]) * HOP < 0.3 and gap * HOP > 1.0
    while len(runs) > 1 and is_click(runs[0], runs[1][0] - runs[0][1]):
        runs.pop(0)
    while len(runs) > 1 and is_click(runs[-1], runs[-1][0] - runs[-2][1]):
        runs.pop()
    return runs


def limit(x, r):
    # Peak envelope with a 2ms look-ahead and 80ms release; gain only ever drops.
    look = int(0.002 * r)
    a = np.maximum(np.abs(x), np.abs(np.concatenate([x[look:], np.zeros(look)])))
    rel = np.exp(-1 / (0.08 * r))
    env = np.empty_like(a)
    e = 0.0
    for i, v in enumerate(a):
        e = v if v > e else e * rel + v * (1 - rel)
        env[i] = e
    return x * np.minimum(1.0, CEILING / np.maximum(env, 1e-9))


def master(src, dst):
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "raw.wav"
        subprocess.run(
            ["npx", "remotion", "ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-ac", "1", "-ar", "48000",
             "-c:a", "pcm_s16le", str(wav)],
            cwd=ROOT, check=True,
        )
        x, r = sf.read(wav)
    runs = speech_runs(x, r)
    w = int(r * HOP)
    start = max(0, int((runs[0][0] * HOP - HEAD) * r))
    end = min(len(x), int((runs[-1][1] * HOP + TAIL) * r))
    speech = np.concatenate([x[a * w:b * w] for a, b in runs])
    y = x[start:end] * (10 ** (TARGET_RMS_DB / 20) / np.sqrt(np.mean(speech ** 2)))
    y = limit(y, r)
    fade = int(0.02 * r)
    y[:fade] *= np.linspace(0, 1, fade)
    y[-fade:] *= np.linspace(1, 0, fade)
    sf.write(dst, y, r, subtype="PCM_16")
    return start / r, end / r, len(y) / r


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    slug, src_dir = sys.argv[1], Path(sys.argv[2])
    config_path = ROOT / "src/videos" / slug / "narration.json"
    config = json.loads(config_path.read_text())
    out = ROOT / "public/narration" / slug
    out.mkdir(parents=True, exist_ok=True)

    ids = [l["id"] for l in config["lines"]]
    found = {p.stem: p for p in src_dir.iterdir() if p.stem in ids}
    missing = [i for i in ids if i not in found]
    for line_id, src in found.items():
        s, e, n = master(src, out / f"{line_id}.wav")
        print(f"  {slug}/{line_id}: kept {s:.2f}-{e:.2f}s of the recording -> {n:.2f}s")
    if missing:
        print(f"  not recorded (left as they are): {', '.join(missing)}")

    if not missing:
        config["narrator"] = "recorded"
        config_path.write_text(json.dumps(config, indent=2, ensure_ascii=False) + "\n")
    subprocess.run([sys.executable, "scripts/narrate.py", slug, "--timing-only"], cwd=ROOT, check=True)


if __name__ == "__main__":
    main()
