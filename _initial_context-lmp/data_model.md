# Your Data Model

Fill in this file **before you come to the workshop**.

Describe the data model of the product you are working on.
No perfect schema needed — just what you know. The AI fills in the gaps.

---

## Entity

What is the central object in your product?
*(Examples: Deal, Account, Order, Project, Ticket, User, Report)*

**Entity:** Account

---

## Fields

What fields does this entity have?

List **all** fields your product actually tracks for this entity. Don't filter — the AI will select what's relevant for the view it builds.

For each field, ask: "Does a user ever need to see this to make a decision about this item?" If yes, include it.

A typical B2B entity has 10–20 meaningful fields. Fewer than 8 usually means you've left out something important.

| Field | Type | Possible values | Description |
|---|---|---|---|
| [field_name] | string / number / date / enum | — | [What this field means] |
| [field_name] | enum | value1, value2, value3 | [What this field means] |
| [field_name] | date | — | [What this field means] |

**Type options:**
- `string` — free text (name, ID, description)
- `number` — numeric value (amount, score, count)
- `date` — date (ISO 8601: 2026-08-16)
- `enum` — fixed set of values (status, category, priority)

---

## Sample Rows

Min 20, up to 100 real or representative entries.
Real values expose gaps in your model. Placeholders don't.
Anonymize if needed.

Include rows that show your real edge cases: items that are stuck, overdue, blocked, escalated, or in terminal states (closed, rejected, cancelled). These are the rows that make your app useful — not the clean success cases.

| [field_1] | [field_2] | [field_3] | [field_4] |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

---

## Notes

Anything important to know about this model?
Any fields you're unsure about?
Any dependencies on other entities?

[Optional — free text]
