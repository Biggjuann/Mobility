// Rich, page-driven content per drill, keyed by the drill id from program.js.
//
// When a drill appears here, DrillDetail renders the rich layout: description,
// phase breakdown (with breath + image + per-phase cues), checked coaching
// cues, an Avoid block with optional sub-image, and a closing tip. Drills
// without an entry render the simple cues + avoid layout we ship today.
//
// Image paths are relative to /assets/drills/ on the Railway server, served
// statically. Drop matching PNGs at /server/assets/drills/<dir>/ and they
// surface in the app on the next deploy — no code change needed.
//
// Naming convention (matches /server/assets/drills/cat-cows as the template):
//   hero.png            — top illustration
//   phase-<id>.png      — per-phase illustration (id matches phase.id)
//   avoid.png           — optional "what not to do" illustration

export const DRILL_CONTENT = {
  'm1-catcow': {
    description: 'A gentle flow to mobilize your spine and sync movement with breath.',
    heroImage: 'cat-cows/hero.png',
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
    cues: [
      'Hands under shoulders, knees under hips',
      'Move with your breath',
      'Slow, controlled, and smooth',
      'Keep the movement in your spine',
    ],
    avoid: 'Just moving your head — the whole spine moves.',
    avoidImage: 'cat-cows/avoid.png',
    tip: 'Move slowly and focus on how each part of your spine moves.',
  },
};

export const richContent = (drillId) => DRILL_CONTENT[drillId] || null;

// Resolve a drill asset path to a full URL on the Railway-hosted CDN.
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const drillAsset = (path) => (path && BASE ? `${BASE}/assets/drills/${path}` : null);
