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
