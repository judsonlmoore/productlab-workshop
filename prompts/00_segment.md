# Signal Segmentation Prompt

Run this prompt in your AI agent (Claude Code, Cursor, Antigravity, etc.)
to transform your raw signals into structured, scoreable input.

---

## What to do

Copy and paste the text below into your AI agent.

---

```
Read the file _initial_context-lmp/signals.csv.

For each row, classify the signal across five fields:

────────────────────────────────────────────────
FIELD 1: type
────────────────────────────────────────────────
Choose exactly one. Use the highest that applies.

  deal-loss  — The customer explicitly stated a commercial consequence:
               churn, downgrade, cancelled renewal, lost deal.
               The revenue impact is named, not implied.
               Example: "We're not renewing. The missing export feature
               is the reason we're switching."

  problem    — Critical blocker. The customer cannot complete their goal.
               No workaround exists, or the workaround is so painful
               it's effectively unusable.
               Example: "The dashboard just spins with 500+ records.
               I can't show anything to my client."
               Edge case: If the workaround requires a completely separate
               tool (e.g. switching to Slack, Excel, or a competitor),
               classify as `problem` — not `friction`. A workaround that
               lives outside the product is effectively no workaround.

  friction   — Workflow pain. The customer can work around it but
               shouldn't have to. Costs time or causes frustration.
               The workaround stays within the same product or tool.
               Example: "I export manually every Monday. Takes 3 hours."

  mention    — Unprompted feedback or feature request with no stated pain.
               The customer is suggesting, not complaining.
               Example: "Would love a CSV export button."

When in doubt, classify conservatively (go one level lower).
Only use deal-loss when the revenue consequence is explicitly stated.

────────────────────────────────────────────────
FIELD 2: severity
────────────────────────────────────────────────
Choose exactly one. Independent of type — a mention can be High.

  High    — Blocks a critical use case. No acceptable workaround.
  Medium  — Impacts workflow. Workaround exists but is painful or slow.
  Low     — Nice-to-have. No meaningful impact on the customer's work.

────────────────────────────────────────────────
FIELD 3: category
────────────────────────────────────────────────
Choose exactly one.

  feature   — A product capability that doesn't exist yet.
  workflow  — An existing workflow, interaction, or process that needs improvement.

────────────────────────────────────────────────
FIELD 4: bet
────────────────────────────────────────────────
Name the roadmap initiative this signal is evidence for.
Use a short, clear label (2–4 words). Examples: "CSV Export", "Dashboard Performance", "Mobile Experience".

Signals pointing to the same underlying product problem get the same bet label.
This is not a category — it is a strategic decision about what to build.
When uncertain, ask: "If we fixed this, which single product initiative would address it?"

────────────────────────────────────────────────
FIELD 5: quote_snippet
────────────────────────────────────────────────
Extract the single most diagnostic sentence from the raw signal.
This must be a verbatim quote — do not paraphrase or summarize.
Max 1 sentence. Max 120 characters. It should capture the core pain or consequence in the customer's own words.
If the most diagnostic sentence exceeds 120 characters, trim it at the last complete word before the limit and append "…".
Example: "We're not renewing because the export just doesn't work."

────────────────────────────────────────────────
OUTPUT
────────────────────────────────────────────────
Save the result as _context/signals_segmented.json

Format: a JSON array, one object per signal.

```json
[
  {
    "raw_signal": "We've been doing the export manually every Monday...",
    "quote_snippet": "We've been doing the export manually every Monday.",
    "customer_size": "XL",
    "type": "deal-loss",
    "severity": "High",
    "category": "feature",
    "bet": "CSV Export"
  },
  {
    "raw_signal": "The dashboard just spins with 500+ records...",
    "quote_snippet": "The dashboard just spins with 500+ records.",
    "customer_size": "XL",
    "type": "problem",
    "severity": "High",
    "category": "workflow",
    "bet": "Performance"
  }
]
```

Rules:
- Do NOT change the raw_signal text. Copy it exactly.
- quote_snippet must be a verbatim sentence from the raw_signal — no rewording.
- Do NOT change the customer_size value. Copy it exactly from the CSV.
  Note: customer_size is a revenue-impact proxy. For B2B it reflects company size (XL=Enterprise).
  For B2C it reflects subscriber tier (XL=premium subscriber, L=paid, M=registered, S=casual, XS=anonymous).
  The value in the CSV was set by the participant. Do not re-interpret it.
- All values for type, severity, category must use the exact strings defined above.
- Every object must have a non-empty bet value.

After saving, confirm how many signals were processed and list the unique bet labels you identified.
```
