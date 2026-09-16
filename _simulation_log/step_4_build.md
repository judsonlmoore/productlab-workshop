# Step 4 — App Build

Date: 2026-09-16

## Inputs and output

**2026-09-16 repair update:** Repair pass: rebuilt the same three app files against dataset v2, and added durable regression checks in `tests/workshop.test.cjs`. Updated Prompts 03/04, the Feature Brief, design system, source model, and README to teach the resolved rules.

- Read `_context/feature_brief.md`, `data/requests.json`, and `schemas/design_system.md`.
- Built `src/index.html`, `src/app.css`, and `src/app.js` with native HTML, CSS Grid, and JavaScript.
- Preview: `http://127.0.0.1:8765/src/index.html`. Start from the repository root with `python3 -m http.server 8765 --bind 127.0.0.1` when needed.
- Dataset SHA-256 before and after: `051e0e1e24fe71c39e485ce069e7064858ad25f3c5840eb3e109c76aaaa39cab`.

## What worked

**2026-09-16 repair update:** Repair pass: Pricing insights now exposes response, clarification, and proposal-conversion metrics. Shared Event type filtering, Send Proposal, event-aware accept/decline/undo, actual response deadlines, profile content, capability matching, sticky phone booking, and disclosure preservation are implemented.

- The default entertainer profile surfaces performance and hourly pricing, duration, included equipment, venue requirements, exclusions, setup, examples, and Send Request in the prescribed hierarchy.
- Request details display every required Data Contract field, a pricing/equipment match signal, review status, clarification messages and fields, venue information, and timeline.
- Implemented creation, editing existing drafts, duration-dependent pricing suggestions, validation, duplicate prevention, review, clarification, accept, decline, and undo. Writes mutate the runtime requests and immediately recompute counts and metrics.
- Side-by-side comparison supports two or three entertainers, draft/default parameters, estimates, equipment requirements, availability, and profile navigation.
- Profiles and request detail share one fetched dataset. No backend, external messaging, libraries, CSS frameworks, inline styles, SVG, or Canvas were introduced. Google Fonts and Iconoir are the only external UI resources.
- Native controls and dialogs support keyboard operation, modal focus containment, Escape dismissal, and focus return. Feedback uses live regions; motion respects reduced-motion preferences.

## What broke or required interpretation

**2026-09-16 repair update:** Repair pass: the user authorized assumptions and dataset modifications, superseding the initial immutable-data constraint. All listed blockers/workarounds below have concrete resolutions in issues.md W01–W15; initials avatars and an anchored/resettable clock are deliberate documented workshop choices.

- The generic prompt references `metadata.stuck_candidates.threshold` and candidate identifiers, which do not exist here. Used request_id and the dataset's canonical/fixture threshold fields instead.
- The brief has no Supporting Views or defined filter controls. Implemented its two existing views and secondary comparison, with entertainer search from the described discovery journey; did not invent dashboard tabs or filter chips.
- The design system conflicts with itself on component spacing, some font weights, and amber coloring. Copied the reset and component patterns, then applied permitted spacing/type tokens. Uncertain requirements use neutral diamonds; critical mismatches use red; healthy matches use green.
- No profile photographs, biographies, reviews, or terms URLs exist in the supplied JSON. Kept the pricing feature focused on supplied content and used name initials rather than fabricating profile assets.
- The fixed dataset reference date anchors the demo clock and rolling KPI windows. Runtime writes use that clock. Changes intentionally reset on page refresh.
- The dataset has no proposal-history events or defined clarity levels for the brief's P2 analytics idea. No proposal acceptance statistic was fabricated; this future analytics need remains outside the defined profile/detail View Spec.
- The first browser pass exposed a green pricing match on a request marked Needs Clarification. Fixed it to prioritize the unresolved review warning, and show the flagged field names with the note.
- The step-4 log template was absent, so this log follows the existing step-3 structure.

## Validation and after-run review

**2026-09-16 repair update:** Repair pass: 11 automated tests pass. Browser checks confirmed all-event analytics (17/28 responses, 5-hour median, 7/28 needing clarification), Comedy Show filtering (3 profiles, 5 requests, 4/5 responses), proposal acceptance changing 2/6 → 3/7 and undo to 2/7, sample profile content, history remaining expanded after review, and keyboard tab focus. At 1024×768 Send Request ends at 650px. At 390×844 it remains visible through sticky positioning with no horizontal page overflow. A stale pre-refresh browser build initially lacked cross-tab undo; refreshing the current build verified the implemented behavior. A real trailing-space disclosure-key bug was found and fixed, then retested.

- **Read:** visually inspected the profile and request detail. Pricing, equipment, duration, and primary actions are visible without scrolling at 1280×720 and 1024×768. At 1024×768 the profile workspace content height equals its 713px viewport; Send Request ends at 594.5px. The primary request actions end at 545px in the 720px viewport. The 30-second read goal is supported by layout inspection, not a timed human usability study.
- **Write/clickflow:** opened a profile, opened the prefilled form, changed duration from 3 to 2 hours, observed the suggestion change from €400–€600 to €267–€400, sent the request, and saw the new Sent item. Mark Reviewed changed the item to Viewed/Reviewed, reset days in stage to zero, and changed the response rate from 2/5 to 3/5 (60%).
- **Clarification:** submitted a field-specific question; the request moved to In Discussion/Needs Clarification and the venue-facing detail showed the message. Undo restored the earlier state.
- **Validation:** a duplicate entertainer/venue/date was blocked with inline feedback. Unclear equipment warned but allowed sending. Accepted and Declined transitions worked; undo restored the active state.
- **Read controls:** compared two entertainers, navigated missing-pricing profiles, searched to zero results, and inspected the venue history drawer. Empty cohorts show a dash rather than a fabricated response rate.
- **Keyboard:** Escape closed the request dialog and returned focus to Send Request.
- **Responsive:** checked 390×844 with no horizontal page overflow (390px document width). Small screens use internal scrolling to preserve readable content; the full desktop no-scroll composition cannot fit a phone viewport.
- **Calculations:** dependency-free Node assertions passed for KPI denominators, zero cohorts, exact even median (1, 2, 9, 14 hours → 5.5), inclusive 90-day boundary, mismatch conditions, missing pricing, clarification precedence, lifecycle age reset, and HTML escaping.
- **Integrity:** JavaScript syntax passed; global reset matches the design system exactly; no inline styles/SVG/Canvas appeared in the DOM; JSON checksum is unchanged. Browser error/warning log was empty.

## Outcome

**2026-09-16 repair update:** Repair pass complete: Done Condition met (Read + Write), including the newly specified analytics view. No recorded workshop blocker remains. Runtime changes still reset on refresh by design. No commits or merges were made.

**Done Condition met (Read + Write).** The application is browser-ready for the workshop's in-memory user test. No commit, PR, or integration-branch changes were made.
