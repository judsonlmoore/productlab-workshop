# Prompt 02 — Generate the Feature Brief

Use this prompt to turn your context into a concrete build target.

---

## What this does

The AI reads your three context files and your ranked bets.
It generates a Feature Brief: one focused document that defines what you build today, why, and how you know when you're done.

You review it. You correct it. Then you build from it.

---

## Before you run this

Make sure these files exist and are filled in:

| File | What it contains |
|---|---|
| `_initial_context-gigiii/business_outcome.md` | What the business needs to achieve |
| `_initial_context-gigiii/product_outcome.md` | What user behavior needs to change |
| `_initial_context-gigiii/data_model.md` | Your product's entities and fields |
| `_context/bets.json` | Ranked bets from `score.py` |
| `_context/signals_segmented.json` | Segmented signals from Prompt 00 |

If `_context/bets.json` is missing, run `python3 bet_ranker/score.py` first.

---

## The prompt

```
Read the following files:
- _initial_context-gigiii/business_outcome.md
- _initial_context-gigiii/product_outcome.md
- _initial_context-gigiii/data_model.md
- _context/bets.json
- _context/signals_segmented.json

You are a product trio — PM, Designer, Engineer — at a company that builds software people love to use.

How you work:
- The PM thinks in outcomes and evidence. Every decision traces back to a signal from a real user. You never build something because it seems like a good idea — you build it because you heard the pain.
- The Designer thinks in information architecture and user journeys. You ask: what does this person need to see, do, and understand — in what order? You design for the complete lifecycle, not just the happy path.
- The Engineer thinks in feasibility and craft. You ask: what is the smallest thing we can ship that solves the real problem, and how do we make it feel like a finished product?

All three of you have taste. You have seen what great software looks like. You would rather ship one thing that feels complete than three things that feel half-done. You know that a single screen with no depth is not a product — it is a report. Products have journeys, transitions, and moments of delight.

Generate a Feature Brief for the top-ranked bet (rank 1).
Use exactly this format:

---

# Feature Brief: [Bet title from bets.json]

## Business Outcome
[Copy the exact sentence from the "Your answer" field under "## The goal" in business_outcome.md. Do not rephrase. Do not summarize.]

## Product Outcome
[Copy the exact sentence from the "Your answer" field under "## The behavior change" in product_outcome.md. Do not rephrase. Do not summarize.]

## The Best Bet
Bet: [title from bets.json]
Problem headline: [Read all signals attached to this bet. Synthesize them into one sentence that describes the core problem from the user's perspective. This is not the bet title — it is a headline that captures the pain. Example: "Recruiting leaders spend hours in Excel answering pipeline questions that should take seconds."]

Signals (verbatim):
[List every signal attached to this bet. Copy each signal text word for word. Include the customer name and size. Do not summarize, do not group, do not rewrite. One signal per line, prefixed with "—".]

## Problem/Opportunity
[Be as crisp and clear as possible on what user or business problem(s) you are solving, and why this is a valuable opportunity for the team to pursue.
Important: "Users cannot use [my proposed solution]" is not a problem statement. Problems are rarely a lack of a specific feature. Look deeper: what issues are caused when the capability is missing? What workarounds do users resort to? What decisions get delayed or made badly? What downstream business consequences result?
Write 3–5 sentences. Ground every claim in a signal from the bet.]

## Target User
[Identify the primary user persona and their mindset. Synthesize this directly from the roles and pain points expressed in the signals. Who are they? What is their job-to-be-done in this moment? What question are they trying to answer? What decision are they trying to make? What pressure are they under?]

## What I'm Building
[Write a clear, concrete elevator pitch in 3–5 sentences. Describe the product experience, not just a screen. Map the solution to the specific signals. Explain what the feature does, how it solves the problem, and why it is built this way.
Then list the top 3 value propositions as bullet points:
- Value prop 1: [one sentence connecting a capability to a user outcome]
- Value prop 2: [one sentence]
- Value prop 3: [one sentence]]

## What I'm NOT Building
[3–5 bullet points. Be specific about what is out of scope and why. For each exclusion, briefly state the reason — this prevents scope creep during the build and makes the boundary testable.
Think about the full lifecycle: what adjacent capabilities might someone assume are included? Call them out.]

## MVP/Functional Requirements

Think through the complete user journey, not just the primary view. Consider: How does the user arrive? What do they see first? What do they do? What happens when they drill in? How do they come back? What changes over time?

Bucket requirements by user journey or use case. Assign priorities:
- **[P0]** = Required for MVP adoption. Without this, the feature does not solve the problem.
- **[P1]** = High-value addition for a minimally delightful product. Not blocking launch, but makes it feel finished.
- **[P2]** = Nice-to-have. Can be added after launch based on feedback.

### Journey 1: [Name the primary user journey]
- [P0] [Requirement as a functional statement: "User can..." or "System shows..."]
- [P0] [Requirement]
- [P1] [Requirement]
- ...

### Journey 2: [Name a secondary journey, if applicable]
- [P0] [Requirement]
- [P1] [Requirement]
- ...

Rules for requirements:
- Focus on functionality, not design or technical implementation.
- Include telemetry: "Product team can monitor [metric]."
- Consider the full object/user lifecycle: first-time experience, returning use, edge cases (empty states, large datasets, permission boundaries).
- Do not use more than 2 journeys for the MVP. If it needs 3+, the scope is too large.
- Do not include performance metrics unless you have evidence users require them for adoption.

## Done Condition
Read test: [User can answer [specific decision/question] in under [time] without [friction/workaround].]
Write test: [User can [action that mutates data: e.g. move stage, resolve blocker, assign priority] and immediately see [consequence in UI: KPIs update, counts shift, item status updates].]
Important: Both read and write moments must be testable today without a backend.

## Job to Be Done
Functional: When I [trigger situation — use the customer's own words from the signals for this bet], I want to [action], so I can [expected outcome].
Emotional: I want to feel [target emotion from signals] instead of [current emotion from signals].

## Journey Context
Before: [What situation triggers the user to need this feature — derived from the raw signals for this bet. Quote or closely paraphrase the customer's description of their current situation.]
This feature: [One sentence — what moment does this feature serve?]
After: [What the user does next — derived from product_outcome.md. If the user's task ends here and they leave the product, say so. "Nothing further in this product" is a valid answer.]

## Data Contract
Entity: [The primary entity from data_model.md this feature targets]
Source: _initial_context-gigiii/data_model.md
Required fields: [All fields the user needs to see in this view to make a decision without leaving the screen or asking someone else. Include status, temporal, and contextual fields — not just identifiers. Minimum 6 fields.]
Default State & Filters: [What data is loaded initially? Explicitly define the default filters and sorting. Do not load 'everything' by default if cognitive load is an issue.]

## View Spec

This section is the complete specification for the engineer building the UI.
You are designing a view, not listing features. Think like a product designer.

**Ordering axis:**
Before defining the layout, identify the primary ordering axis of your entity. The axis determines the dominant visual structure — not a template.

| If the entity has… | The natural axis is… | Layout consequence |
|---|---|---|
| Stages or status flow (e.g. pipeline, workflow) | Stage progression | Group or split by stage — columns, grouped rows, or swim lanes |
| Time windows or deadlines (e.g. SLA, due date) | Time-to-target | Rows or cards with progress indicators showing elapsed vs. remaining |
| Categorical grouping (e.g. department, client, region) | Category | Grouped table with collapsible sections, or card grid per group |
| Geographic data (e.g. site, location, territory) | Location | Map or location-indexed list |

Choose the axis that best serves the user's primary decision from the signals. State it explicitly.

**Layout:**
[Describe the spatial arrangement. The layout MUST use the ordering axis chosen above as its dominant structure.
The goal is to fit all critical information within one viewport (no scrolling for primary content).
Do not default to a KPI strip + list dashboard. Let the entity's axis shape the view.]

**Priority 1 — The signal** (the data condition the user must notice within 3 seconds):
[What is the one thing that changes a decision? The alert, the outlier, the threshold breach. Describe the exact data condition and what makes it urgent. Do not prescribe where it sits — let the ordering axis determine placement.]

**Priority 2 — The context** (what the user works with to understand the signal):
[What content gives meaning to the signal? The breakdown, the distribution, the grouped list. Describe exactly what fields are visible, how they relate to the ordering axis, and what grouping or sorting applies.]

**Priority 3 — Supporting data** (reference information the user sometimes needs):
[What additional data helps the user act but is not needed on every visit? Describe the data, not its position.]

**KPI definitions** (required if Priority levels contain aggregate values):
[For each displayed metric: what it counts or averages, which records are included/excluded, and what the calculation is. Ambiguous definitions produce wrong numbers.]

Empty State: [What does the user see when there is no data? How do they recover?]

## Interactions

### Clickflow
Describe the complete user journey as a numbered sequence. The journey MUST include at least one READ moment (user retrieves/scans information) and at least one WRITE moment (user changes/mutates data).

1. User opens [view] → sees [initial state with data loaded]
2. User [reads/scans] → notices [signal, alert, outlier, or pattern]
3. User [navigates/clicks] → [system shows detail, panel, or context]
4. User [decides and acts] → [data mutation: what field changes, what UI element triggers it]
5. User sees [immediate feedback: which panels re-render, what number/status changes]

### Write Interactions
Primary write: [The one data mutation the user performs in this view.
Specify: which entity field changes, allowed values/states, and what UI element triggers it (e.g. dropdown in detail panel, button, inline edit).]
System response: [Exactly which panels re-render and which KPI values or lists update immediately.]
Validation & Constraints: [Allowed transitions, required fields, confirmation or guardrails.]

### Read Interactions
Primary read: [The most common filter, sort, or switch action.]
System response: [Which panels update.]
Secondary read: [The drill-down or detail inspection action.]
System response: [Drawer, modal, or detail panel displayed.]

## Secondary View *(optional — omit entirely if not needed)*
What it adds: [One sentence. Why does a secondary view add value that the primary view cannot deliver?]
Trigger: [What user action opens the Secondary View — e.g., "Click on a table row", "Select a card"]
View Spec: [Use the same Priority 1/2/3 format as the primary View Spec above.]
Build phase: Prompt 04

## Supporting Views *(optional — only if signals support them)*

Examine your signals for the top bet. If they contain evidence for **more than one distinct question** about the same entity, define up to 2 Supporting Views.

Each Supporting View must:
- Answer a **different question** than the Primary View
- Be supported by **at least 2 signals** from the ranked bet
- Share the **same entity and Data Contract** as the Primary View
- Be accessible via a secondary navigation element (tab, view toggle, or segmented control) within the same feature workspace
- Have its own **View Spec** (Priority 1/2/3 format) and its own **Interactions** section

If all signals point to the same question, **do not add Supporting Views.**

For each Supporting View:

### Supporting View [N]: [Name]
**Question it answers:** [One sentence — what distinct question does the user ask that the Primary View cannot answer?]
**Signal evidence:** [List 2+ signals that support this view]
**Tab label:** [Short label for the tab, 1-2 words]
**View Spec:**
- Priority 1: [Primary data for this view]
- Priority 2: [Context]
- Priority 3: [Supporting data]
**Interactions:**
- Read: [How the user explores this view]
- Write: [Write action if applicable — can reuse the Primary View's write if the entity is the same]

All Supporting Views inherit the Data Contract, Done Condition, and JTBD from the Primary View. Do not redefine them.

---

Rules:
- Use only information from the files above. Do not invent signals or outcomes.
- Copy Business Outcome and Product Outcome verbatim from the source files. Do not rephrase.
- List all signals word for word. Do not summarize.
- The Problem/Opportunity section must reference specific signals, not abstract claims.
- MVP requirements must cover the full user journey, not just the primary screen.
- The View Spec Layout field is mandatory. Describe a real 2D arrangement.
- KPI definitions are mandatory if any metric appears in the View Spec.
- If bets.json is empty or missing, stop and tell me.
- If a Secondary View is defined, the Done Condition must be achievable with the Primary View alone. The Secondary View is never part of the Done Condition.
- Never define more than one Secondary View.
- Supporting Views are optional. Only add them when at least 2 signals support a distinct question about the same entity. Maximum 2 Supporting Views.
- Supporting Views must share the same entity and Data Contract. Do not introduce new entities.
- Supporting Views are navigated via a secondary navigation element. Each view must have a short label (1-2 words).
- For the Job to Be Done, read the raw signals for the top bet from signals_segmented.json. Use the customer's own words for the trigger situation and emotional state. Quote or closely paraphrase. Do not generalize.
- If the emotional JTBD uses words like "empowered", "streamlined", or "efficient" that do not appear in any signal, rewrite it using the customer's actual language.
- Derive Journey Context "Before" from the raw signals (what situation triggers the need). Derive "After" from product_outcome.md (what behavior the product enables next).
- The Interactions section must include a complete 5-step Clickflow with both a Read moment and a Write moment.
- The Write interaction must specify an in-memory data mutation (e.g. status change, blocker resolution) with clear UI trigger and immediate feedback.
- Done Condition must define both a Read test and a Write test.
- If no signals exist for the top bet in signals_segmented.json, leave Job to Be Done and Journey Context blank and flag: "No signals available — fill in manually."
- Save the result as _context/feature_brief.md
```

---

## After you run this

Read the brief carefully. Ask yourself:

1. **Business Outcome** — Is this verbatim from the source file?
2. **Product Outcome** — Is this verbatim from the source file?
3. **Problem headline** — Does this capture the actual pain, not just the feature gap?
4. **Signals** — Are all signals listed word for word?
5. **Problem/Opportunity** — Is every claim grounded in a signal?
6. **MVP Requirements** — Do they cover the full journey, not just one screen? Are P0s truly required for adoption?
7. **View Spec — Layout** — Does the 2D layout described actually fit in one viewport?
8. **Done Condition & Clickflow** — Does it have both a Read test and a Write test? Does the 5-step clickflow clearly demonstrate the Read-Decide-Act loop?
9. **Job to Be Done** — Does this sound like something a real user would say? Is the emotional state from the signals, not from a marketing textbook?
10. **Journey Context** — Does "Before" match what the signals describe? Does "After" make sense for this product?
11. **Supporting Views** — If defined: does each view answer a distinct question? Are there at least 2 signals supporting it? Does it share the same entity and Data Contract?

Correct anything that's wrong.

The brief is your contract with yourself. Build exactly this. Nothing more.

