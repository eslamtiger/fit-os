# FIT OS — V0.2 evaluation validation

Date: 6 November 2026. Dedicated Supabase project: `fit-os` (`nafiwpuhchtcypxpkeju`). Dedicated Vercel project: `fit-os` (`prj_nQX5LQxUtgw5oN7Yw9P90H7I703I`). Source: `eslamtiger/fit-os`, branch `main`. No other project modified.

## Verified this iteration

- Production TypeScript/Vite build passes. Seven automated tests pass: five progression branches plus chronological completed-session history and future-record exclusion from weekly reports.
- GitHub connector commits succeeded. Vercel Git-source deployments now succeed; the deployment was explicitly requested for a known SHA. Automatic push deployment was not separately verified.
- Synthetic Bahr fixture exists online: profile, one baseline, nutrition targets, goal, six plan exercises, and JSON program guidance. No date of birth invented.
- Browser: A/B/Bahr switching clears previous profile contents; Bahr displays 86 kg while B retains 50 kg. Refresh preserves the selected profile.
- Browser in QA TEST A: an existing unfinished session was restored; one set was saved; pending buttons prevented repeat submission; a 60-second rest countdown appeared. Refresh restored the saved set and next set number. Finishing persisted the session, which appeared in exercise history and weekly totals. These are explicitly QA TEST records, not Bahr's training history.
- Browser in Bahr: meal templates do not count as eaten by default. Explicitly recording the breakfast produced 620 kcal / 32 g protein / 78 g carbohydrate / 20 g fat. Readback from dedicated Supabase confirmed the record. The newly created QA food record was removed after validation; no consumed-food history is prefilled for Bahr.
- Light/dark theme controls switch the live interface. Reference links and program guidance are present under More/workout/nutrition.
- Responsive browser harness `/qa-layouts.html`: all five main tabs checked at frame sizes 360×800, 390×844, 412×915, 768×1024, 1366×768, 1920×1080. Document scroll width equals client width in every one of 30 tab/size checks. Standard desktop scrollbars occupy 15 pixels inside these frames. This tests CSS layout, not a physical Android/iPhone.
- Visual desktop review found sidebar overlap in RTL; corrected logical padding and header stacking, then rechecked. Mobile dashboard and desktop dark theme inspected visually.
- Browser logs inspected: extension metadata errors were present; no blocking FIT OS runtime error observed in the tested paths.
- Chart module loaded on demand; initial JavaScript bundle approximately 278 kB uncompressed versus approximately 638 kB before.

## Limitations / pending full V1 acceptance

- Actual device PWA installation, browser background alarm behavior, and exhaustive offline recovery testing remain pending. Rest timer resumes accurately after tab suspension using wall time; a full reload restores the workout but not the rest countdown. No background notification is promised.
- Weekly review is calculated on demand rather than persisted as immutable weekly reports. Nutrition adherence requires complete daily entries; no precision claim is made from missing logs.
- Exercise videos/animations are not included; the six home exercises have written cues. No external app code or media was copied. The no-equipment plan does not provide the same pulling load as gym equipment.
- Synthetic nutrition targets are illustrative; user's age, real activity level and response are needed before personal calorie planning.
- Public evaluation access remains intentional and clearly marked. RLS/credentials were not weakened or exposed. An access gate is required before using private family data.

This is FIT OS V0.2 for evaluation, not a claim of V1.0 final acceptance.
