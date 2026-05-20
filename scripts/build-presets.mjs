#!/usr/bin/env node
// Build the "Nosara Coastal" Lightroom preset pack.
//
// Emits 10 valid Camera Raw (.xmp) preset files into
// lightroom-presets/Nosara Coastal/ and an INSTALL.txt.
//
// These are real, importable Lightroom presets (Classic 7.3+, Lightroom CC
// desktop + mobile). The looks are built from tone curves, color grading,
// HSL, grain, and vignette — NOT from baked-in exposure or absolute white
// balance, so they apply cleanly across different photos.
//
// Usage:  node scripts/build-presets.mjs

import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { randomBytes } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'lightroom-presets', 'Nosara Coastal');

const GROUP = 'Nosara Coastal';
const COPYRIGHT = 'Julián Monge — shop.julianmonge.com';

// ── formatting helpers ────────────────────────────────────────────────
const uuid = () => randomBytes(16).toString('hex').toUpperCase();
const xesc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sgn = (v) => (v === 0 || v === undefined ? '0' : (v > 0 ? `+${v}` : `${v}`));
const exp = (v) => {
  const n = v ?? 0;
  return n === 0 ? '0.00' : (n > 0 ? `+${n.toFixed(2)}` : n.toFixed(2));
};

// Tone curve: array of [x,y] 0-255 → rdf:Seq
function curveSeq(tag, points) {
  if (!points) return '';
  const lis = points.map(([x, y]) => `      <rdf:li>${x}, ${y}</rdf:li>`).join('\n');
  return `   <crs:${tag}>\n    <rdf:Seq>\n${lis}\n    </rdf:Seq>\n   </crs:${tag}>\n`;
}

// ── HSL / gray channel order ──────────────────────────────────────────
const CH = ['Red', 'Orange', 'Yellow', 'Green', 'Aqua', 'Blue', 'Purple', 'Magenta'];

function hslBlock(prefix, obj = {}) {
  return CH.map((c) => `    crs:${prefix}${c}="${sgn(obj[c.toLowerCase()] ?? 0)}"`).join('\n');
}

// ── the 10 looks ──────────────────────────────────────────────────────
const PRESETS = [
  {
    file: '01 Golden Hour',
    name: '01 · Golden Hour',
    tone: { contrast: 12, highlights: -35, shadows: 28, whites: 6, blacks: -8 },
    presence: { texture: 6, clarity: 5, dehaze: 5, vibrance: 14, saturation: -3 },
    hueAdj: { yellow: -6, aqua: 4 },
    satAdj: { orange: 6, aqua: -4 },
    lumAdj: { orange: 8, blue: -6 },
    grade: {
      shadow: { hue: 205, sat: 8 },
      midtone: { hue: 42, sat: 8 },
      highlight: { hue: 45, sat: 18 },
      blending: 55, balance: 10,
    },
    grain: 10, vignette: -8,
    curve: [[0, 8], [64, 58], [128, 132], [192, 202], [255, 252]],
  },
  {
    file: '02 Overcast Pacific',
    name: '02 · Overcast Pacific',
    tone: { contrast: 18, highlights: -10, shadows: 20, whites: 12, blacks: -14 },
    presence: { texture: 12, clarity: 10, dehaze: 10, vibrance: 8, saturation: -8 },
    hueAdj: { aqua: 6 },
    satAdj: { green: -8, aqua: -6, blue: -10 },
    lumAdj: { orange: 4, blue: 4 },
    grade: {
      shadow: { hue: 210, sat: 12 },
      highlight: { hue: 200, sat: 6 },
      blending: 50, balance: 0,
    },
    grain: 8, vignette: -6,
    curve: [[0, 4], [64, 52], [128, 130], [192, 206], [255, 254]],
  },
  {
    file: '03 Jungle Interior',
    name: '03 · Jungle Interior',
    tone: { contrast: 14, highlights: -28, shadows: 30, whites: 4, blacks: -12 },
    presence: { texture: 10, clarity: 8, dehaze: 8, vibrance: 10, saturation: -2 },
    hueAdj: { green: 10, aqua: 8, yellow: 6 },
    satAdj: { green: 6, yellow: 4 },
    lumAdj: { green: 6, yellow: 6 },
    grade: {
      shadow: { hue: 160, sat: 14 },
      midtone: { hue: 120, sat: 6 },
      highlight: { hue: 50, sat: 8 },
      blending: 50, balance: -10,
    },
    grain: 12, vignette: -10,
    curve: [[0, 6], [64, 50], [128, 128], [192, 200], [255, 250]],
  },
  {
    file: '04 Coastal Surf',
    name: '04 · Coastal Surf',
    tone: { contrast: 16, highlights: -22, shadows: 18, whites: 14, blacks: -10 },
    presence: { texture: 14, clarity: 10, dehaze: 12, vibrance: 16, saturation: 0 },
    hueAdj: { aqua: -6, blue: 4 },
    satAdj: { aqua: 12, blue: 8 },
    lumAdj: { aqua: 6, blue: -4 },
    grade: {
      shadow: { hue: 200, sat: 16 },
      highlight: { hue: 190, sat: 12 },
      blending: 50, balance: 0,
    },
    grain: 8, vignette: -6,
    curve: [[0, 2], [64, 50], [128, 130], [192, 208], [255, 255]],
  },
  {
    file: '05 Interior Warm',
    name: '05 · Interior Warm',
    tone: { contrast: 8, highlights: -20, shadows: 24, whites: 18, blacks: -6 },
    presence: { texture: 6, clarity: 4, dehaze: 6, vibrance: 8, saturation: -2 },
    hueAdj: {},
    satAdj: { blue: -4 },
    lumAdj: { orange: 6, yellow: 4, blue: 6 },
    grade: {
      midtone: { hue: 42, sat: 6 },
      highlight: { hue: 48, sat: 5 },
      blending: 50, balance: 5,
    },
    grain: 4, vignette: 0,
    curve: [[0, 6], [64, 56], [128, 132], [192, 204], [255, 254]],
  },
  {
    file: '06 Sunset Glow',
    name: '06 · Sunset Glow',
    tone: { contrast: 20, highlights: -30, shadows: 22, whites: 8, blacks: -16 },
    presence: { texture: 8, clarity: 8, dehaze: 8, vibrance: 14, saturation: -4 },
    hueAdj: { red: -4, orange: -4 },
    satAdj: { red: 6, orange: 8, aqua: -4 },
    lumAdj: { aqua: -6, blue: -6 },
    grade: {
      shadow: { hue: 205, sat: 18 },
      midtone: { hue: 30, sat: 6 },
      highlight: { hue: 35, sat: 22 },
      blending: 60, balance: 15,
    },
    grain: 14, vignette: -12,
    curve: [[0, 12], [64, 56], [128, 128], [192, 198], [255, 246]],
  },
  {
    file: '07 Matte Film',
    name: '07 · Matte Film',
    tone: { contrast: -6, highlights: -14, shadows: 10, whites: -6, blacks: 14 },
    presence: { texture: -4, clarity: -6, dehaze: 0, vibrance: 6, saturation: -12 },
    hueAdj: { green: 6 },
    satAdj: { red: -6, orange: -4, blue: -8 },
    lumAdj: {},
    grade: {
      shadow: { hue: 130, sat: 10 },
      highlight: { hue: 50, sat: 10 },
      blending: 50, balance: 0,
    },
    grain: 18, vignette: -6,
    curve: [[0, 24], [64, 62], [128, 126], [192, 188], [255, 232]],
    curveBlue: [[0, 28], [128, 128], [255, 232]],
    curveRed: [[0, 8], [255, 248]],
  },
  {
    file: '08 Bright & Airy',
    name: '08 · Bright & Airy',
    tone: { exposure: 0.10, contrast: -4, highlights: -18, shadows: 30, whites: 16, blacks: 6 },
    presence: { texture: 4, clarity: -4, dehaze: 0, vibrance: 10, saturation: -4 },
    hueAdj: {},
    satAdj: { blue: -6 },
    lumAdj: { green: 8, aqua: 6, blue: 12 },
    grade: {
      highlight: { hue: 48, sat: 6 },
      blending: 50, balance: 5,
    },
    grain: 4, vignette: 0,
    curve: [[0, 14], [64, 64], [128, 134], [192, 206], [255, 255]],
  },
  {
    file: '09 Black & White Coast',
    name: '09 · Black & White Coast',
    monochrome: true,
    tone: { contrast: 22, highlights: -30, shadows: 25, whites: 14, blacks: -18 },
    presence: { texture: 14, clarity: 14, dehaze: 10 },
    gray: { red: -10, orange: 14, yellow: 18, green: 6, aqua: -20, blue: -30, purple: -10, magenta: -6 },
    grain: 16, vignette: -10,
    curve: [[0, 2], [64, 48], [128, 128], [192, 208], [255, 254]],
  },
  {
    file: '10 Deep Teal',
    name: '10 · Deep Teal',
    tone: { contrast: 14, highlights: -34, shadows: 18, whites: -4, blacks: -14 },
    presence: { texture: 6, clarity: 6, dehaze: 6, vibrance: 6, saturation: -10 },
    hueAdj: { aqua: -8 },
    satAdj: { orange: -4, aqua: 6, blue: -6 },
    lumAdj: { blue: -8 },
    grade: {
      shadow: { hue: 195, sat: 22, lum: -4 },
      midtone: { hue: 195, sat: 8 },
      highlight: { hue: 50, sat: 6 },
      blending: 55, balance: -5,
    },
    grain: 14, vignette: -14,
    curve: [[0, 10], [64, 54], [128, 124], [192, 192], [255, 244]],
  },
];

// ── XMP builder ───────────────────────────────────────────────────────
function buildXmp(p) {
  const t = p.tone || {};
  const pr = p.presence || {};
  const g = p.grade || {};
  const lines = [];
  const A = (k, v) => lines.push(`    crs:${k}="${v}"`);

  A('PresetType', 'Normal');
  A('Cluster', '');
  A('UUID', uuid());
  A('SupportsAmount', 'False');
  A('SupportsColor', 'True');
  A('SupportsMonochrome', 'True');
  A('SupportsHighDynamicRange', 'True');
  A('SupportsNormalDynamicRange', 'True');
  A('SupportsSceneReferred', 'True');
  A('SupportsOutputReferred', 'True');
  A('CameraModelRestriction', '');
  A('Copyright', COPYRIGHT);
  A('ContactInfo', 'shop.julianmonge.com');
  A('Version', '15.4');
  A('ProcessVersion', '11.0');

  // Tonal
  A('Exposure2012', exp(t.exposure));
  A('Contrast2012', sgn(t.contrast));
  A('Highlights2012', sgn(t.highlights));
  A('Shadows2012', sgn(t.shadows));
  A('Whites2012', sgn(t.whites));
  A('Blacks2012', sgn(t.blacks));

  // Presence
  A('Texture', sgn(pr.texture));
  A('Clarity2012', sgn(pr.clarity));
  A('Dehaze', sgn(pr.dehaze));
  if (!p.monochrome) {
    A('Vibrance', sgn(pr.vibrance));
    A('Saturation', sgn(pr.saturation));
  }

  // Tone curve name
  A('ToneCurveName2012', 'Custom');

  // HSL or B&W mix
  if (p.monochrome) {
    A('ConvertToGrayscale', 'True');
    lines.push(CH.map((c) => `    crs:GrayMixer${c}="${sgn((p.gray || {})[c.toLowerCase()] ?? 0)}"`).join('\n'));
  } else {
    A('ConvertToGrayscale', 'False');
    lines.push(hslBlock('HueAdjustment', p.hueAdj));
    lines.push(hslBlock('SaturationAdjustment', p.satAdj));
    lines.push(hslBlock('LuminanceAdjustment', p.lumAdj));

    // Color grading
    A('ColorGradeShadowHue', g.shadow?.hue ?? 0);
    A('ColorGradeShadowSat', g.shadow?.sat ?? 0);
    A('ColorGradeShadowLum', g.shadow?.lum ?? 0);
    A('ColorGradeMidtoneHue', g.midtone?.hue ?? 0);
    A('ColorGradeMidtoneSat', g.midtone?.sat ?? 0);
    A('ColorGradeMidtoneLum', g.midtone?.lum ?? 0);
    A('ColorGradeHighlightHue', g.highlight?.hue ?? 0);
    A('ColorGradeHighlightSat', g.highlight?.sat ?? 0);
    A('ColorGradeHighlightLum', g.highlight?.lum ?? 0);
    A('ColorGradeGlobalHue', g.global?.hue ?? 0);
    A('ColorGradeGlobalSat', g.global?.sat ?? 0);
    A('ColorGradeGlobalLum', g.global?.lum ?? 0);
    A('ColorGradeBlending', g.blending ?? 50);
    A('SplitToningBalance', sgn(g.balance ?? 0));
  }

  // Detail (sensible neutral defaults)
  A('Sharpness', 40);
  A('SharpenRadius', '+1.0');
  A('SharpenDetail', 25);
  A('SharpenEdgeMasking', 0);
  A('LuminanceSmoothing', 0);
  A('ColorNoiseReduction', 25);
  A('ColorNoiseReductionDetail', 50);
  A('ColorNoiseReductionSmoothness', 50);

  // Grain
  A('GrainAmount', p.grain ?? 0);
  if (p.grain) { A('GrainSize', 22); A('GrainFrequency', 50); }

  // Post-crop vignette
  A('PostCropVignetteAmount', sgn(p.vignette ?? 0));
  if (p.vignette) {
    A('PostCropVignetteMidpoint', 50);
    A('PostCropVignetteFeather', 60);
    A('PostCropVignetteRoundness', 0);
    A('PostCropVignetteStyle', 1);
    A('PostCropVignetteHighlightContrast', 0);
  }

  A('HasSettings', 'True');

  const attrs = lines.join('\n');

  const curves =
    curveSeq('ToneCurvePV2012', p.curve) +
    curveSeq('ToneCurvePV2012Red', p.curveRed) +
    curveSeq('ToneCurvePV2012Green', p.curveGreen) +
    curveSeq('ToneCurvePV2012Blue', p.curveBlue);

  return `<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 6.0">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/"
${attrs}>
   <crs:Name>
    <rdf:Alt>
     <rdf:li xml:lang="x-default">${xesc(p.name)}</rdf:li>
    </rdf:Alt>
   </crs:Name>
   <crs:ShortName>
    <rdf:Alt>
     <rdf:li xml:lang="x-default">${xesc(p.name)}</rdf:li>
    </rdf:Alt>
   </crs:ShortName>
   <crs:Group>
    <rdf:Alt>
     <rdf:li xml:lang="x-default">${xesc(GROUP)}</rdf:li>
    </rdf:Alt>
   </crs:Group>
${curves}  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
`;
}

// ── write files ───────────────────────────────────────────────────────
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

for (const p of PRESETS) {
  const xml = buildXmp(p);
  writeFileSync(join(OUT_DIR, `${p.file}.xmp`), xml, 'utf8');
  console.log(`  + ${p.file}.xmp`);
}

const install = `NOSARA COASTAL — Lightroom Preset Pack
10 presets · by Julián Monge · shop.julianmonge.com
====================================================

WHAT'S INSIDE
  01 Golden Hour          Warm, glowing late-afternoon light
  02 Overcast Pacific     Cool, crisp clarity for flat grey light
  03 Jungle Interior      Lush greens, earthy depth
  04 Coastal Surf         Punchy teal water, bright and clean
  05 Interior Warm        Real-estate interiors: bright, neutral, low grain
  06 Sunset Glow          Cinematic teal-orange, dramatic warmth
  07 Matte Film           Faded blacks, desaturated film look
  08 Bright & Airy        Light, fresh, low-contrast lifestyle look
  09 Black & White Coast  High-contrast monochrome, dramatic skies
  10 Deep Teal            Moody brand-matched editorial tone

These are .xmp presets. They adjust tone curves, color grading, HSL,
grain, and vignette. They do NOT force exposure or white balance, so
they apply cleanly to different photos — fine-tune exposure/WB per image.

────────────────────────────────────────────────────
INSTALL · Lightroom Classic (desktop, v7.3 or newer)
────────────────────────────────────────────────────
1. Open Lightroom Classic.
2. Go to the Develop module.
3. In the Presets panel (left), click the + → "Import Presets…".
4. Select all 10 .xmp files (or the whole "Nosara Coastal" folder zipped).
5. They appear under a "Nosara Coastal" group in the Presets panel.

────────────────────────────────────────────────────
INSTALL · Lightroom (CC) desktop
────────────────────────────────────────────────────
1. Open Lightroom.
2. Click the Presets icon (Edit panel) → "..." → "Import Presets".
3. Select the .xmp files. They sync to all your devices, including mobile.

────────────────────────────────────────────────────
INSTALL · Lightroom Mobile (iOS / Android)
────────────────────────────────────────────────────
Easiest: install on Lightroom CC desktop (above) — presets sync to mobile
automatically when signed into the same Adobe account.

Manual: in the mobile app, open the Presets panel → "..." → "Import
Presets" and select the .xmp files from your device's Files app.

────────────────────────────────────────────────────
TIPS
- Presets are a starting point. Adjust Exposure and White Balance to taste.
- Lower the effect by reducing Saturation/Vibrance or the grain amount.
- For raw files you'll get the most range; JPEGs respond more strongly.

© ${new Date().getFullYear()} Julián Monge. For personal and client use.
Resale or redistribution of the preset files is not permitted.
`;

writeFileSync(join(OUT_DIR, 'INSTALL.txt'), install, 'utf8');
console.log('  + INSTALL.txt');
console.log(`\nWrote ${PRESETS.length} presets to ${OUT_DIR}`);
