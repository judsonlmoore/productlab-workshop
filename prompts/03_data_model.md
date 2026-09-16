# Prompt 03 — Generate the Workshop Dataset

Use this prompt to turn your product's data model into a JSON file the app can read.

---

## What this does

The AI reads your Feature Brief and your data model, then generates a realistic JSON dataset for the feature you're building. This dataset is the single source of truth the app loads at runtime.

---

## Before you run this

| File | What it contains |
|---|---|
| `_initial_context-gigiii/data_model.md` | Entity definitions, field types, sample rows |
| `_context/feature_brief.md` | Reviewed and approved Feature Brief |

---

## The prompt

```
Read these two files:
- _initial_context-gigiii/data_model.md
- _context/feature_brief.md

Generate a JSON dataset for the primary entity described in the Feature Brief.

The dataset must:
1. Include ALL required fields listed in the Feature Brief's Data Contract.
2. Include a metadata block at the top with:
   - KPI definitions (matching the KPI definitions in the View Spec exactly)
   - Filter specifications (all filterable fields and their allowed values)
   - Thresholds (any alert or conditional thresholds referenced in the View Spec)
3. Include at least 25 items (rows/records).
4. Cover all meaningful states and stages — including edge cases:
   - Items in every stage/status defined in the data model
   - Stuck or blocked items (days_in_stage beyond threshold)
   - Terminal states (e.g. Hired, Rejected, Closed)
5. Use realistic names, dates, and values — not "Test User 1" or placeholder strings.
6. Use the sample rows from data_model.md as a starting point and expand them. Correct sample values that violate the feature's validation rules; record the corrections rather than preserving known-invalid values.
7. Read schemas/dataset_contract.md when present. Include linked profiles and an event history when views or KPIs need data beyond the primary entity.
8. Put identifier_field, lifecycle fields, explicit filter specifications (an empty list is valid), and named thresholds in metadata. Never infer that every enum is a filter.
9. Resolve missing workshop parameters with simple documented assumptions and align the brief, model, and metadata. Include a response definition, cohort timestamp, inclusive window boundaries, median/mean choice, and zero-denominator behavior for every KPI.
10. Distinguish request statuses from actual proposal/response events. Do not derive event-based conversion rates from current status alone. Provide realistic synthetic supporting content, or specify an intentional supported fallback such as initials avatars.

Save the result as: data/[entity-name-lowercase].json

Confirm the file path, item count, and stage distribution when done.
```

---

## After you run this

Open the file. Check:

1. **Fields** — Do these match your real product? Remove any that aren't needed for this feature.
2. **Structure** — Does the JSON structure properly support the View Pattern chosen in the Feature Brief?
3. **View Spec coverage** — Does the metadata block contain all KPI definitions, aggregation fields, thresholds, and filter specs from the Feature Brief's View Spec and Data Contract?
4. **Rows** — Are there enough edge cases? Add rows for states your feature needs to handle.
