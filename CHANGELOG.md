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
