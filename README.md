# FIT OS

Private, Arabic-first family fitness and nutrition PWA. Approved data path: React + TypeScript → Google Apps Script Web App → Google Sheets in Drive.

## Current state

The mobile-first app and its Google Apps Script API source are built. The Google Drive folder and database sheet exist. Profile-specific records use stable IDs and profile_id; shared exercise and app-settings tables hold reference/configuration records. Offline caching is limited to the static application shell. The app does not queue health-data changes while offline.

**This is not yet a production release.** The Apps Script project has not been created or deployed, and the app has not been connected to a live API. Do not use real health data until the connection and two-profile isolation tests pass.

## Local development

    npm install
    npm run dev
    npm run build
    npm test

## Apps Script setup and access

The Apps Script source is in apps-script/Code.gs. Its database ID is already set to the FIT OS Database sheet.

1. Open script.google.com using the Google account that owns FIT OS Database and create a standalone project.
2. Paste apps-script/Code.gs into Code.gs.
3. Run setupDatabase() and approve the Google Sheets permission request.
4. Share FIT OS Database with the family members’ Google accounts as Editors.
5. Deploy as a Web App and choose **Execute as: User accessing the web app**. This lets the Sheet’s sharing list control who can read or write health records. The app has no separate username/password system, but each family member must be signed into Google and authorize the script.
6. Copy the /exec URL, enter it on FIT OS’s first screen, and test with two distinct profiles before entering real data.

Do not deploy the script as an unauthenticated public endpoint: anyone who obtains that URL could access family records. The connected tools do not expose Apps Script project creation or deployment, so these Google authorization/deployment steps require the owner.

## Data model notes

- Profile-owned rows are filtered and written with profile_id.
- WORKOUT_PLAN_EXERCISES adds a profile_id column for plan isolation.
- Exercise definitions and app-wide settings are shared reference/configuration data.
- setupDatabase() creates missing tabs, appends missing headers, preserves existing rows, freezes/formats headers, and sets the sheet timezone to Africa/Cairo.
- Writes use LockService; generated rows have stable UUID IDs.
- The app stores only the active profile ID and API URL in local storage. Health, workout, nutrition, body, and recovery data are never stored there.

## Limitations

Some features require live verification: cross-profile isolation, online persistence, recovery and nutrition totals, workbook header setup, Google authorization, and responsive rendering in a real browser. See VALIDATION.md.
