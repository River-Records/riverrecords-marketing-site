import { Config } from '@remotion/cli/config';

Config.setEntryPoint('src/index.ts');
Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');
// Tagged bt709, limited range. The default is untagged full-range yuvj420p,
// which QuickTime, iOS and social uploaders can mis-handle.
Config.setColorSpace('bt709');
// Use a preinstalled Chromium when one is provided (cloud sessions, CI);
// otherwise Remotion downloads its own.
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
