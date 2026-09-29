"""Generate placeholder narration from src/config/narration.json.

Writes public/narration/<id>.wav and src/generated/narration-timing.json
(seconds per line), which the composition reads to time each scene.

To swap in a human narrator: record one file per line id, save it over
public/narration/<id>.wav, and run with --timing-only to re-measure. Recordings
are used as-is, so master them to roughly the same level first.

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
CONFIG = ROOT / "src/config/narration.json"
OUT_AUDIO = ROOT / "public/narration"
OUT_TIMING = ROOT / "src/generated/narration-timing.json"

# Every line leaves at the same peak, so the voice sits at one steady, audible
# level: TTS output arrives quiet (~-22 dBFS RMS), and most players start low.
PEAK_DBFS = -1.5


def normalize(samples):
    peak = np.abs(samples).max()
    return samples if peak == 0 else samples * (10 ** (PEAK_DBFS / 20) / peak)


def main():
    timing_only = "--timing-only" in sys.argv
    config = json.loads(CONFIG.read_text())
    OUT_AUDIO.mkdir(parents=True, exist_ok=True)
    OUT_TIMING.parent.mkdir(parents=True, exist_ok=True)

    if not timing_only and config.get("narrator") == "recorded":
        sys.exit("narration.json says the takes are recorded; refusing to overwrite them with TTS.\n"
                 "Run with --timing-only after replacing a take, or set \"narrator\": \"tts\" to regenerate.")

    if not timing_only:
        from kokoro_onnx import Kokoro

        model_dir = Path(os.environ.get("KOKORO_DIR", "."))
        kokoro = Kokoro(str(model_dir / "kokoro-v1.0.onnx"), str(model_dir / "voices-v1.0.bin"))
        for line in config["lines"]:
            samples, rate = kokoro.create(
                line.get("say", line["text"]), voice=config["voice"], speed=config["speed"], lang="en-us"
            )
            sf.write(OUT_AUDIO / f"{line['id']}.wav", normalize(samples), rate)
            print(f"  {line['id']}: {len(samples) / rate:.2f}s")

    timing = {}
    for line in config["lines"]:
        info = sf.info(OUT_AUDIO / f"{line['id']}.wav")
        timing[line["id"]] = round(info.frames / info.samplerate, 3)
    OUT_TIMING.write_text(json.dumps(timing, indent=2) + "\n")
    print(f"wrote {OUT_TIMING.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
