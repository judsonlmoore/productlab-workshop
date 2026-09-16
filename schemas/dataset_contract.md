# Workshop runtime dataset contract

Version 2.0. This contract complements the visible fields in the Feature Brief.
All fixture content is synthetic. The user authorized practical assumptions during the repair pass.

## Root structure

`{ metadata, items, entertainers, venues }`. The app fetches this once. Runtime writes
mutate `items` in memory; reload resets the demonstration. No persistence or backend is required.

## Request (`items`)

| Fields | Type and rule |
|---|---|
| request_id | Unique nonempty string; metadata.identifier_field names this key |
| venue_id, entertainer_id | Foreign keys to existing venue and entertainer records |
| venue_name, entertainer_name | Display strings matching the linked records |
| event_date | ISO date, YYYY-MM-DD |
| event_type, equipment_provided, status | Values in metadata.allowed_values |
| budget_min, budget_max | Finite nonnegative EUR amounts, minimum <= maximum |
| duration_hours | Positive finite number on every sent request |
| performance_details | Trimmed string of at least metadata.validation.performance_details_min_length (20) characters before send |
| load_in_time | Local setup time with timezone, or empty string when not specified |
| venue_size | Value in metadata.allowed_values.venue_size |
| created_at, last_activity, stage_entered_at | UTC ISO timestamps |
| sent_at, response_due | UTC ISO timestamps; null on unsent drafts |
| first_entertainer_action_at | First explicit response UTC timestamp; null until response |
| first_entertainer_action_status | Viewed for explicit review, In Discussion for first clarification; null until response |
| days_in_stage | Nonnegative integer derived from stage_entered_at and the demo clock; reset on transition |
| pricing_review_status | Pending, Reviewed, or Needs Clarification, from metadata |
| system_notes | Array of {created_at, text, fields: string[], message?: string} |
| events | Ordered array of {type, at, clarity_level?: string, fields?: string[]} |

Event kinds come from metadata.allowed_values.event_kind. A request starts with
created and adds sent when submitted. Explicit review, clarification, proposal,
acceptance, decline, and expiry append events. Merely opening a page does not.
The first response event populates the first-action timestamp once; later events
never overwrite it. Timestamp ties are allowed; array order resolves ties.

The first proposal_sent event freezes the current clarity_level. Later events and
field edits do not reclassify its analytics cohort. Pending proposals are included
in the acceptance-rate denominator; only an accepted event after that proposal
enters the numerator. Direct acceptance or decline is excluded. Undo restores the
entire request collection, including event history.

## Entertainer (`entertainers`)

| Fields | Type and rule |
|---|---|
| entertainer_id, entertainer_name | Unique ID and display name |
| event_types | Nonempty array of allowed event types |
| avatar | {kind: "initials", text: string}; deliberate photo-free workshop design |
| bio | Nonempty fictional biography |
| reviews | Array of {review_id, author, rating: number 1–5, date, text}; synthetic examples |
| booking_notes | Array of local explanatory strings; no external terms URL needed |
| pricing | Null for the empty-state fixture, otherwise the structure below |
| availability | Array of {event_date, status}; omitted dates are unknown, not available |

Pricing fields: currency, rate_basis (`per_hour`), base_rate_min/max,
typical_duration_hours, equipment_included (string array),
equipment_required_from_venue (equipment enum array), venue_requirements and
not_included (string arrays), setup_time_minutes, setup_included,
load_in_expectations, and example_scenarios.
Each scenario contains duration_hours, equipment_provided, budget_min/max, and description.

## Venue (`venues`)

venue_id, venue_name, venue_size, equipment_provided, and typical_event_types.
Names and enum values agree with linked requests. Booking venue is selection context,
not a hidden filter on product analytics.

## Metadata

- identifier_field and lifecycle declare record identity, status, age/timestamp fields, and active/terminal values.
- allowed_values declares enum catalogs; enums do not automatically become filters.
- filters.specifications declares field, label, type, allowed_values, default, and scope. An empty array is valid in products without filtering. Here Event type is shared; search is directory-only.
- thresholds declares stuck_days_in_stage, stuck_operator, response_due_days, and conditional warnings. Strictly greater than 14 days is stuck. First response due is five days after sending. Terminal records never trigger stuck/overdue alerts.
- equipment_capabilities maps venue equipment to supported requirement values. Full PA covers Basic Sound Only; Unclear maps to null (unknown).
- kpis declares exact definitions, cohort fields, aggregation fields, units, 90-day windows, and null for empty denominators. The Feature Brief repeats the same definition text.
- clarity defines current clarity and the frozen proposal snapshot. All allowed clarity groups render even with zero records.
- clock anchors the advancing session clock to as_of. Tests may freeze the clock. Do not use the real calendar to age the workshop data.
- profile_content explains the synthetic review provenance and intentional initials-avatar choice.
- ui holds product, feature, and tab labels.

## Reproducible checks

Run `node --test tests/workshop.test.cjs` from the repository root.
Check schema/relationships, source description validation, lifecycle chronology,
proposal cohorts, median/window boundaries, and runtime writes/undo. Serve the root
with `python3 -m http.server 8765 --bind 127.0.0.1` for browser checks.
