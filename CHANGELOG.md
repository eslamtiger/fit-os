# Changelog

## 0.1.0 — 2026-11-06

- Created the Arabic RTL, mobile-first React/TypeScript PWA shell with responsive Today, Workout, Food, Progress, and More views.
- Created FIT OS Database in Google Drive with the 13 requested logical tables and extra profile_id / water_ml columns.
- Added Apps Script source for safe schema setup, profile-owned CRUD, locked writes, workout session and set logging, nutrition totals, measurements, recovery, deterministic progression suggestions, and persisted weekly summaries.
- Added a profile switcher, profile forms, manual food/measurement/recovery/goal/nutrition-target inputs, a weekly summary view, and session/set workout logging.
- Added install manifest, SVG app icon, and service worker that caches only the app shell.
- Production build passes; five progression unit tests pass.
- Not deployed: Apps Script creation/deployment and live end-to-end QA require owner authorization and the deployed Web App URL.
