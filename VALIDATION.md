# FIT OS evaluation validation

Deployment: https://fit-os-eslamba7r1991-8820.vercel.app/
Code deployed: c48e2ee0952b4c485df27d6ecd026a233e1cd5c5
Supabase project: fit-os (nafiwpuhchtcypxpkeju), dedicated project.
Vercel project: fit-os (prj_nQX5LQxUtgw5oN7Yw9P90H7I703I), dedicated project.

PASS: production build; 5 deterministic progression tests.
PASS: live Vercel API create/read/update/delete food record.
PASS: online Supabase persistence for QA TEST A (85 kg) and B (50 kg).
PASS: profile_id query isolation across measurements, food, recovery, workout sessions and sets.
PASS: database rejects cross-profile session/set references.
PASS: browser profile switch A to B, refresh retains B, B nutrition excludes A.
PASS: deployed manifest, service worker and PNG icon resources.
No application runtime errors observed during the tested dashboard/nutrition flows. Browser extension errors are external to the app.

Pending: full six-viewport responsive regression and installation on actual Android/iPhone. Local automated Chromium launch was blocked by environment socket restrictions; the cloud browser was used for the above desktop flows.
Pending: full original V1 acceptance matrix, advanced exercise history UI, persisted weekly reviews, all progression action branches, complete nutrition macro display.

This is a public evaluation release, NOT FIT OS V1.0 final acceptance. All seeded values are synthetic QA TEST data. Public API access intentionally reaches only the evaluation account's data; database access uses ownership RLS and credentials remain in Vercel server environment variables. Do not enter real health data until a family access gate is implemented.

GitHub auto-deployment link was rejected by Vercel repo_no_access. The deployment was created directly from the locally built artifacts plus api/data.js. A future GitHub push will not automatically deploy until repository permission is linked.
