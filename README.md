# FIT OS — evaluation build

Arabic RTL React PWA with Supabase persistence. Source: eslamtiger/fit-os.

This is a public evaluation environment for synthetic test data only. It is not a private family production release.

## Deployment

A dedicated Vercel project serves the PWA and /api/data function. A dedicated Supabase project stores the 13 application tables. No other project databases are used.

The Vercel function authenticates as a restricted evaluation account; tables have RLS ownership policies. No database password or secret is shipped to the browser or GitHub.

Server environment: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, FIT_OS_DEMO_EMAIL, FIT_OS_DEMO_PASSWORD. Keep these in Vercel environment settings.

Local frontend: npm install; npm run dev. Local verification: npm test; npm run build. The API requires a server environment providing the listed variables.

The database schema is in database/schema.sql. The previous Apps Script implementation is retained as legacy source and is not used by this build. Its DB_ID must be supplied through Script Properties if used separately.

## Mobile installation

Android Chrome: open the deployed URL, menu > Add to Home screen > Install. iOS Safari: Share > Add to Home Screen. Online access is required to read and save records. The offline shell never queues or claims to save health records.

## Before personal use

Replace the public evaluation API with a family access gate, rotate evaluation credentials, remove synthetic data, and repeat isolation testing. Making the GitHub repository private alone does not make the deployed application private.

## Reference-led evaluation update (0.2)
Open the profile switcher and select `بحر · تجريبي`. It contains approximate synthetic baseline measurements, a 3-day home program, daily nutrition targets and a reusable meal plan. Meal proposals count as intake only after `أكلتها — سجّل`. No age, sleep, completed workouts or weight-loss history are invented. See `RESEARCH.md` for product/health sources and licensing decisions. More contains light/dark UI examples and reference links.

The idempotent fixture can be installed into this evaluation instance with `node --experimental-strip-types scripts/seed-bahr.mjs`. Never point it at a personal production environment. Workout sessions resume from online sets after refresh; the rest countdown is timestamp-based but does not promise a background alarm or persistence after a full reload.

## Visual training workspace (0.3)
The Workout screen now has a dated seven-day selector and a separate illustrated warmup/stretching tab. Select a strength day (Saturday, Tuesday or Thursday in Bahr's demo), select an exercise card, then start it from the player. The player shows controlled tempo, target sets/reps, actual rep/effort inputs and rest. Online logging always uses today's date and retains the browsed scheduled day in session notes. Existing unfinished sessions restore automatically.

All eleven movement illustrations are original animated SVG mannequin diagrams, not video recordings or clinically validated 3D motion capture. Start/end pose controls and pause/play are provided; reduced-motion preferences disable autoplay. Exercise tempo is instructional and uses a controlled cycle; static stretches show gentle positioning, not a prescription to increase range. Unknown custom exercise names never inherit a misleading squat demo.

Nutrition's weekly map is intentionally a repeatable sample menu with the same four base meals. Portion multipliers scale estimated macros before logging. It is not seven independently personalized menus. Sleep content references https://www.cdc.gov/sleep/about/index.html and https://medlineplus.gov/healthysleep.html .

V0.4 adds actual exercise references, a more compact mobile set logger and photo recipe cards. Media attribution is in `public/media/SOURCES.md`; exercise photo licence accompanies the assets. Meal photos illustrate presentation, not portion size. Recipe amounts and nutrition are estimates; no individual nutrition assessment is implied.
