// Rich, page-driven content for drills, looked up by drill id from program.js.
//
// Architecture:
//   • Each drill name maps to an asset slug (cat-cows, bird-dog, etc.).
//   • Multiple drill ids share a slug across months (m1-catcow, m2-catcow,
//     m3-catcow → cat-cows), so one image set covers every variant.
//   • BY_SLUG holds optional rich content (description, phases, tip,
//     avoidImage). Most drills only need a hero image, which the default
//     branch of richContent() provides automatically.
//
// Assets live at /assets/drills/<slug>/{hero,phase-*,avoid}.png on the
// Railway server; the SafeImage helper in DrillDetail hides anything that
// 404s so we never paint an empty image card.

import { PROGRAMS } from './program';

const slugify = (s) =>
  s.toLowerCase().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-+$/g, '');
const canonical = (n) => n.replace(/\s*\([^)]+\)\s*/g, '').trim();

// drill id → asset slug. Built once at module load from PROGRAMS so adding
// new drills there automatically wires them up.
const SLUG_BY_ID = (() => {
  const out = {};
  for (const prog of Object.values(PROGRAMS)) {
    for (const d of prog.morning.drills) out[d.id] = slugify(canonical(d.name));
    for (const day of Object.values(prog.days || {})) {
      for (const d of day.drills || []) out[d.id] = slugify(canonical(d.name));
    }
  }
  return out;
})();

// Optional per-slug extras. Add description / phases / tip / avoidImage here
// to upgrade a drill from the basic image+cues layout to the full breakdown.
export const BY_SLUG = {
  'cat-cows': {
    description: 'A gentle flow to mobilize your spine and sync movement with breath.',
    phases: [
      {
        id: 'cow',
        label: 'Cow',
        breath: 'inhale',
        image: 'cat-cows/phase-cow.png',
        cues: ['Drop belly', 'Lift chest', 'Tuck chin slightly up'],
      },
      {
        id: 'cat',
        label: 'Cat',
        breath: 'exhale',
        image: 'cat-cows/phase-cat.png',
        cues: ['Round up', 'Press the floor away', 'Tuck chin to chest'],
      },
    ],
    tip: 'Move slowly and focus on how each part of your spine moves.',
    avoidImage: 'cat-cows/avoid.png',
  },
};

export function richContent(drillId) {
  const slug = SLUG_BY_ID[drillId];
  if (!slug) return null;
  return {
    heroImage: `${slug}/hero.png`,
    ...(BY_SLUG[slug] || {}),
  };
}

// Resolve a drill asset path to a full URL on the Railway-hosted CDN.
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const drillAsset = (path) =>
  path && BASE ? `${BASE}/assets/drills/${path}` : null;
