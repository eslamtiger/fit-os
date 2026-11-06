# Changelog

## 0.1.0 — 2026-11-06

- Created the Arabic RTL, mobile-first React/TypeScript PWA shell with responsive Today, Workout, Food, Progress, and More views.
- Created FIT OS Database in Google Drive with the 13 requested logical tables and extra profile_id / water_ml columns.
- Added Apps Script source for safe schema setup, profile-owned CRUD, locked writes, workout session and set logging, nutrition totals, measurements, recovery, deterministic progression suggestions, and persisted weekly summaries.
- Added a profile switcher, profile forms, manual food/measurement/recovery/goal/nutrition-target inputs, a weekly summary view, and session/set workout logging.
- Added install manifest, SVG app icon, and service worker that caches only the app shell.
- Production build passes; five progression unit tests pass.
- Not deployed: Apps Script creation/deployment and live end-to-end QA require owner authorization and the deployed Web App URL.

## 0.2.0 evaluation
- Added dedicated Supabase database and Vercel API adapter with authenticated ownership RLS.
- Kept credentials server-side; added explicit public evaluation notice.
- Migrated frontend reads/writes from Apps Script to Supabase.

## 0.2.0 — 2026-11-06
- Added reference-led light/dark UI, mobile workout actions and desktop navigation.
- Added Bahr synthetic home plan, warmup/stretching guidance and reusable meal suggestions stored online.
- Reworked session recording: resume from Supabase, prevent double submits, timestamp-based rest timer, explicit failures.
- Added real session history, waist trend and lazy-loaded charts; reduced entry bundle from ~638 kB to ~277 kB.
- Corrected previous-session ordering and excluded future entries from weekly totals.
- Added RESEARCH.md with first-party reference comparison and licensing decisions. No external fitness app code or media imported.

## 0.3.0 — Visual training experience
- Replaced the sage card design with an editorial midnight/cobalt, lavender, mint and coral interface, stronger typography and restrained motion.
- Workout opens on an interactive dated Saturday–Friday schedule with strength/walking/recovery days.
- Six bodyweight exercises now have code-native animated mannequin demonstrations with start/end poses, pause/play and visible sets/reps/tempo/rest.
- Exercise selection opens the session player. Starting a selected exercise creates/resumes an online session; actual reps/effort and set completion persist to Supabase.
- Added five illustrated stretching movements, a visible warmup tab, and recovery/sleep guidance with adult references.
- Nutrition now leads with daily calorie/macronutrient targets, a seven-day repeatable meal map, four explicit meals and adjustable portions before logging.
- Retained profile isolation, existing logs, targets and database schema. Custom exercises without a mapped demonstration are clearly identified instead of showing the wrong movement.

## V0.4 — Real exercise references and practical meals (2026-11-06)
- Replaced SVG stick figures for all six strength exercises with public-domain start/end photographs or verified male demonstration videos with source links.
- Reduced mobile exercise player media, stats and inputs; collapsed extended instructions and retained online set logging/rest timers.
- Added four illustrative Egyptian meal photographs, recipe ingredients, preparation steps, portion scaling and measured oil/spice advice.
- Added licensed media provenance and updated PWA shell cache.
