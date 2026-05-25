// 6-month progressive program data. Extracted from the original single-file app
// so every screen can read it.

export const drill = (id, name, spec, cues, avoid, timer = null) => ({ id, name, spec, cues, avoid, ...(timer ? { timer } : {}) });

export const PROGRAMS = {
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

export const STATIC_DAYS = {
  thursday: { title: 'Active Recovery', intro: 'Just the morning routine. Optional: 10-min walk.', drills: [] },
  sunday: { title: 'Rest', intro: 'Full rest. Recovery is when adaptation happens.', drills: [] },
};

export const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
export const DAY_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
export const DAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Resolve the session for a given month + weekday key.
export const getSession = (month, dayKey) => {
  const program = PROGRAMS[month];
  return (
    STATIC_DAYS[dayKey] ||
    program.days[dayKey] || {
      title: program.name,
      intro: 'Just the morning routine.',
      drills: [],
    }
  );
};

export const getMorning = (month) => PROGRAMS[month].morning;
