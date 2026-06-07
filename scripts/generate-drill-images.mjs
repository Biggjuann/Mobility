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
const MODEL = 'gpt-image-1';

// Detailed shared style preamble. Repeated in every prompt to keep the
// character, framing, lighting, and background consistent. NOTE: the model
// wears a fitted t-shirt — describing him as "bare-chested" combined with
// supine ("lying on back") poses reliably trips OpenAI's safety filter.
const STYLE = [
  'Clean, photorealistic anatomical fitness illustration for a mobility app.',
  'Subject: a single athletic male model in his early thirties, lean build, short dark hair,',
  'wearing a fitted dark grey athletic t-shirt and dark grey athletic shorts. Fully clothed.',
  'Setting: isolated against a warm matte near-black background (hex #14110d).',
  'No floor markings, no environment, no shadows on the ground, no props',
  'except those explicitly required by the movement.',
  'Lighting: soft directional studio light from above-front with a gentle rim light;',
  'warm, low contrast, no harsh highlights.',
  'Style: photorealistic CGI render, sharp anatomical detail.',
  'NO text, NO labels, NO UI, NO arrows, NO numbers, NO logos, NO watermarks.',
  'Composition: full body in frame, side-profile or 3/4 view, hip-height camera,',
  'subject centred with comfortable margin.',
].join(' ');

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
    body: JSON.stringify({ model: MODEL, prompt, size: SIZE, quality: QUALITY, n: 1 }),
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
