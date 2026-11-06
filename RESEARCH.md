# FIT OS — reference-led improvement, 6 November 2026

Scope: public first-party feature pages, support documentation and GitHub README/licence review. This is not a hands-on review of every paid/native app. Reference URLs and applied patterns are also in the app under More.

| Reference | Verified pattern | FIT OS implementation | Deliberately deferred |
| --- | --- | --- | --- |
| [Hevy](https://www.hevyapp.com/features/) | Logging, previous performance, rest timer, measurements | Set completion, visible previous set results, per-exercise rest | Social feed, photos |
| [Strong](https://www.strong.app/) | Simple workout notebook, routines and progress | Large controls, minimal typing, session history | Subscription, 1RM estimates |
| [Boostcamp](https://www.boostcamp.app/) | Programs, sets/reps/rest, progression, workout tools | Visible weekly schedule; deterministic, user-controlled progression | Importing proprietary programs |
| [Fitbod](https://fitbod.me/faqs/) | Equipment-, duration- and recovery-aware plans | No-equipment sample plan, recovery input and conservative progression | Claiming an AI-generated or diagnostic recovery score |
| [Cronometer](https://support.cronometer.com/hc/en-us/articles/360018593112-Mobile-Diary-Overview) | Diary, custom foods, nutrient targets | Macro targets separate from actual food entries; reusable meal templates | Commercial database, barcode scanning |
| [Nike Training Club](https://www.nike.com/ntc-app) | Guided strength, mobility and recovery content | Warmup, strength, post-workout stretching, weekly structure | Copying demonstration videos |
| [FitOn](https://fitonapp.com/) | At-home workouts plus wellness and nutrition | Home-first integrated program | Celebrity content, social challenges |
| [Workout.cool](https://github.com/Snouzy/workout-cool) | Open-source workout planner and exercise database; MIT | Reference for exercise detail and plan organization | No source code or bundled media copied |
| [Liftosaur](https://github.com/astashov/liftosaur) | PWA, explicit progression programming; AGPL-3.0 | Transparent progression decisions | No AGPL code imported; no scripting UI needed |
| [wger](https://github.com/wger-project/wger) | Workouts, nutrition, measurements; AGPL-3.0+ code, separately licensed content | Distinct plan/session/set/measurement records | No code/data imported; each exercise asset needs its own licence review |
| [GetFitPro](https://github.com/warpirate/GetFitPro) | Guided work/rest session and exercise instructions; MIT | Explicit start/log/rest/finish flow | Native Android port, external exercise GIFs |

## Design decision

Retain FIT OS navigation and Supabase data model. Use an airy warm light interface with forest green actions, lime highlights, strong Arabic hierarchy and a desktop sidebar. Include an alternate dark focus theme in More so the user can compare real screens with the same data. No stock people, copied screenshots, paid assets or new UI dependencies.

The actionable workout entry precedes statistics. A schedule describes planned activity, not completed activity. A meal template never counts toward intake until explicitly recorded. Missing history remains empty. Charts are loaded only when relevant.

## Bahr fixture

Synthetic pseudonymous adult male, 182 cm, 86 kg, waist 98 cm. Values are approximations for UI evaluation, not verified user measurements. No age or birth date invented. Three nonconsecutive full-body sessions weekly (Saturday, Tuesday, Thursday), two sets per exercise initially, target effort 6–7/10. Six exercises: squat, wall push-up, glute bridge, bird dog, prone W raise, dead bug. No-equipment back exercises do not substitute fully for loaded pulling; record this limitation explicitly.

Rest: 60–75 seconds, extend when needed. Five-minute light/dynamic warmup. Five post-workout stretches held 30 seconds per side, twice, without bouncing/pain. Gradual walking progression toward the adult guideline, not an immediate demand for an inactive beginner.

Nutrition example: approximately 2300 kcal, 150 g protein, 268 g carbohydrate, 70 g fat. Four reusable Egyptian-style meal examples with approximate preparation-dependent values. This is not a personalized calorie prescription: age and daily activity are unknown. Water target is a configurable demonstration value. No food consumed, sleep, completed workout, or weight-loss history is fabricated.

## Health references and boundaries

- [CDC adult activity](https://www.cdc.gov/physical-activity-basics/guidelines/adults.html): aerobic activity plus muscle strengthening on two or more days, progress from current ability.
- [Mayo Clinic stretching](https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20546848): warm up, gentle hold about 30 seconds, no bouncing/pain.
- [ACSM Resistance Training for Health](https://www.acsm.org/docs/default-source/files-for-resource-library/resistance-training-for-health.pdf): strength training structure and conservative starting volume.
- [ISSN position stand](https://link.springer.com/article/10.1186/s12970-017-0177-8): general protein guidance for exercising adults (roughly 1.4–2.0 g/kg/day); 150 g at demo weight is within that range.
- [NIDDK Body Weight Planner](https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner): personal energy planning depends on user inputs including age and activity. Do not infer exact needs from height/weight alone.

User reported home without equipment and no known constraints. This sample assumes an adult and should be adjusted with actual age, activity, preferences and response before personal use.

## Code reuse outcome

No external fitness application code was incorporated. Existing React, Lucide and Recharts dependencies remain. Reusing patterns was lower cost and avoided importing whole stacks or incompatible licensing; MIT candidates remain available for future narrowly justified reuse with attribution and asset review.
