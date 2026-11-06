# FIT OS Validation

Status: **incomplete — do not label V1.0**

## Verified locally / in Drive

- [x] FIT OS Drive folder and database spreadsheet created.
- [x] Required 13 tabs exist.
- [x] WORKOUT_PLAN_EXERCISES includes profile_id; FOOD_LOGS includes water_ml.
- [x] Production build passes with npm run build.
- [x] Five deterministic progression unit tests pass with npm test.
- [x] Apps Script source parses as JavaScript (node --check).
- [x] No fake family profile or health records are seeded.
- [x] No health records are stored locally; offline indicator disables claims of online persistence.
- [x] PWA manifest, icon, shell cache, and install display mode are configured.

## Pending

- [ ] Create and authorize the Google Apps Script project.
- [ ] Run setupDatabase() against the real Sheet and verify its non-destructive behavior.
- [ ] Deploy API with Google-account access, share the Sheet with family accounts, and enter the /exec URL.
- [ ] API CRUD, validation errors, and concurrent-write verification.
- [ ] Two-profile isolation for workout, nutrition, measurements, recovery, and refresh persistence.
- [ ] Workout history and progression tested against live rows.
- [ ] Daily nutrition/water totals and target handling tested against live rows.
- [ ] Food update/delete tested against live rows.
- [ ] Weekly review data accuracy and persisted summary tested against live rows.
- [ ] Browser runtime/console QA and screenshots at 360, 390, 412, tablet, 1366×768, and 1920×1080.
- [ ] Production deployment (Vercel preferred) after the API and all blocking QA pass.

## Known limits before V1 acceptance

- No production URL exists yet because the real Apps Script API has not been deployed.
- Visual/browser QA could not be completed: the available browser could not reach the local development server.
- Tests cover the deterministic progression helper only. They do not simulate Google Apps Script or validate profile isolation.
- The exercise history chart, waist/exercise trend charts, and full historical weekly comparisons need more implementation/verification.
- Google account authorization is required to keep family health data private; this is Google access, not an app-specific account system.
