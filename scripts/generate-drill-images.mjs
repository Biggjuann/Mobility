#!/usr/bin/env node
// Generate drill illustrations via the OpenAI Image API (gpt-image-1).
//
//   export OPENAI_API_KEY=sk-...
//   node scripts/generate-drill-images.mjs --only Quadruped --quality medium
//
// Flags:
//   --only <Group>      one of: Quadruped, Supine, Prone, "Child's Pose",
//                       Seated, Half-Kneeling, Standing, Wall, Hanging,
//                       CARs, Inverted
//   --drill <AssetDir>  generate just one drill (e.g. --drill bird-dog)
//   --quality <q>       low | medium | high   (default: medium)
//   --size <s>          1024x1024 | 1536x1024 | 1024x1536  (default: 1536x1024)
//   --reference <path>  include an already-good image as a style reference so
//                       new calls imitate its character/lighting/background.
//                       Path is relative to server/assets/drills (e.g.
//                       cat-cows/hero.png). Uses /images/edits.
//   --force             overwrite an existing PNG. Default: skip if present.
//   --dry-run           print prompts only — no API calls, no files written.
//
// Output: server/assets/drills/<slug>/hero.png

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const CSV = path.join(REPO, 'docs/drills.csv');
const OUT = path.join(REPO, 'server/assets/drills');

const args = parseArgs(process.argv.slice(2));
const KEY = process.env.OPENAI_API_KEY;
if (!args.dryRun && !KEY) die('OPENAI_API_KEY env var not set.');
if (!fs.existsSync(CSV)) die(`Missing ${CSV}. Run the docs generator first.`);

const QUALITY = args.quality || 'medium';
const SIZE = args.size || '1536x1024';
const MODEL = args.model || 'gpt-image-1';

// Only gpt-image-1 currently accepts the transparent-background flag. Newer
// models like gpt-image-2 return HTTP 400 for `background=transparent`, so
// we send those params only when we know the model supports them.
const SUPPORTS_TRANSPARENT = MODEL === 'gpt-image-1';

// Detailed shared style preamble. Repeated in every prompt to keep the
// character, framing, lighting, and background consistent.
//
// Two important calls:
//   1. The model wears a fitted t-shirt — describing him as "bare-chested"
//      combined with supine poses trips OpenAI's safety filter.
//   2. Background is TRANSPARENT so the same PNG looks right on both light
//      (cream) and dark (warm-black) theme backgrounds in the app. The API
//      call also passes background:'transparent' so the alpha channel is
//      actually preserved in the output.
const STYLE = [
  'Clean, photorealistic anatomical fitness illustration for a mobility app.',
  'Subject: a single athletic male model in his early thirties, lean build, short dark hair,',
  'wearing a fitted charcoal grey athletic t-shirt and matching charcoal grey athletic shorts.',
  'Fully clothed.',
  'Background: render with a fully transparent alpha channel if supported;',
  'otherwise place the figure on a clean uniform warm matte near-black backdrop',
  '(hex #14110d) with no floor, no environment, and no drop shadow.',
  'Either way the figure must be completely isolated — no scene, no props except',
  'those required by the movement.',
  'Lighting: soft, neutral studio lighting from above-front with a subtle rim light along',
  'the edges of the body so the silhouette reads clearly on any background colour.',
  'Style: photorealistic CGI render, sharp anatomical detail.',
  'NO text, NO labels, NO UI, NO arrows, NO numbers, NO logos, NO watermarks.',
  'Composition: full body in frame, side-profile or 3/4 view, hip-height camera,',
  'subject centred with comfortable margin.',
  'Framing is critical: ALL limbs, hands, fingers, feet, toes, and head must be',
  'fully visible inside the frame — NEVER cropped at any edge. If any limb is',
  'extended (arm or leg reaching outward), zoom out far enough that the entire',
  'limb stays inside the frame, with at least 10% empty padding on every side.',
].join(' ');

// Per-drill prompt overrides for poses that the generic POSITION_HINT can't
// describe well enough on its own (twisted, inverted, or asymmetric shapes
// the model defaults badly on). Keyed by AssetDir slug. When an override
// exists it replaces the body of the prompt entirely (STYLE is always
// prepended); when it doesn't, buildPrompt falls back to the generic
// position hint + cues.
const DRILL_PROMPTS = {
  'thread-the-needle': [
    'Yoga pose Parsva Balasana (Thread the Needle).',
    'Male model in quadruped/table-top base, but he has rotated his upper torso so his',
    'RIGHT arm is fully extended and threaded FAR UNDER his LEFT armpit, with his RIGHT',
    'palm flat on the floor pointing toward the left side of the frame.',
    'His RIGHT shoulder, RIGHT ear, and RIGHT cheek rest on the floor.',
    'His LEFT hand stays planted directly under his LEFT shoulder, supporting his weight.',
    'His hips remain stacked over his knees, square to the floor — only the upper torso rotates.',
    'Camera at a 45° angle from above-side showing the deep spinal twist clearly.',
  ].join(' '),
  'skin-the-cats': [
    'Gymnastic ring/bar "skin-the-cat" movement, mid-rotation.',
    'Male model hanging from a horizontal pull-up bar with both hands overgrip.',
    'He has tucked his knees to his chest and pulled them up between his arms,',
    'his hips inverted above his head, body folded compact — about to extend his legs',
    'behind his head through and downward. Bar and grip clearly visible at the top of the frame.',
    'Side-profile camera.',
  ].join(' '),
  'german-hang': [
    'German hang position from a horizontal pull-up bar.',
    'Male model hanging fully inverted: hands gripping the bar overhead with arms straight,',
    'body has rotated through so his torso is upside-down, his legs extended downward',
    'behind his head until his feet hover above or just touch the floor below the bar.',
    'Shoulders extended in a passive stretch. Bar at the top of the frame, full body visible.',
    'Side-profile camera.',
  ].join(' '),
  '90-90-hip-rotations': [
    '90/90 seated hip rotation position.',
    'Male model seated on the floor. His FRONT leg is bent 90° in front of him,',
    'shin parallel to the front edge of the frame, knee out to one side, foot to the other.',
    'His BACK leg is bent 90° to the opposite side, with the inner thigh, knee, and shin',
    'flat on the floor. Both knees at 90° angles. Chest tall, hips heavy. Hands rest lightly',
    'on his front shin. Camera straight on or at 30° elevation, full body in frame.',
  ].join(' '),
};

const POSITION_HINT = {
  Quadruped: 'Body in quadruped (table-top) position — hands directly under shoulders, knees directly under hips.',
  Supine: 'Lying flat on the back on the floor.',
  Prone: 'Lying flat on the stomach on the floor.',
  "Child's Pose": 'Kneeling, hips back to heels, torso folded forward, arms extended.',
  Seated: 'Seated on the floor.',
  'Half-Kneeling': 'Half-kneeling — one knee down on the floor, the other foot planted in front in a lunge.',
  Standing: 'Standing upright with feet on the floor.',
  Wall: 'Standing or seated with their back or arms in contact with a plain wall (or doorway) on one side of the frame.',
  Hanging: 'Hanging from a horizontal pull-up bar at the top of the frame, arms straight overhead, body suspended.',
  CARs: 'Standing relaxed, isolating a single joint (neck, shoulder, hip) through a slow controlled circle.',
  Inverted: 'In a Downward Dog: hips lifted up, hands and feet on the floor, body in an inverted V shape.',
  Other: 'Holding the position described below.',
};

const drills = readCsv(CSV).filter(filterRows);

console.log(`Selected ${drills.length} drill(s). Model=${MODEL} size=${SIZE} quality=${QUALITY}${args.dryRun ? ' [DRY RUN]' : ''}`);
const perImage = { low: 0.011, medium: 0.042, high: 0.167 }[QUALITY] || 0.042;
console.log(`Estimated cost: ~$${(drills.length * perImage).toFixed(2)} total (≈$${perImage.toFixed(3)}/image).\n`);

let ref = null;
if (args.reference && !args.dryRun) {
  const refPath = path.join(OUT, args.reference);
  if (!fs.existsSync(refPath)) die(`--reference file not found: ${refPath}`);
  ref = refPath;
  console.log(`Using ${args.reference} as a style reference (using /images/edits).\n`);
}

let made = 0;
let skipped = 0;
for (const d of drills) {
  const dir = path.join(OUT, d.AssetDir);
  const file = path.join(dir, 'hero.png');
  if (fs.existsSync(file) && !args.force) {
    console.log(`  skip   ${d.AssetDir.padEnd(28)} (exists; --force to overwrite)`);
    skipped++;
    continue;
  }
  const prompt = buildPrompt(d);
  if (args.dryRun) {
    console.log(`\n──── ${d.Drill} (${d.AssetDir}) ────\n${prompt}`);
    made++;
    continue;
  }
  process.stdout.write(`  gen    ${d.AssetDir.padEnd(28)} ... `);
  try {
    const png = ref ? await callEdits(prompt, ref) : await callGenerations(prompt);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, png);
    console.log(`ok (${(png.length / 1024).toFixed(0)} KB)`);
    made++;
  } catch (err) {
    console.log(`FAIL — ${err.message}`);
  }
}

console.log(`\nDone. Generated: ${made}. Skipped: ${skipped}. Output: ${path.relative(REPO, OUT)}/<slug>/hero.png`);

// ── helpers ────────────────────────────────────────────────────────────────
function buildPrompt(d) {
  const override = DRILL_PROMPTS[d.AssetDir];
  if (override) {
    return [
      STYLE,
      '',
      override,
      'Hold the position in a clean mid-movement snapshot. Anatomically accurate. No exaggeration.',
    ].join('\n');
  }
  const cues = (d.Cues || '').split(' · ').filter(Boolean);
  const lines = [
    STYLE,
    '',
    `Movement: ${d.Drill}.`,
    POSITION_HINT[d.Group] || POSITION_HINT.Other,
    cues.length ? `Pose specifics — the model should clearly be doing:\n- ${cues.join('\n- ')}` : '',
    'Hold the position in a clean mid-movement snapshot. Anatomically accurate. No exaggeration.',
  ];
  return lines.filter(Boolean).join('\n');
}

async function callGenerations(prompt) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      size: SIZE,
      quality: QUALITY,
      n: 1,
      ...(SUPPORTS_TRANSPARENT
        ? { background: 'transparent', output_format: 'png' }
        : {}),
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = await res.json();
  return Buffer.from(j.data[0].b64_json, 'base64');
}

async function callEdits(prompt, refPath) {
  const form = new FormData();
  form.append('model', MODEL);
  form.append('prompt', prompt);
  form.append('size', SIZE);
  form.append('quality', QUALITY);
  if (SUPPORTS_TRANSPARENT) {
    form.append('background', 'transparent');
    form.append('output_format', 'png');
  }
  const blob = new Blob([fs.readFileSync(refPath)], { type: 'image/png' });
  form.append('image', blob, path.basename(refPath));
  const res = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}` },
    body: form,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = await res.json();
  return Buffer.from(j.data[0].b64_json, 'base64');
}

function filterRows(d) {
  if (args.drill && d.AssetDir !== args.drill) return false;
  if (args.only && d.Group !== args.only) return false;
  return true;
}

function readCsv(file) {
  const text = fs.readFileSync(file, 'utf8');
  const rows = [];
  let header = null;
  for (const line of parseCsv(text)) {
    if (!header) { header = line; continue; }
    const r = {};
    header.forEach((h, i) => (r[h] = line[i] ?? ''));
    rows.push(r);
  }
  return rows;
}

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* skip */ }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((v) => v !== ''));
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    switch (a) {
      case '--only': out.only = next; i++; break;
      case '--drill': out.drill = next; i++; break;
      case '--model': out.model = next; i++; break;
      case '--quality': out.quality = next; i++; break;
      case '--size': out.size = next; i++; break;
      case '--reference': out.reference = next; i++; break;
      case '--force': out.force = true; break;
      case '--dry-run': out.dryRun = true; break;
      case '-h': case '--help':
        console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 25).map((l) => l.replace(/^\/\/\s?/, '')).join('\n'));
        process.exit(0);
      default: die(`Unknown flag: ${a}`);
    }
  }
  return out;
}

function die(msg) { console.error(msg); process.exit(1); }
