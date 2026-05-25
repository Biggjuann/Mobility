import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Check, ChevronDown, Play, Pause, X, Flame, Circle, Lock, ChevronRight, Settings, ArrowRight, User } from 'lucide-react';
import AccountModal from './AccountModal.jsx';

// ──────────────────────────────────────────────────────────────────────────
// PROGRAM DATA — 6 MONTHS, PROGRESSIVE
// ──────────────────────────────────────────────────────────────────────────

const drill = (id, name, spec, cues, avoid, timer = null) => ({ id, name, spec, cues, avoid, ...(timer ? { timer } : {}) });

const PROGRAMS = {
  1: {
    name: 'Foundation',
    tagline: 'Wake up. Build the habit.',
    morning: {
      intro: 'Two gentle rounds. Stop short of any sharp pain.',
      drills: [
        drill('m1-catcow', 'Cat-Cows', '2 × 10', ['Hands under shoulders, knees under hips', 'Exhale: round up, tuck chin', 'Inhale: drop belly, lift chest'], 'Just moving your head — the whole spine moves.'),
        drill('m1-knee', 'Knee Circles', '10 each way', ['Lie on back, knees over chest', 'Hands rest on knees', 'Small, slow circles'], 'Forcing range. Keep circles small.'),
        drill('m1-fig4', 'Seated Figure-4', '30 sec each', ['Sit in chair, ankle on opposite knee', 'Lean chest forward gently', 'Keep back long'], 'Rounding to reach further.', { duration: 30, sides: 2 }),
        drill('m1-lat', 'Supported Lateral Lunge', '5 each', ['Hold chair/counter for balance', 'Step foot out wide, sit toward that side', 'Other leg straight, foot flat'], 'Going lower than feels easy.'),
        drill('m1-hf', 'Half-Kneeling Hip Flexor', '30 sec each', ['Towel under back knee if needed', 'Tuck tailbone, squeeze back glute', 'Stay tall'], 'Arching the lower back.', { duration: 30, sides: 2 }),
        drill('m1-ws', 'Wall Slides', '10 reps', ['Back to wall, arms goal-post', 'Slide up overhead', 'Only as high as you can without arching'], 'Lower back peeling off wall.'),
        drill('m1-neck', 'Neck Circles', '5 each way', ['Sit/stand tall, shoulders relaxed', 'Slow chin circle', 'Feel every degree'], 'Fast or jerky movement.'),
      ],
    },
    days: {
      monday: { title: 'Hips & Legs', intro: 'Bodyweight only. Form first.', drills: [
        drill('m1-mon-sq', 'Squat to Chair', '3 × 10', ['Stand in front of chair', 'Push hips back, tap chair', 'Stand up'], 'Crashing onto the chair.'),
        drill('m1-mon-rl', 'Reverse Lunge (Supported)', '3 × 6 each', ['Hold chair, one hand', 'Step foot back into lunge', 'Step up. Switch.'], 'Front knee caving inward.'),
        drill('m1-mon-ham', 'Standing Hamstring', '3 × 30s each', ['Heel on low step', 'Hinge forward from hips', 'Keep back long'], 'Rounding back to reach.', { duration: 30, sides: 2 }),
        drill('m1-mon-quad', 'Standing Quad', '3 × 30s each', ['Hold wall, grab ankle', 'Pull heel toward butt', 'Tuck tailbone'], 'Knee flaring out.', { duration: 30, sides: 2 }),
      ]},
      tuesday: { title: 'Shoulders & Upper', intro: 'Floor and wall only.', drills: [
        drill('m1-tue-ws', 'Wall Scapular Slides', '3 × 10', ['Slow, controlled', 'Drive blades DOWN at bottom', 'Wall contact whole time'], 'Shrugging at the top.'),
        drill('m1-tue-dw', 'Doorway Chest Stretch', '3 × 30s each', ['Forearm on doorframe, shoulder height', 'Step opposite foot forward', 'Rotate body away gently'], 'Forcing into a pinch.', { duration: 30, sides: 2 }),
        drill('m1-tue-ch', "Child's Pose w/ Reach", '3 × 30s', ['Kneel, hips to heels, arms forward', 'Walk hands right 10s', 'Center 10s, left 10s'], 'Knee pressure — pad if sore.', { duration: 30, sides: 1 }),
        drill('m1-tue-thr', 'Thread the Needle', '3 × 5 each', ['On hands and knees', 'Slide right arm under left', 'Lower shoulder and ear toward floor'], 'Dumping into shoulder.'),
      ]},
      wednesday: { title: 'Spine & Core', intro: 'Floor-based, gentle on the back.', drills: [
        drill('m1-wed-pm', 'Pelvic Tilt + March', '3 × 10', ['Press lower back to floor', 'Hold tilt — lift one knee, lower', 'Reset tilt if back arches'], 'Back arching off floor.'),
        drill('m1-wed-gb', 'Glute Bridge', '3 × 12', ['Push floor away, lift hips', 'Squeeze glutes hard at top', 'Tuck tailbone slightly'], 'Feeling it in the lower back.'),
        drill('m1-wed-cc', 'Cat-Cows (slow)', '3 × 15', ['Slower than morning', 'Full breath per rep', 'Feel each segment'], 'Rushing.'),
        drill('m1-wed-tr', 'Seated Thoracic Rotation', '3 × 10 each', ['Arms crossed over chest', 'Rotate upper body slowly', 'Hips face forward'], 'Twisting from lower back.'),
      ]},
      friday: { title: 'Full Body Flow', intro: '3 rounds, rest as needed.', drills: [
        drill('m1-fri-cc', 'Cat-Cows', '× 10', ['Slow, full breath'], 'Rushing.'),
        drill('m1-fri-ch', "Child's Pose", '30 sec', ['Kneel, hips to heels, arms forward'], 'Knee pressure.', { duration: 30, sides: 1 }),
        drill('m1-fri-ll', 'Lateral Lunge', '5 each', ['Hold chair, step wide'], 'Past easy depth.'),
        drill('m1-fri-fw', 'Seated Forward Fold', '30 sec', ['Soft knees, hinge from hips'], 'Forcing toes.', { duration: 30, sides: 1 }),
        drill('m1-fri-tw', 'Supine Twist', '30s each', ['Knees bent, drop to one side'], 'Lifting shoulders off floor.', { duration: 30, sides: 2 }),
      ]},
      saturday: { title: 'Long Gentle Stretch', intro: 'Slow holds. Never push into pain.', drills: [
        drill('m1-sat-fw', 'Seated Forward Fold', '60s × 2', ['Soft knees', 'Hinge from hips, not rounding'], 'Forcing depth.', { duration: 60, sides: 1 }),
        drill('m1-sat-bf', 'Butterfly', '60s × 2', ['Soles together, knees wide', 'Sit tall, lean from hips'], 'Pushing knees down.', { duration: 60, sides: 1 }),
        drill('m1-sat-f4', 'Reclining Figure-4', '60s each', ['Right ankle over left knee', 'Pull left thigh to chest'], 'Lifting head/shoulders.', { duration: 60, sides: 2 }),
        drill('m1-sat-h', 'Supine Hamstring (Towel)', '60s each', ['Towel around foot', 'Leg up, pull foot toward you'], 'Locking knee hard.', { duration: 60, sides: 2 }),
        drill('m1-sat-ch', "Child's Pose", '90 sec', ['Knees wide, hips back, forehead down'], 'Tension in shoulders.', { duration: 90, sides: 1 }),
      ]},
    },
  },

  2: {
    name: 'Awakening',
    tagline: 'Less support. Deeper range.',
    morning: {
      intro: 'Drop the chair where you can. Hold a beat longer.',
      drills: [
        drill('m2-catcow', 'Cat-Cows', '2 × 12', ['Slower than month 1', 'Full breath per rep', 'Feel each vertebra'], 'Skipping the breath.'),
        drill('m2-knee', 'Knee Drops', '10 each side', ['On back, knees bent, feet flat', 'Drop both knees to one side', 'Slow return, opposite side'], 'Letting shoulders lift.'),
        drill('m2-fig4', 'Seated Figure-4 (deeper)', '40 sec each', ['Lean further forward this month', 'Keep back long', 'Breathe into the stretch'], 'Rounding to fake depth.', { duration: 40, sides: 2 }),
        drill('m2-lat', 'Lateral Lunge (unsupported)', '6 each', ['No chair this month', 'Arms out for balance', 'Sit back, not down'], 'Heel popping up.'),
        drill('m2-hf', 'Half-Kneeling Hip Flexor + Reach', '40 sec each', ['Tuck, squeeze glute, then', 'Raise same-side arm overhead', 'Slight side-bend away'], 'Arching back to reach.', { duration: 40, sides: 2 }),
        drill('m2-ws', 'Wall Slides (higher)', '12 reps', ['Push arms higher this month', 'Keep wall contact', 'Drive blades down at bottom'], 'Lower back arching off wall.'),
        drill('m2-cars', 'Neck + Shoulder CARs', '5 each joint', ['Neck circle 5 each way', 'Then shoulder rolls 5 each way', 'Smooth, controlled'], 'Speeding up.'),
      ],
    },
    days: {
      monday: { title: 'Hips & Legs', intro: 'Unsupported. Slightly deeper.', drills: [
        drill('m2-mon-sq', 'Bodyweight Squat', '3 × 10', ['No chair this month', 'Sit back, knees out', 'As deep as comfortable'], 'Knees caving inward.'),
        drill('m2-mon-rl', 'Reverse Lunge', '3 × 8 each', ['No support if balance allows', 'Step back, lower with control', 'Drive through front heel'], 'Rushing the down phase.'),
        drill('m2-mon-fw', 'Seated Forward Fold', '3 × 45s', ['Long spine, hinge from hips', 'Reach toward feet'], 'Rounding to grab toes.', { duration: 45, sides: 1 }),
        drill('m2-mon-9090', '90/90 Hip Switches', '8 reps', ['Sit, front leg 90° in front, back leg 90° to side', 'Rotate legs to opposite side', 'Chest tall, knees heavy'], 'Leaning back to swing legs.'),
      ]},
      tuesday: { title: 'Shoulders & Upper', intro: 'Add gentle extension work.', drills: [
        drill('m2-tue-ws', 'Wall Scapular Slides', '3 × 12', ['Slower than month 1', 'Pause 2 sec at top'], 'Shrugging at top.'),
        drill('m2-tue-dw', 'Doorway Chest Stretch', '3 × 45s each', ['Step further forward this month', 'Hold the depth, breathe'], 'Pinch in front of shoulder.', { duration: 45, sides: 2 }),
        drill('m2-tue-cb', 'Cobra (gentle)', '3 × 30s', ['On stomach, hands under shoulders', 'Press up only as far as comfortable', 'Hips stay on floor'], 'Pushing into low back pain.', { duration: 30, sides: 1 }),
        drill('m2-tue-thr', 'Thread the Needle', '3 × 8 each', ['Slower than month 1', 'Hold bottom 3 sec'], 'Dumping into shoulder.'),
      ]},
      wednesday: { title: 'Spine & Core', intro: 'Add anti-rotation. Build the deep core.', drills: [
        drill('m2-wed-db', 'Dead Bug', '3 × 8 each', ['On back, arms up, knees over hips', 'Press low back to floor', 'Extend opposite arm and leg slowly'], 'Letting back arch.'),
        drill('m2-wed-gb', 'Glute Bridge (3s hold)', '3 × 15', ['Lift hips, hold 3 sec at top', 'Squeeze glutes hard', 'Tuck tailbone'], 'Lower back doing the work.'),
        drill('m2-wed-cc', 'Cat-Cows', '3 × 15', ['Full breath per rep', 'Feel each segment'], 'Rushing.'),
        drill('m2-wed-tr', 'Seated Rotation (deeper)', '3 × 12 each', ['Cross arms over chest', 'Rotate further this month', 'Hips face forward'], 'Twisting from low back.'),
      ]},
      friday: { title: 'Full Body Flow', intro: '3 rounds. Introduce deep squat hold.', drills: [
        drill('m2-fri-cc', 'Cat-Cows', '× 10', ['Slow, breath-driven'], 'Rushing.'),
        drill('m2-fri-ch', "Child's Pose", '30 sec', ['Knees wide, hips back'], 'Knee pressure.', { duration: 30, sides: 1 }),
        drill('m2-fri-ll', 'Lateral Lunge (no support)', '6 each', ['Sit back, foot flat'], 'Heel lifting.'),
        drill('m2-fri-fw', 'Seated Forward Fold', '30 sec', ['Hinge from hips'], 'Rounding back.', { duration: 30, sides: 1 }),
        drill('m2-fri-tw', 'Supine Twist', '30s each', ['Knees to one side, shoulders down'], 'Lifting shoulders.', { duration: 30, sides: 2 }),
        drill('m2-fri-ds', 'Deep Squat Hold', '20 sec', ['Heels flat, chest tall', 'Hold a pole if needed'], 'Forcing depth.', { duration: 20, sides: 1 }),
      ]},
      saturday: { title: 'Long Stretch', intro: 'Add pigeon prep. Hold longer.', drills: [
        drill('m2-sat-fw', 'Seated Forward Fold', '75s × 2', ['Soft knees, long spine'], 'Forcing depth.', { duration: 75, sides: 1 }),
        drill('m2-sat-bf', 'Butterfly', '75s × 2', ['Soles together, lean from hips'], 'Pushing knees down.', { duration: 75, sides: 1 }),
        drill('m2-sat-f4', 'Reclining Figure-4', '75s each', ['Pull thigh to chest'], 'Lifting head.', { duration: 75, sides: 2 }),
        drill('m2-sat-h', 'Supine Hamstring (Towel)', '75s each', ['Leg straight up, pull gently'], 'Locking knee hard.', { duration: 75, sides: 2 }),
        drill('m2-sat-pp', 'Pigeon Prep (modified)', '60s each', ['On floor, one leg in figure-4 in front', 'Lean chest forward gently', 'Cushion under hip if needed'], 'Hip lifting up.', { duration: 60, sides: 2 }),
        drill('m2-sat-ch', "Child's Pose", '90 sec', ['Knees wide, sit back, breathe'], 'Shoulder tension.', { duration: 90, sides: 1 }),
      ]},
    },
  },

  3: {
    name: 'Duration',
    tagline: 'Longer holds. Active ranges.',
    morning: {
      intro: 'Add controlled movement at end ranges. Hold the breath out gently.',
      drills: [
        drill('m3-catcow', 'Cat-Cows', '2 × 15', ['Very slow, segmented spine', 'Pause at each end range', 'Breath drives it'], 'Treating it as a warm-up only.'),
        drill('m3-knee', 'Knee Drops + Hold', '10 each, 5s hold', ['Drop knees to side', 'Hold 5 sec at end range', 'Slow return'], 'Bouncing back.'),
        drill('m3-9090', '90/90 Hip Rotations', '8 each side', ['Full rotation both directions', 'Chest tall the whole time', 'Back knee heavy'], 'Swinging with momentum.'),
        drill('m3-cossack', 'Cossack Shift', '10 reps', ['Feet 2× shoulder width', 'Shift fully one side', 'Other foot stays flat'], 'Heel popping up.'),
        drill('m3-couch1', 'Couch Stretch (entry)', '40s each', ['Lunge position', 'Back foot flat on floor (not wall yet)', 'Tuck tailbone, squeeze glute'], 'Arching the lower back.', { duration: 40, sides: 2 }),
        drill('m3-ws', 'Wall Slides', '15 reps', ['Higher than month 2', 'Slow tempo'], 'Speed.'),
        drill('m3-cars', 'Full Joint CARs', '5 each', ['Neck, shoulders, hips, ankles', '5 each direction'], 'Skipping joints.'),
      ],
    },
    days: {
      monday: { title: 'Hips & Legs', intro: 'Introduce Cossack squat. Build pigeon.', drills: [
        drill('m3-mon-sq', 'Bodyweight Squat', '3 × 12', ['Deeper than month 2', 'Pause 1s at bottom', 'Drive up controlled'], 'Bouncing out of the bottom.'),
        drill('m3-mon-wl', 'Walking Lunge (in place)', '3 × 10 each', ['Step forward, lower', 'Drive through heel up', 'Alternate legs'], 'Front knee inward.'),
        drill('m3-mon-cs', 'Cossack Squat (bodyweight)', '3 × 8 each', ['Wide stance', 'Sit fully into one side, stay heels flat', 'Other leg straight'], 'Rushing the transition.'),
        drill('m3-mon-pg', 'Pigeon Stretch', '60s each', ['Front shin angled across mat', 'Back leg extended', 'Cushion under hip if needed'], 'Hips uneven.', { duration: 60, sides: 2 }),
      ]},
      tuesday: { title: 'Shoulders & Upper', intro: 'Begin hanging exposure.', drills: [
        drill('m3-tue-ws', 'Wall Slides', '3 × 15', ['Slower with pause overhead'], 'Arching back.'),
        drill('m3-tue-dw', 'Doorway Chest Stretch', '3 × 60s each', ['Hold the depth, breathe deeply'], 'Pinch in shoulder.', { duration: 60, sides: 2 }),
        drill('m3-tue-dh', 'Dead Hang', '3 × 15s', ['Hang from a pull-up bar', 'Arms straight, relax', 'Build up time gradually'], 'Grip failing — drop down.', { duration: 15, sides: 1 }),
        drill('m3-tue-thr', 'Thread the Needle', '3 × 8 each', ['Hold bottom position 5 sec'], 'Rushing.'),
      ]},
      wednesday: { title: 'Spine & Core', intro: 'Unilateral work. Bigger range.', drills: [
        drill('m3-wed-db', 'Dead Bug', '3 × 10 each', ['Press low back to floor', 'Slow, controlled'], 'Back arching.'),
        drill('m3-wed-sl', 'Single-Leg Glute Bridge', '3 × 10 each', ['One foot up, lift hips with the other', 'Squeeze hard at top'], 'Hips dropping unevenly.'),
        drill('m3-wed-cc', 'Cat-Cows', '3 × 20', ['Long, slow rounds', 'Articulate every segment'], 'Skipping the deep flexion.'),
        drill('m3-wed-tr', 'Seated Rotation + Reach', '3 × 10 each', ['Cross arms, rotate', 'Reach far hand toward opposite knee'], 'Twisting from low back.'),
      ]},
      friday: { title: 'Full Body Flow', intro: '3 rounds. Add downward dog.', drills: [
        drill('m3-fri-cc', 'Cat-Cows', '× 10', ['Breath-driven'], 'Rushing.'),
        drill('m3-fri-dd', 'Downward Dog (gentle)', '30 sec', ['Push hips up and back', 'Bend knees if hamstrings tight', 'Heels reach toward floor'], 'Forcing straight legs.', { duration: 30, sides: 1 }),
        drill('m3-fri-cs', 'Cossack Shift', '8 each', ['Full depth one side', 'Stay heels flat'], 'Heel popping.'),
        drill('m3-fri-fw', 'Seated Forward Fold', '30 sec', ['Hinge from hips'], 'Rounding back.', { duration: 30, sides: 1 }),
        drill('m3-fri-tw', 'Supine Twist', '30s each', ['Knees to one side'], 'Shoulders lifting.', { duration: 30, sides: 2 }),
        drill('m3-fri-ds', 'Deep Squat Hold', '45 sec', ['Heels flat, chest tall', 'Breathe'], 'Forcing depth.', { duration: 45, sides: 1 }),
      ]},
      saturday: { title: 'Long Stretch', intro: 'Add couch stretch. Hold longer.', drills: [
        drill('m3-sat-fw', 'Seated Forward Fold', '90s × 2', ['Long spine, soft knees'], 'Forcing depth.', { duration: 90, sides: 1 }),
        drill('m3-sat-bf', 'Butterfly', '75s × 2', ['Lean from hips'], 'Pushing knees down.', { duration: 75, sides: 1 }),
        drill('m3-sat-pg', 'Pigeon Stretch', '75s each', ['Cushion under hip if needed'], 'Hip lifting.', { duration: 75, sides: 2 }),
        drill('m3-sat-h', 'Supine Hamstring (Towel)', '75s each', ['Leg up, gently pull'], 'Locked knee.', { duration: 75, sides: 2 }),
        drill('m3-sat-cs', 'Half-Kneeling Couch Stretch', '60s each', ['Lunge, back foot up against wall or couch', 'Tuck tailbone, squeeze glute'], 'Arching back.', { duration: 60, sides: 2 }),
        drill('m3-sat-ch', "Child's Pose", '90 sec', ['Knees wide, breathe'], 'Tension.', { duration: 90, sides: 1 }),
      ]},
    },
  },

  4: {
    name: 'Light Load',
    tagline: 'Add weight. Small doses.',
    morning: {
      intro: 'Introduce light load. 5 lb dumbbell or water bottle is plenty.',
      drills: [
        drill('m4-catcow', 'Cat-Cows', '2 × 15', ['Breath-driven', 'Slow, full range'], 'Rushing.'),
        drill('m4-9090', '90/90 Hip Rotations', '10 each', ['Full rotation, chest tall', 'Pause at end range'], 'Swinging.'),
        drill('m4-pg', 'Pigeon Good Morning', '6 each', ['Pigeon position, hipbones forward', 'Hinge at hips toward shin', 'Long spine'], 'Rounding the back.'),
        drill('m4-cossack', 'Cossack Shift (longer pause)', '10 reps', ['Hold 2 sec at full depth each side', 'Heels flat'], 'Rushing.'),
        drill('m4-couch2', 'Couch Stretch (intermediate)', '45s each', ['Back shin against wall', 'Stay leaning slightly forward', 'Tuck and squeeze'], 'Arching lower back.', { duration: 45, sides: 2 }),
        drill('m4-bws', 'Banded Wall Slides', '12 reps', ['Resistance band around wrists', 'Pull outward against band', 'Slide up overhead'], 'Letting band slacken.'),
        drill('m4-cars', 'Full Joint CARs', '5 each', ['Hit every major joint', 'Slow and controlled'], 'Speeding through.'),
      ],
    },
    days: {
      monday: { title: 'Hips & Legs', intro: 'Add light goblet weight. 5–10 lb.', drills: [
        drill('m4-mon-gs', 'Goblet Squat (light)', '3 × 8', ['Hold DB at chest', 'Sit back and down', 'Drive through heels'], 'Knees caving.'),
        drill('m4-mon-rl', 'Reverse Lunge (DB)', '3 × 8 each', ['DB in goblet hold', 'Step back, lower'], 'Front knee buckling.'),
        drill('m4-mon-cs', 'Cossack Squat (light hold)', '3 × 6 each', ['Light DB at chest', 'Sit fully one side, heels flat'], 'Weight pulling forward.'),
        drill('m4-mon-cs2', 'Couch Stretch (intermediate)', '45s each', ['Back shin up against wall', 'Lean slightly forward, tuck pelvis'], 'Lower back pinch.', { duration: 45, sides: 2 }),
      ]},
      tuesday: { title: 'Shoulders & Upper', intro: 'Bands and longer hangs.', drills: [
        drill('m4-tue-bpa', 'Banded Pull-Aparts', '3 × 12', ['Light band, arms straight', 'Pull band apart at chest height', 'Squeeze blades together'], 'Bending elbows.'),
        drill('m4-tue-bsd', 'Banded Shoulder Dislocates', '3 × 10', ['Wide band grip, arms straight', 'Front to behind butt'], 'Bending elbows.'),
        drill('m4-tue-dh', 'Dead Hang', '3 × 20s', ['Relax, breathe', 'Build up time'], 'Forcing past grip failure.', { duration: 20, sides: 1 }),
        drill('m4-tue-lcp', "Loaded Child's Pose", '3 × 30s', ['Hold light DB in extended hands', 'Sink into the stretch'], 'Knee pain — pad it.', { duration: 30, sides: 1 }),
      ]},
      wednesday: { title: 'Spine & Core', intro: 'Light load. Introduce bird dog.', drills: [
        drill('m4-wed-db', 'Dead Bug (light weight)', '3 × 8 each', ['Hold light DB in hands', 'Press low back to floor', 'Extend slow'], 'Back arching.'),
        drill('m4-wed-gb', 'Banded Glute Bridge', '3 × 15', ['Band above knees, push out', 'Lift hips, squeeze'], 'Knees caving against band.'),
        drill('m4-wed-bd', 'Bird Dog', '3 × 8 each', ['Hands and knees', 'Extend opposite arm and leg', 'Square hips, hold 2 sec'], 'Hip rotating up.'),
        drill('m4-wed-jc', 'Jefferson Curl (5 lb)', '3 × 5', ['Stand on box, very light DB', 'Roll down vertebra by vertebra', 'Roll back up segment by segment'], 'Using too much weight. 5 lb is plenty.'),
      ]},
      friday: { title: 'Full Body Flow', intro: '3 rounds with light load.', drills: [
        drill('m4-fri-gs', 'Goblet Squat', '× 8', ['Light DB, slow tempo'], 'Crashing down.'),
        drill('m4-fri-ll', 'Lateral Lunge (DB)', '5 each', ['Light DB, sit toward each side'], 'Past easy depth.'),
        drill('m4-fri-pg', 'Pigeon Good Morning', '6 each', ['Hinge from hips, long spine'], 'Rounding back.'),
        drill('m4-fri-sd', 'Shoulder Dislocates', '10', ['Wide grip, arms straight'], 'Bending elbows.'),
        drill('m4-fri-ds', 'Deep Squat Hold', '60s', ['Heels flat, chest tall'], 'Forcing.', { duration: 60, sides: 1 }),
      ]},
      saturday: { title: 'Long Stretch', intro: 'Introduce pancake. No load yet.', drills: [
        drill('m4-sat-pc', 'Pancake Hold (bodyweight)', '60s × 2', ['Legs wide, toes up', 'Hinge forward, long spine', 'Chest leads, not head'], 'Rounding to reach lower.', { duration: 60, sides: 1 }),
        drill('m4-sat-bf', 'Butterfly', '75s × 2', ['Lean from hips'], 'Pushing knees.', { duration: 75, sides: 1 }),
        drill('m4-sat-pg', 'Pigeon', '90s each', ['Cushion under hip if needed'], 'Hip uneven.', { duration: 90, sides: 2 }),
        drill('m4-sat-cs', 'Couch Stretch', '60s each', ['Back shin on wall, tuck pelvis'], 'Lower back arch.', { duration: 60, sides: 2 }),
        drill('m4-sat-jc', 'Jefferson Curl (5 lb)', '3 × 5', ['Roll down slow', 'Stay segmented'], 'Hinging from hips.'),
      ]},
    },
  },

  5: {
    name: 'End-Range Strength',
    tagline: 'The real Elastaboy work.',
    morning: {
      intro: 'Add active stretching with load. Move with intent.',
      drills: [
        drill('m5-catcow', 'Cat-Cows', '2 × 15', ['Slow, breath-driven', 'End-range pause'], 'Rushing.'),
        drill('m5-9090', '90/90 Hip Rotations', '10 each', ['Hold end range 2 sec each side', 'Chest tall'], 'Swinging.'),
        drill('m5-pg', 'Pigeon Good Morning', '8 each', ['Hipbones forward, hinge', 'Long spine each rep'], 'Rounding back.'),
        drill('m5-cossack', 'Cossack Shift', '10 reps', ['Hold 3 sec at full depth', 'Both heels flat'], 'Heel popping.'),
        drill('m5-hfr', 'Half-Kneeling Hip Flexor + Rotation', '30s each', ['Tuck, squeeze, then rotate toward front leg', 'Open chest'], 'Lower back pinch.', { duration: 30, sides: 2 }),
        drill('m5-sd', 'Shoulder Dislocates (stick)', '12 reps', ['Broomstick or PVC, wide grip', 'Arms straight, slow'], 'Bending elbows.'),
        drill('m5-cars', 'Full Body CARs', '5 each', ['Hit every joint', 'Slow, end range'], 'Rushing.'),
      ],
    },
    days: {
      monday: { title: 'Hips & Legs', intro: 'ATG entry. Couch stretch flat.', drills: [
        drill('m5-mon-atg', 'ATG Split Squat (bodyweight)', '3 × 6 each', ['Long lunge, front knee tracks far over toes', 'Heel stays flat', 'Build depth over weeks'], 'Heel lifting. Sit deeper, not further.'),
        drill('m5-mon-wcs', 'Weighted Cossack Squat', '3 × 6 each', ['Goblet hold light DB', 'Sit fully one side, heels flat', 'Pause 1 sec'], 'Weight pulling forward.'),
        drill('m5-mon-cs3', 'Couch Stretch (flat)', '60s each', ['Back shin on wall, torso upright', 'Tuck tailbone, squeeze glute', 'Stay tall'], 'Faking upright by arching back.', { duration: 60, sides: 2 }),
        drill('m5-mon-jc', 'Jefferson Curl (10 lb)', '3 × 8', ['Slow segmented roll down/up', 'Light load only'], 'Going too heavy.'),
      ]},
      tuesday: { title: 'Shoulders & Upper', intro: 'Scap pull-ups. Loaded dislocates.', drills: [
        drill('m5-tue-sp', 'Scapula Pull-Ups', '3 × 8', ['Dead hang, arms straight', 'Pull blades down and back', 'Body rises an inch'], 'Bending elbows.'),
        drill('m5-tue-lsd', 'Loaded Shoulder Dislocates', '3 × 10', ['Light bar or weighted band', 'Slow, arms straight'], 'Speed.'),
        drill('m5-tue-dh', 'Dead Hang', '3 × 30s', ['Relax, breathe', 'Decompress shoulders'], 'Grip failing.', { duration: 30, sides: 1 }),
        drill('m5-tue-lte', 'Loaded Thoracic Extension', '3 × 8', ['Light DB held overhead', 'Lie back over roller', 'Open chest'], 'Lower back arching.'),
      ]},
      wednesday: { title: 'Spine & Core', intro: 'Loaded core. Jefferson curl.', drills: [
        drill('m5-wed-db', 'Loaded Dead Bug', '3 × 10 each', ['Hold light DBs', 'Press back to floor', 'Slow extension'], 'Back arching.'),
        drill('m5-wed-gb', 'Banded Glute Bridge', '3 × 15', ['Push knees out', 'Squeeze hard at top'], 'Knees caving.'),
        drill('m5-wed-bd', 'Bird Dog', '3 × 10 each', ['Hold extension 3 sec', 'Square hips'], 'Hip rotating up.'),
        drill('m5-wed-jc', 'Jefferson Curl (10 lb)', '3 × 8', ['Slow segmented', 'Light load'], 'Going heavy too soon.'),
      ]},
      friday: { title: 'Full Body Flow', intro: '3 rounds. Real Elastaboy flow.', drills: [
        drill('m5-fri-atg', 'ATG Split Squat', '6 each', ['Long lunge, knee past toes', 'Heel flat'], 'Heel lifting.'),
        drill('m5-fri-cs', 'Cossack Squat', '6 each', ['Light DB or bodyweight', 'Full depth one side'], 'Past tolerance.'),
        drill('m5-fri-pg', 'Pigeon Good Morning', '8 each', ['Hinge at hips, long spine'], 'Rounding back.'),
        drill('m5-fri-sd', 'Shoulder Dislocates', '10', ['Stick, wide grip, straight arms'], 'Bending elbows.'),
        drill('m5-fri-ds', 'Deep Squat Hold', '60s', ['Heels flat, chest tall'], 'Forcing.', { duration: 60, sides: 1 }),
      ]},
      saturday: { title: 'Long Stretch (loaded)', intro: 'Light weight on pancake/pike. 5 lb only.', drills: [
        drill('m5-sat-pc', 'Loaded Pancake (5 lb)', '45s × 2', ['Light DB at chest', 'Hinge from hips, long spine'], 'Rounding back.', { duration: 45, sides: 1 }),
        drill('m5-sat-pk', 'Loaded Pike (5 lb)', '45s × 2', ['Light DB at chest', 'Hinge toward toes'], 'Rounding back.', { duration: 45, sides: 1 }),
        drill('m5-sat-pg', 'Pigeon', '90s each', ['Cushion under hip if needed'], 'Hip uneven.', { duration: 90, sides: 2 }),
        drill('m5-sat-cs', 'Couch Stretch (flat)', '75s each', ['Back shin on wall, upright', 'Tuck and squeeze'], 'Faking upright.', { duration: 75, sides: 2 }),
        drill('m5-sat-jc', 'Jefferson Curl (10 lb)', '3 × 8', ['Slow segmented roll'], 'Going heavy.'),
      ]},
    },
  },

  6: {
    name: 'Advanced',
    tagline: 'Full Elastaboy. Trust the work you put in.',
    morning: {
      intro: 'The original program. By now this should feel natural.',
      drills: [
        drill('m6-catcow', 'Cat-Cows', '× 10', ['Breath-driven', 'Articulate every segment'], 'Rushing.'),
        drill('m6-9090', '90/90 Hip Rotations', '10 each', ['Full rotation, chest tall'], 'Swinging.'),
        drill('m6-pg', 'Pigeon Good Mornings', '8 each', ['Long spine, hinge from hips'], 'Rounding.'),
        drill('m6-cossack', 'Cossack Shift', '10', ['Both heels flat', 'Full depth each side'], 'Heel popping.'),
        drill('m6-hf', 'Half-Kneeling Hip Flexor', '30s each', ['Tuck, squeeze, breathe'], 'Lower back arch.', { duration: 30, sides: 2 }),
        drill('m6-sd', 'Shoulder Dislocates', '10', ['Wide grip, arms straight'], 'Bending elbows.'),
        drill('m6-neck', 'Neck CARs', '5 each', ['Slow chin circle'], 'Speed.'),
      ],
    },
    days: {
      monday: { title: 'Hips & Legs', intro: 'Full Elastaboy hip work.', drills: [
        drill('m6-mon-atg', 'ATG Split Squat', '3 × 8 each', ['Front knee far over toes', 'Heel flat, hamstring to calf'], 'Heel lift.'),
        drill('m6-mon-wcs', 'Weighted Cossack Squat', '3 × 8 each', ['Goblet hold, full depth', 'Pause 1 sec'], 'Past tolerance.'),
        drill('m6-mon-cs', 'Couch Stretch (flat)', '3 × 60s each', ['Upright torso, tuck, squeeze'], 'Faking upright.', { duration: 60, sides: 2 }),
        drill('m6-mon-jc', 'Jefferson Curl (10–15 lb)', '3 × 8', ['Slow segmented', 'Increase load only when form is clean'], 'Rushing weight.'),
      ]},
      tuesday: { title: 'Shoulders & Upper', intro: 'Hanging work. Skin-the-cat.', drills: [
        drill('m6-tue-sp', 'Scapula Pull-Ups', '3 × 10', ['Arms straight, drive blades down'], 'Bending elbows.'),
        drill('m6-tue-lsd', 'Loaded Shoulder Dislocates', '3 × 10', ['Light bar, slow'], 'Speed.'),
        drill('m6-tue-gh', 'German Hang', '3 × 30s', ['Invert through, lower feet behind', 'Hold the passive stretch', 'Build gradually'], 'Pushing past pinch.', { duration: 30, sides: 1 }),
        drill('m6-tue-stc', 'Skin-the-Cats', '3 × 5', ['Hang, tuck knees, invert through', 'Lower toes behind, return through'], 'Going too fast — control both directions.'),
      ]},
      wednesday: { title: 'Spine & Core', intro: 'Full original protocol.', drills: [
        drill('m6-wed-pm', 'Pelvic Tilt + March', '3 × 10', ['Press back flat, hold tilt'], 'Back arching.'),
        drill('m6-wed-gb', 'Banded Glute Bridge', '3 × 12', ['Push knees out, squeeze top'], 'Knees caving.'),
        drill('m6-wed-cc', 'Cat-Cows', '3 × 15', ['Slow, full range'], 'Rushing.'),
        drill('m6-wed-te', 'Thoracic Ext over Roller', '3 × 10', ['Roller under upper back', 'Ribs tucked, open chest'], 'Lower back arching.'),
      ]},
      friday: { title: 'Full Body Flow', intro: '3 rounds. Original full body.', drills: [
        drill('m6-fri-cs', 'Cossack Shift', '10', ['Heels flat both sides'], 'Heel popping.'),
        drill('m6-fri-atg', 'ATG Split Squat', '8 each', ['Knee past toes, heel flat'], 'Heel lifting.'),
        drill('m6-fri-pg', 'Pigeon Good Morning', '8 each', ['Hinge, long spine'], 'Rounding.'),
        drill('m6-fri-sd', 'Shoulder Dislocates', '10', ['Wide grip, arms straight'], 'Elbows bending.'),
        drill('m6-fri-ds', 'Deep Squat Hold', '45s', ['Heels flat, chest tall'], 'Forcing.', { duration: 45, sides: 1 }),
      ]},
      saturday: { title: 'Long Stretch (loaded)', intro: '10–15 lb pancake. Heavy by your standards now.', drills: [
        drill('m6-sat-pc', 'Loaded Pancake (10–15 lb)', '45s × 2', ['DB at chest, hinge', 'Increase load only when form is clean'], 'Rounding back.', { duration: 45, sides: 1 }),
        drill('m6-sat-pk', 'Loaded Pike (10–15 lb)', '45s × 2', ['Hinge toward toes, long spine'], 'Rounding.', { duration: 45, sides: 1 }),
        drill('m6-sat-st', 'Straddle Holds', '30s each', ['Legs in V, hold over left, center, right'], 'Forcing past tolerance.', { duration: 30, sides: 3 }),
        drill('m6-sat-cs', 'Couch Stretch (flat)', '75s each', ['Upright, tuck, squeeze'], 'Faking it.', { duration: 75, sides: 2 }),
        drill('m6-sat-jc', 'Jefferson Curl (15 lb)', '3 × 8', ['Slow segmented'], 'Going heavier than form allows.'),
      ]},
    },
  },
};

// Days without a deep session — same across all months
const STATIC_DAYS = {
  thursday: { title: 'Active Recovery', intro: 'Just the morning routine. Optional: 10-min walk.', drills: [] },
  sunday: { title: 'Rest', intro: 'Full rest. Recovery is when adaptation happens.', drills: [] },
};

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const DAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ──────────────────────────────────────────────────────────────────────────
// UTILITIES
// ──────────────────────────────────────────────────────────────────────────

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const daysBetween = (isoStart) => {
  if (!isoStart) return 0;
  const start = new Date(isoStart);
  const now = new Date();
  return Math.floor((now - start) / (1000 * 60 * 60 * 24));
};

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
};

// ──────────────────────────────────────────────────────────────────────────
// TIMER MODAL
// ──────────────────────────────────────────────────────────────────────────

function TimerModal({ drill, onClose, onComplete }) {
  const { duration, sides } = drill.timer;
  const [side, setSide] = useState(1);
  const [seconds, setSeconds] = useState(duration);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, seconds]);

  useEffect(() => {
    if (seconds === 0) {
      if (navigator.vibrate) navigator.vibrate(200);
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 660;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(); osc.stop(ctx.currentTime + 0.3);
      } catch (e) {}
      if (side < sides) {
        setTimeout(() => { setSide(side + 1); setSeconds(duration); }, 1500);
      } else {
        setDone(true); setRunning(false);
      }
    }
  }, [seconds, side, sides, duration]);

  const progress = ((duration - seconds) / duration) * 100;
  const circumference = 2 * Math.PI * 120;
  const offset = circumference - (progress / 100) * circumference;

  const handleComplete = () => { onComplete(drill.id); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(20, 17, 13, 0.92)', backdropFilter: 'blur(8px)' }}>
      <button onClick={onClose} className="absolute top-6 right-6 text-stone-300 hover:text-white p-2">
        <X size={24} strokeWidth={1.5} />
      </button>
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="text-xs uppercase tracking-[0.3em] text-stone-400 mb-3" style={{ fontFamily: 'Geist Mono, monospace' }}>
          {sides > 1 ? `Side ${side} of ${sides}` : 'Hold'}
        </div>
        <h2 className="text-3xl text-stone-50 mb-12 text-center" style={{ fontFamily: 'Fraunces, serif', fontWeight: 400 }}>
          {drill.name}
        </h2>
        <div className="relative w-72 h-72 mb-12">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
            <circle cx="128" cy="128" r="120" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" />
            <circle cx="128" cy="128" r="120" fill="none" stroke="#D97757" strokeWidth="2" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-7xl text-stone-50 tabular-nums" style={{ fontFamily: 'Fraunces, serif', fontWeight: 300 }}>
              {formatTime(seconds)}
            </div>
            {done && <div className="text-sm uppercase tracking-[0.25em] text-orange-300 mt-3" style={{ fontFamily: 'Geist Mono, monospace' }}>Complete</div>}
          </div>
        </div>
        {!done ? (
          <button onClick={() => setRunning(!running)}
            className="flex items-center gap-3 px-8 py-3 rounded-full border border-stone-600 text-stone-100 hover:bg-stone-800"
            style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', letterSpacing: '0.2em' }}>
            {running ? <Pause size={14} /> : <Play size={14} />}
            {running ? 'PAUSE' : 'RESUME'}
          </button>
        ) : (
          <button onClick={handleComplete}
            className="flex items-center gap-3 px-10 py-3 rounded-full bg-orange-200 text-stone-900 hover:bg-orange-100"
            style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', letterSpacing: '0.2em' }}>
            <Check size={14} strokeWidth={2.5} />
            MARK DONE
          </button>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// MONTH PICKER MODAL
// ──────────────────────────────────────────────────────────────────────────

function MonthPicker({ currentMonth, monthStart, onSelect, onClose }) {
  const daysOnMonth = daysBetween(monthStart);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(20, 17, 13, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md bg-stone-50 rounded-t-3xl sm:rounded-3xl p-6 max-h-[85vh] overflow-y-auto"
        style={{ background: '#F5F1EA' }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-stone-900" style={{ fontFamily: 'Fraunces, serif', fontWeight: 400 }}>The Six Months</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700"><X size={20} /></button>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((m) => {
            const p = PROGRAMS[m];
            const isCurrent = m === currentMonth;
            const isLocked = m > currentMonth;
            return (
              <button key={m}
                onClick={() => { onSelect(m); onClose(); }}
                className="w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4"
                style={{
                  background: isCurrent ? '#1c1917' : 'rgba(28, 25, 23, 0.04)',
                  color: isCurrent ? '#F5F1EA' : '#1c1917',
                }}>
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: isCurrent ? 'rgba(217, 119, 87, 0.2)' : 'transparent',
                    border: isCurrent ? 'none' : `1px solid ${isLocked ? '#d6d3d1' : '#78716c'}`,
                  }}>
                  {isLocked ? <Lock size={14} className="text-stone-400" /> : (
                    <span className="text-sm tabular-nums" style={{ fontFamily: 'Geist Mono, monospace', color: isCurrent ? '#D97757' : '#1c1917' }}>{m}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-lg leading-tight" style={{ fontFamily: 'Fraunces, serif', fontWeight: 400 }}>
                    {p.name}
                  </div>
                  <div className="text-xs mt-0.5" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', opacity: 0.7 }}>
                    {p.tagline}
                  </div>
                </div>
                {isCurrent && (
                  <div className="text-[10px] uppercase tracking-[0.2em] tabular-nums px-2 py-1 rounded-full"
                    style={{ fontFamily: 'Geist Mono, monospace', background: 'rgba(217, 119, 87, 0.2)', color: '#D97757' }}>
                    Day {daysOnMonth + 1}
                  </div>
                )}
                {isLocked && <ChevronRight size={16} className="text-stone-400" />}
              </button>
            );
          })}
        </div>
        <div className="mt-6 pt-4 border-t border-stone-300/50 text-xs leading-relaxed text-stone-600" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
          Six months of progressive mobility. You unlock the next month after spending 30 days in your current one — the app will suggest the advance and ask you to confirm.
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// DRILL CARD
// ──────────────────────────────────────────────────────────────────────────

function DrillCard({ drill, index, isComplete, isExpanded, onExpand, onComplete, onStartTimer }) {
  return (
    <div className="border-b border-stone-300/60 last:border-b-0" style={{ background: isComplete ? 'rgba(217, 119, 87, 0.04)' : 'transparent' }}>
      <button onClick={onExpand} className="w-full px-1 py-5 flex items-start gap-4 text-left">
        <div className="flex-shrink-0 mt-1">
          <button onClick={(e) => { e.stopPropagation(); onComplete(drill.id); }}
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
            style={{ borderColor: isComplete ? '#D97757' : '#a8a29e', background: isComplete ? '#D97757' : 'transparent' }}>
            {isComplete && <Check size={14} strokeWidth={3} color="white" />}
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-xs text-stone-400 tabular-nums" style={{ fontFamily: 'Geist Mono, monospace' }}>{String(index + 1).padStart(2, '0')}</span>
            <h3 className="text-xl text-stone-900 leading-tight"
              style={{ fontFamily: 'Fraunces, serif', fontWeight: 400,
                textDecoration: isComplete ? 'line-through' : 'none',
                textDecorationColor: 'rgba(217, 119, 87, 0.5)', textDecorationThickness: '1px' }}>
              {drill.name}
            </h3>
          </div>
          <div className="text-xs text-stone-500 uppercase tracking-[0.15em] pl-7" style={{ fontFamily: 'Geist Mono, monospace' }}>
            {drill.spec}
          </div>
        </div>
        <ChevronDown size={18} strokeWidth={1.5} className="text-stone-400 mt-2 flex-shrink-0 transition-transform"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>
      {isExpanded && (
        <div className="pb-6 pl-11 pr-2 animate-fadeIn">
          <ul className="space-y-2 mb-5">
            {drill.cues.map((cue, i) => (
              <li key={i} className="text-stone-700 text-sm leading-relaxed flex gap-3" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
                <span className="text-orange-500 flex-shrink-0 mt-1.5"><Circle size={4} fill="currentColor" /></span>
                <span>{cue}</span>
              </li>
            ))}
          </ul>
          <div className="text-xs text-stone-500 mb-5 leading-relaxed border-l-2 border-stone-300 pl-3 italic"
            style={{ fontFamily: 'Fraunces, serif', fontWeight: 400 }}>
            Avoid: {drill.avoid}
          </div>
          {drill.timer && (
            <button onClick={() => onStartTimer(drill)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-stone-900 text-orange-100 hover:bg-stone-800"
              style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px', letterSpacing: '0.2em' }}>
              <Play size={12} fill="currentColor" />
              START TIMER
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// MAIN APP
// ──────────────────────────────────────────────────────────────────────────

export default function App() {
  const [today] = useState(new Date().getDay());
  const [selectedDay, setSelectedDay] = useState(today);
  const [completed, setCompleted] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [timerDrill, setTimerDrill] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Progression state
  const [currentMonth, setCurrentMonth] = useState(1);
  const [monthStart, setMonthStart] = useState(null);
  const [viewMonth, setViewMonth] = useState(1);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [dismissedAdvanceFor, setDismissedAdvanceFor] = useState(null);

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const [c, m, ms, dis] = await Promise.all([
          window.storage.get('mobility-completed').catch(() => null),
          window.storage.get('mobility-current-month').catch(() => null),
          window.storage.get('mobility-month-start').catch(() => null),
          window.storage.get('mobility-dismissed-advance').catch(() => null),
        ]);
        if (c?.value) setCompleted(JSON.parse(c.value));
        if (m?.value) {
          const parsed = parseInt(m.value);
          setCurrentMonth(parsed);
          setViewMonth(parsed);
        }
        if (ms?.value) setMonthStart(ms.value);
        else {
          // First time — set month start to today
          const k = todayKey();
          setMonthStart(k);
          try { await window.storage.set('mobility-month-start', k); } catch (e) {}
        }
        if (dis?.value) setDismissedAdvanceFor(dis.value);
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  // Save completed
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try { await window.storage.set('mobility-completed', JSON.stringify(completed)); } catch (e) {}
    })();
  }, [completed, loaded]);

  const dayKey = DAY_KEYS[selectedDay];
  const viewProgram = PROGRAMS[viewMonth];
  const session = STATIC_DAYS[dayKey] || viewProgram.days[dayKey] || { title: viewProgram.name, intro: 'Just the morning routine.', drills: [] };
  const morning = viewProgram.morning;
  const tKey = todayKey();
  const dayCompletions = completed[tKey] || {};
  const isToday = selectedDay === today;
  const isViewingCurrentMonth = viewMonth === currentMonth;
  const daysOnMonth = daysBetween(monthStart);
  const canAdvance = isViewingCurrentMonth && currentMonth < 6 && daysOnMonth >= 30 && dismissedAdvanceFor !== `month-${currentMonth}-day-${Math.floor(daysOnMonth / 7)}`;

  const toggleComplete = useCallback((drillId) => {
    setCompleted((prev) => {
      const dayMap = { ...(prev[tKey] || {}) };
      if (dayMap[drillId]) delete dayMap[drillId];
      else dayMap[drillId] = true;
      return { ...prev, [tKey]: dayMap };
    });
  }, [tKey]);

  const handleTimerComplete = useCallback((drillId) => {
    setCompleted((prev) => ({ ...prev, [tKey]: { ...(prev[tKey] || {}), [drillId]: true } }));
  }, [tKey]);

  const advanceMonth = async () => {
    const next = currentMonth + 1;
    setCurrentMonth(next);
    setViewMonth(next);
    const k = todayKey();
    setMonthStart(k);
    setDismissedAdvanceFor(null);
    try {
      await window.storage.set('mobility-current-month', String(next));
      await window.storage.set('mobility-month-start', k);
      await window.storage.delete('mobility-dismissed-advance');
    } catch (e) {}
  };

  const dismissAdvance = async () => {
    const tag = `month-${currentMonth}-day-${Math.floor(daysOnMonth / 7)}`;
    setDismissedAdvanceFor(tag);
    try { await window.storage.set('mobility-dismissed-advance', tag); } catch (e) {}
  };

  // Streak
  const streak = (() => {
    let count = 0;
    const d = new Date();
    while (true) {
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayDone = completed[k] && Object.keys(completed[k]).length > 0;
      if (!dayDone) {
        if (count === 0 && k === tKey) { d.setDate(d.getDate() - 1); continue; }
        break;
      }
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  })();

  const morningCount = morning.drills.length;
  const deepCount = session.drills.length;
  const morningDone = morning.drills.filter((d) => dayCompletions[d.id]).length;
  const deepDone = session.drills.filter((d) => dayCompletions[d.id]).length;
  const totalDone = morningDone + deepDone;
  const totalCount = morningCount + deepCount;

  return (
    <div className="min-h-screen w-full" style={{ background: '#F5F1EA', fontFamily: 'Geist, system-ui, sans-serif', color: '#1c1917' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..700,0..100&family=Geist:wght@300..600&family=Geist+Mono:wght@400;500&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideDown { animation: slideDown 0.5s ease-out; }
        .grain::before {
          content: ''; position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
          opacity: 0.04; pointer-events: none; mix-blend-mode: multiply;
        }
      `}</style>

      <div className="max-w-md mx-auto px-6 pt-10 pb-32 relative grain">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-8">
          <button onClick={() => setShowMonthPicker(true)} className="flex flex-col items-start group">
            <div className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-1 flex items-center gap-1.5" style={{ fontFamily: 'Geist Mono, monospace' }}>
              Month {String(viewMonth).padStart(2, '0')} · {viewProgram.name}
              <ChevronDown size={11} className="text-stone-400 group-hover:text-stone-600 transition-colors" />
            </div>
            <h1 className="text-2xl text-stone-900" style={{ fontFamily: 'Fraunces, serif', fontWeight: 400, fontStyle: 'italic' }}>
              Mobility
            </h1>
          </button>
          <div className="flex items-center gap-4">
            {streak > 0 && (
              <div className="flex items-center gap-2">
                <Flame size={14} className="text-orange-500" fill="currentColor" />
                <span className="text-sm tabular-nums" style={{ fontFamily: 'Geist Mono, monospace' }}>{streak}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500" style={{ fontFamily: 'Geist Mono, monospace' }}>day{streak !== 1 ? 's' : ''}</span>
              </div>
            )}
            <button onClick={() => setShowAccount(true)} aria-label="Account"
              className="text-stone-500 hover:text-stone-800 p-1 -mr-1">
              <User size={18} strokeWidth={1.5} />
            </button>
          </div>
        </header>

        {/* ADVANCEMENT BANNER */}
        {canAdvance && (
          <div className="mb-8 p-5 rounded-2xl border border-orange-300/50 animate-slideDown"
            style={{ background: 'linear-gradient(135deg, rgba(217, 119, 87, 0.08), rgba(217, 119, 87, 0.02))' }}>
            <div className="text-[10px] uppercase tracking-[0.3em] text-orange-600 mb-2" style={{ fontFamily: 'Geist Mono, monospace' }}>
              You've earned this
            </div>
            <div className="text-lg text-stone-900 mb-1" style={{ fontFamily: 'Fraunces, serif', fontWeight: 400 }}>
              30 days on {viewProgram.name}.
            </div>
            <div className="text-sm text-stone-600 mb-4" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
              Ready to step into <strong style={{ fontStyle: 'normal' }}>{PROGRAMS[currentMonth + 1].name}</strong>?
            </div>
            <div className="flex gap-2">
              <button onClick={advanceMonth}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 text-orange-100 hover:bg-stone-800"
                style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px', letterSpacing: '0.2em' }}>
                ADVANCE <ArrowRight size={12} />
              </button>
              <button onClick={dismissAdvance}
                className="px-4 py-2 rounded-full text-stone-600 hover:bg-stone-200/60"
                style={{ fontFamily: 'Geist Mono, monospace', fontSize: '10px', letterSpacing: '0.2em' }}>
                NOT YET
              </button>
            </div>
          </div>
        )}

        {/* VIEWING PREVIEW NOTICE */}
        {!isViewingCurrentMonth && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-stone-900/5 border border-stone-300/50 flex items-center justify-between">
            <div className="text-xs text-stone-600" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
              {viewMonth > currentMonth ? 'Previewing future month' : 'Reviewing earlier month'}
            </div>
            <button onClick={() => setViewMonth(currentMonth)}
              className="text-[10px] uppercase tracking-[0.2em] text-orange-600 hover:text-orange-700"
              style={{ fontFamily: 'Geist Mono, monospace' }}>
              Return →
            </button>
          </div>
        )}

        {/* DAY SELECTOR */}
        <div className="flex gap-1 mb-10 -mx-1">
          {DAY_SHORT.map((label, i) => {
            const isActive = i === selectedDay;
            const isCurrent = i === today;
            return (
              <button key={label} onClick={() => { setSelectedDay(i); setExpandedId(null); }}
                className="flex-1 py-3 rounded-md transition-all relative"
                style={{ background: isActive ? '#1c1917' : 'transparent', color: isActive ? '#F5F1EA' : '#78716c' }}>
                <div className="text-[10px] tracking-[0.15em]" style={{ fontFamily: 'Geist Mono, monospace' }}>{label}</div>
                {isCurrent && !isActive && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: '#D97757' }} />
                )}
              </button>
            );
          })}
        </div>

        {/* DAY HEADING */}
        <div className="mb-2">
          <div className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-2" style={{ fontFamily: 'Geist Mono, monospace' }}>
            {isToday && isViewingCurrentMonth ? 'Today' : DAY_LONG[selectedDay]}
          </div>
          <h2 className="text-5xl text-stone-900 leading-[0.95] mb-3" style={{ fontFamily: 'Fraunces, serif', fontWeight: 300 }}>
            {session.title}
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 400 }}>
            {session.intro}
          </p>
        </div>

        {/* PROGRESS METER */}
        {totalCount > 0 && isViewingCurrentMonth && (
          <div className="mt-8 mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500" style={{ fontFamily: 'Geist Mono, monospace' }}>Today's Progress</span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone-700 tabular-nums" style={{ fontFamily: 'Geist Mono, monospace' }}>{totalDone} / {totalCount}</span>
            </div>
            <div className="h-px bg-stone-300 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 transition-all duration-500"
                style={{ width: `${(totalDone / totalCount) * 100}%`, background: '#D97757', height: '2px', top: '-0.5px' }} />
            </div>
          </div>
        )}

        {/* MORNING SECTION */}
        <section className="mt-12">
          <div className="flex items-baseline justify-between mb-1 pb-3 border-b border-stone-900/20">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-1" style={{ fontFamily: 'Geist Mono, monospace' }}>01</div>
              <h3 className="text-2xl text-stone-900" style={{ fontFamily: 'Fraunces, serif', fontWeight: 400 }}>Morning Routine</h3>
            </div>
            {isViewingCurrentMonth && (
              <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500 tabular-nums" style={{ fontFamily: 'Geist Mono, monospace' }}>
                {morningDone}/{morningCount}
              </div>
            )}
          </div>
          <div className="mt-3 mb-2">
            <p className="text-xs text-stone-600 leading-relaxed pl-1" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
              {morning.intro}
            </p>
          </div>
          <div>
            {morning.drills.map((d, i) => (
              <DrillCard key={d.id} drill={d} index={i}
                isComplete={!!dayCompletions[d.id]}
                isExpanded={expandedId === d.id}
                onExpand={() => setExpandedId(expandedId === d.id ? null : d.id)}
                onComplete={toggleComplete}
                onStartTimer={setTimerDrill} />
            ))}
          </div>
        </section>

        {/* DEEP SESSION */}
        {session.drills.length > 0 && (
          <section className="mt-16">
            <div className="flex items-baseline justify-between mb-1 pb-3 border-b border-stone-900/20">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-1" style={{ fontFamily: 'Geist Mono, monospace' }}>02</div>
                <h3 className="text-2xl text-stone-900" style={{ fontFamily: 'Fraunces, serif', fontWeight: 400 }}>{session.title}</h3>
              </div>
              {isViewingCurrentMonth && (
                <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500 tabular-nums" style={{ fontFamily: 'Geist Mono, monospace' }}>
                  {deepDone}/{deepCount}
                </div>
              )}
            </div>
            <div>
              {session.drills.map((d, i) => (
                <DrillCard key={d.id} drill={d} index={i}
                  isComplete={!!dayCompletions[d.id]}
                  isExpanded={expandedId === d.id}
                  onExpand={() => setExpandedId(expandedId === d.id ? null : d.id)}
                  onComplete={toggleComplete}
                  onStartTimer={setTimerDrill} />
              ))}
            </div>
          </section>
        )}

        {/* REST DAY */}
        {session.drills.length === 0 && selectedDay === 0 && (
          <div className="mt-16 py-12 text-center">
            <div className="text-7xl text-stone-300 mb-4" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 300 }}>rest</div>
            <p className="text-sm text-stone-500 max-w-xs mx-auto leading-relaxed" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
              Recovery is when adaptation happens. Take the day fully off.
            </p>
          </div>
        )}

        {/* FOOTER */}
        <footer className="mt-24 pt-8 border-t border-stone-300">
          <div className="text-[10px] uppercase tracking-[0.3em] text-stone-400 text-center leading-loose" style={{ fontFamily: 'Geist Mono, monospace' }}>
            Move slow · Breathe · Stop short of pain
          </div>
          <div className="text-[10px] text-stone-400 text-center mt-3" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
            6 months · 1% better each day
          </div>
        </footer>
      </div>

      {timerDrill && <TimerModal drill={timerDrill} onClose={() => setTimerDrill(null)} onComplete={handleTimerComplete} />}
      {showMonthPicker && <MonthPicker currentMonth={currentMonth} monthStart={monthStart} onSelect={setViewMonth} onClose={() => setShowMonthPicker(false)} />}
      {showAccount && <AccountModal onClose={() => setShowAccount(false)} />}
    </div>
  );
}
