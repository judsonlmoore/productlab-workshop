# Simulation issues

## Current status — repair pass, 2026-09-16

**All recorded issues are resolved for the workshop. No open blockers.**
The user authorized practical assumptions and synchronized source/data/app repairs.
Historical observations are retained below; their earlier workarounds are superseded by this table.

| ID | Original issue | Resolution | Verification |
|---|---|---|---|
| W01 | Incomplete Data Contract | Added `schemas/dataset_contract.md`; aligned model, brief, dataset v2, identifiers, linked profiles, timestamps, notes, and event history. | Automated schema, references, chronology, and profile checks. |
| W02 | Ambiguous KPI semantics | Defined explicit responses, inclusive sent-date cohort, empty denominators, and frozen proposal clarity. Renamed the misleading average label to Median response time. | Exact brief/metadata strings; median and 90-day boundary tests. |
| W03 | Short sample descriptions | Expanded the four descriptions in both the source model and JSON. | Every source sample and request passes the minimum-length rule. |
| W04 | Missing filters/thresholds | Canonical 14-day stuck threshold, 5-day unanswered response deadline, explicit shared Event type filter and directory search specification. | Strict-boundary and filter tests; browser filter changes all views. |
| W05 | Missing log templates | Added TEMPLATE.md and a logger fallback for absent step files. Matched AGENTS.md to the actual lowercase skill.md path for case-sensitive filesystems. | Paths exist; logger no longer assumes missing templates. |
| W06 | Candidate-specific build prompt | Generic metadata.identifier_field and lifecycle/threshold paths replace candidate-specific identifiers and stuck_candidates. | Source scan; request transition tests. |
| W07 | Design-rule conflicts | Added an amber signal token, reconciled typography/spacing/icon exceptions, aligned the header height, removed the conflicting padding ratio, and updated the brief. | Token/reference review and browser visuals. |
| W08 | Missing proposal analytics | Seeded ordered events; added Send Proposal, frozen clarity, and Pricing insights with numerator/denominator counts. | Direct outcomes excluded; pending included; first proposal cohort and undo tests; live 2/6 → 3/7 → undo to 2/7. |
| W09 | Green match during clarification | Review status takes priority; flagged fields and questions remain visible. | Automated and browser checks. |
| W10 | Missing profile content | Added fictional bios, reviews, and booking notes for all 25 profiles; specified initials avatars as the deliberate photo-free workshop design. | Schema checks and expanded profile viewed in browser. |
| W11 | Impossible universal no-scroll rule | Separate desktop/phone criteria; primary action fits desktop and sticks within the phone pricing card while text scrolls. | 1024×768 action bottom 650px; 390px document width with no horizontal overflow and visible booking action. |
| W12 | Profile empty-state metadata | Retained and tested the explicit warning and enabled-send behavior. | Existing null-pricing fixture and render path preserved. |
| W13 | Full PA falsely mismatched basic sound | Added metadata equipment capabilities and subset matching. Unknown remains distinct from mismatch. | Full PA → Basic Sound passes; Nothing Provided fails; Unclear warns. |
| W14 | Disclosures collapsed after writes | Preserve expanded disclosures and scroll; normalize changing summary suffixes and whitespace. Undo remains reachable across tabs and restores filters. | Browser history remains expanded after review; cross-view undo restores proposal. |
| W15 | Keyboard tab focus edge case | Arrow navigation uses the focused tab, with Home/End support and selected-tab focus. | Browser ArrowLeft returns to Booking workspace. |

Validation command: `node --test tests/workshop.test.cjs` — **11 passed, 0 failed**.
JavaScript syntax and whitespace checks passed. Browser verification is documented in the step logs.

## Historical observations (before the repair pass)


- **Low — Profile empty-state rule omitted from metadata (Step 3 repeat review, resolved).** Root cause: the initial dataset included a null pricing profile and request-detail warning rules but did not explicitly encode the profile warning and enabled-send behavior. Added `metadata.thresholds.missing_profile_pricing`, matching the View Spec message.

## Step 3 — Dataset (2026-09-16)

- **High — Data Contract does not cover the pricing UI or KPI inputs.** Root cause: the Request contract contains venue budgets but omits entertainer pricing, equipment requirements, first-response timestamps, and review state. Added linked synthetic profiles, response timestamps, and review fields with documented assumptions. Align the approved contract with these fields before implementing production persistence.
- **Medium — KPI aggregation semantics are incomplete.** Root cause: the brief does not settle whether viewing counts as responding or which timestamp defines the 90-day cohort. Fixture metadata treats the first Viewed/In Discussion action as a response and uses sent_at for the cohort. Definition text is preserved verbatim; “Average response time” remains a median.
- **Medium — Source descriptions conflict with send validation.** Root cause: REQ-010, REQ-015, REQ-018, and REQ-024 have descriptions shorter than the brief's 20-character minimum. Preserved source rows as legacy records and documented that new sends must satisfy validation.
- **Low — Filter and stuck-threshold requirements exceed the brief.** Root cause: the generic dataset prompt requests filters and stage-age edge cases, while this detail-view brief specifies no filters or numeric stuck threshold. Recorded no configured filters and a null canonical stuck threshold; isolated a synthetic 14-day fixture rule.
- **Low — Simulation log templates are missing.** Root cause: `_simulation_log/` contained only README.md although the logger requires existing templates. Created the step log and issue ledger without overwriting any existing template.

## Step 4 — App Build (2026-09-16)

- **Medium — Generic build instructions reference a different schema.** Root cause: the prompt hardcodes `metadata.stuck_candidates.threshold` and candidate-oriented identifier fallbacks. This app uses `request_id` and the supplied request threshold metadata without changing JSON.
- **Medium — Contradictory design rules.** Root cause: the brief requests amber/blue status treatments while the design system forbids colors outside its tokens; copied component examples also conflict with typography/spacing rules. Resolved using permitted neutral, green, and red signals and component refinements.
- **Medium — P2 proposal analytics lack an event model.** Root cause: current status alone cannot distinguish a declined proposal from a declined initial request, and clarity levels are undefined. Do not infer proposal acceptance rates from these snapshots. The implemented View Spec KPIs remain response rate and median response time.
- **Low — Unresolved clarification initially retained a green match (resolved).** Root cause: the first match calculation considered price/equipment but not review status. The final calculation prioritizes Needs Clarification and exposes the fields under review.
- **Low — Profile assets are unavailable.** Root cause: the immutable dataset lacks photos, bios, reviews, and terms links referenced as existing profile content. The app renders supplied names/types and complete pricing details without inventing that content.
- **Low — Universal no-scroll requirement is impractical on phones.** Root cause: desktop shell and profile information exceed a narrow phone viewport. Desktop primary content fits; mobile reflows with contained scrolling and no horizontal page overflow.
