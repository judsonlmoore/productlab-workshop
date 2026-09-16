# Step 3 — Dataset

Date: 2026-09-16

## Inputs and output

**2026-09-16 repair update:** Repair pass: dataset is now schema version 2.0, still 32 requests and 25 linked profiles/venues. The user authorized updating JSON and its source contract together.

- Read `_initial_context-gigiii/data_model.md` and `_context/feature_brief.md`.
- Generated `data/requests.json`: 32 requests, 25 entertainer profiles, and 25 venue profiles.
- Preserved every supplied field in the original 25 sample rows and added seven requests.
- Status distribution: Draft 3; Sent 8; Viewed 4; In Discussion 4; Proposal Sent 3; Accepted 4; Declined 3; Expired 3.

## What worked

**2026-09-16 repair update:** Repair pass: added complete profile content, ordered request events, capability matching metadata, canonical thresholds, explicit filter scopes, and four precise KPI definitions. Corrected four short descriptions in the original model and dataset.

- All ten required Data Contract fields are present with their specified types on every request.
- Root `metadata` and `items` follow the runtime format in `data/README.md`. Linked profiles support both profile pricing cards and request details without confusing venue budgets with entertainer prices.
- KPI definition strings match the View Spec exactly, including the median behind the label “Average response time.” Aggregation fields, date window, grouping, units, and empty-denominator behavior are explicit.
- Metadata includes enum catalogs, form defaults, conditional warning rules, and send validation. No filter UI is specified in the brief, so the filter specification is explicitly empty.
- Coverage includes all statuses, event types, and equipment states; overdue and long-in-stage requests; missing profile pricing; unclear equipment; budget and equipment mismatches; clarification notes; and a historical request outside the KPI window.

## What broke or required interpretation

**2026-09-16 repair update:** Repair pass: earlier contract, KPI, source-validation, threshold, profile-content, and template gaps are resolved as W01–W05/W10/W12 in issues.md. Workshop assumptions are now part of the contract rather than temporary workarounds.

- The source model lacks entertainer pricing profiles and first-action timestamps needed by the View Spec. Synthetic supporting data and explicit assumptions bridge this gap.
- No numeric stuck threshold exists in the brief. The canonical threshold is null; a separately labeled fixture threshold of more than 14 days supports the prompt's stuck-record requirement.
- Four original descriptions are shorter than the new-send minimum of 20 characters. They remain intact as legacy fixtures; the metadata records this distinction.
- The logger's referenced step and issue templates were absent. Created these logs using a minimal structure because no existing template could be preserved.

## Validation and after-run review

**2026-09-16 repair update:** Repair pass: `node --test tests/workshop.test.cjs` passes schema/foreign-key/chronology checks, all source-description checks, exact brief/metadata KPI strings, capability matching, and proposal cohort semantics. Old checksum and exact-source-preservation statements below describe the earlier run only.

Repeat run (2026-09-16): reread both source files and revalidated all 32 existing requests. Added the missing explicit profile-pricing empty-state condition, exact warning copy, and enabled-send behavior to metadata. No records or stage counts changed. The validation script initially used a UTC parsing form unsupported by the installed Python; normalizing Z to +00:00 resolved the validator error, and all checks passed.

Passed JSON parsing, record count, required types, all enum coverage, unique IDs and booking keys, profile references, budget bounds, timestamp chronology, computed stage age, exact source-row preservation, exact KPI text, and edge-case assertions. Read the generated JSON programmatically during validation.

The structure supports the chosen informational hierarchy and both primary detail views. Required fields were retained; supporting fields serve pricing, timeline, clarification, or KPI behavior. No runtime app exists in this step, so visual rendering and write interactions remain for Prompt 04.

## Outcome

**2026-09-16 repair update:** Repair pass complete: all dataset issues are resolved under the documented synthetic workshop rules. The updated contract is `schemas/dataset_contract.md`.

Dataset is ready for Prompt 04 with documented synthetic assumptions and source gaps. User-modified prompts were left intact. No commit or branch operation was performed; the checkout is on main and no staging ref is available locally.
