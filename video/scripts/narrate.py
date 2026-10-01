"""Generate placeholder narration for one video, or every video.

  python3 scripts/narrate.py <slug> [--timing-only]
  python3 scripts/narrate.py --all [--timing-only]

Reads src/videos/<slug>/narration.json; writes public/narration/<slug>/<id>.wav
and src/generated/timing/<slug>.json (seconds per line), which the composition
reads to time each scene.

To swap in a human narrator: record one file per line id, save it over
public/narration/<slug>/<id>.wav, and run with --timing-only to re-measure.
Recordings are used as-is, so master them to roughly the same level first.

Needs kokoro-onnx + soundfile, and the Kokoro model files in $KOKORO_DIR:
  kokoro-v1.0.onnx, voices-v1.0.bin
  (github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0)
"""
import json
import os
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
VIDEOS = ROOT / "src/videos"

# Every line leaves at the same peak, so the voice sits at one steady, audible
# level: TTS output arrives quiet (~-22 dBFS RMS), and most players start low.
PEAK_DBFS = -1.5


def normalize(samples):
    peak = np.abs(samples).max()
    return samples if peak == 0 else samples * (10 ** (PEAK_DBFS / 20) / peak)


def narrate(slug, timing_only, kokoro_factory):
    config = json.loads((VIDEOS / slug / "narration.json").read_text())
    out_audio = ROOT / "public/narration" / slug
    out_timing = ROOT / "src/generated/timing" / f"{slug}.json"
    out_audio.mkdir(parents=True, exist_ok=True)
    out_timing.parent.mkdir(parents=True, exist_ok=True)

    if not timing_only and config.get("narrator") == "recorded":
        print(f"{slug}: takes are recorded; leaving them alone (timing re-measured only).")
        timing_only = True

    if not timing_only:
        kokoro = kokoro_factory()
        for line in config["lines"]:
            samples, rate = kokoro.create(
                line.get("say", line["text"]), voice=config["voice"], speed=config["speed"], lang="en-us"
            )
            sf.write(out_audio / f"{line['id']}.wav", normalize(samples), rate)
            print(f"  {slug}/{line['id']}: {len(samples) / rate:.2f}s")

    timing = {}
    for line in config["lines"]:
        info = sf.info(out_audio / f"{line['id']}.wav")
        timing[line["id"]] = round(info.frames / info.samplerate, 3)
    out_timing.write_text(json.dumps(timing, indent=2) + "\n")
    print(f"wrote {out_timing.relative_to(ROOT)}")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    timing_only = "--timing-only" in sys.argv
    if "--all" in sys.argv:
        slugs = sorted(p.parent.name for p in VIDEOS.glob("*/narration.json"))
    elif args:
        slugs = args
    else:
        sys.exit(__doc__)

    cache = {}

    def kokoro_factory():
        if "k" not in cache:
            from kokoro_onnx import Kokoro

            model_dir = Path(os.environ.get("KOKORO_DIR", "."))
            cache["k"] = Kokoro(str(model_dir / "kokoro-v1.0.onnx"), str(model_dir / "voices-v1.0.bin"))
        return cache["k"]

    for slug in slugs:
        narrate(slug, timing_only, kokoro_factory)


if __name__ == "__main__":
    main()
