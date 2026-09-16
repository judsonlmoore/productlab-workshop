# From Prompt to Product — Workshop Preparation

Prepare these four files before the workshop.

Open the `_initial_context/` folder. Fill in each file with real material from your work.

| File | What to put in | Time |
|---|---|---|
| `signals.csv` | 20–50 things customers actually said, word for word | 30–60 min |
| `business_outcome.md` | The business metric you want to move | 5 min |
| `product_outcome.md` | The user behavior that drives that metric | 5 min |
| `data_model.md` | Your product's main entities and fields | 10–15 min |

Each file has instructions inside. Read them first, then fill in your real data.

Bring your laptop with these files on the day of the workshop.

---

Questions? Reply to the workshop email.

---

## Full instructions

### 1. Customer signals — `signals.csv`

A signal is something a customer actually said. Word for word.

Not: "Customers want better export."
But: "We've been doing this manually every Monday for three months. It takes Sarah two hours."

Open the file. You will see the format. Add at least 10 rows — 20 or more give better results. Use real things real people said — from support tickets, sales calls, Slack messages, interviews, anything.

If you have more than 10, bring all of them. More signals give better results.

**Why we need this:** In the morning session, we run a scoring tool on your signals. It labels each signal with a product bet, a specific problem worth solving, then scores and ranks those bets by revenue impact and volume. The output tells you what to build in the afternoon. The business and product outcome files keep that scope honest. The data model is the foundation your afternoon app runs on. Real data produces better results.

---

### 2. Your business goal — `business_outcome.md`

Open the file. Answer three questions:
- What business number do you want to move? (churn, revenue, activation rate, anything concrete)
- What is the number today, and where do you want it to be?
- Why does this matter right now?

One sentence each. Short is better.

**Why we need this:** The tool uses your goal to check whether the highest-scoring signal actually moves the right number.

---

### 3. What you want users to do differently — `product_outcome.md`

Open the file. Answer three questions:
- What do you want users to do that they are not doing today?
- How does that behavior connect to your business goal?
- What is stopping them from doing it now?

One sentence each.

**Why we need this:** It keeps the scope honest. Features that don't change behavior don't move metrics.

---

### 4. Your product's data — `data_model.md`

Open the file. You will see a table. Fill in the rows.

What is the main "thing" your product tracks? A deal, a ticket, a customer, a report?

List **all** fields that describe it — everything your product actually tracks for this entity. Don't filter yet. For each field: name, type (text, number, date, or a fixed list of options), and a short description.

Typical B2B entities have 10–20 meaningful fields. If you have fewer than 8, you've probably left something out. The AI will decide which fields matter for the view it builds — your job is to give it everything.

Add min 20, up to 100 real rows at the bottom. Use real values, not "example" or "test". Include edge cases: items that are stuck, overdue, escalated, or closed. These are the rows that produce a useful app.

**Why we need this:** In the afternoon, you build your own app. This is the data it runs on. The more complete your data model, the more your app will actually look and work like a real product.

---

### What to bring on the day

- Laptop
- Claude or Cursor (active subscription, logged in)
- Python 3 (pre-installed on Mac — check: `python3 --version` in Terminal)
- The four files filled in with real data

---

### If you are stuck

Reply to the workshop email. I will help you figure it out.

The signals file is the hardest one. If you only have time for one, start there.

---

## Workshop Testing

This workshop flow has been tested with Claude Code and the gstack `/ship` workflow.


## Gigiii workshop demo

The repaired Pricing Clarity app is in `src/`. From the repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open [the local app](http://127.0.0.1:8765/src/index.html). Use **Booking workspace**
for profiles and request actions, and **Pricing insights** for the event-based metrics.
The Event type filter is shared. Writes and undo are in memory; refresh resets the demo.

Run the dependency-free regression checks with Node.js 18 or later:

```sh
node --test tests/workshop.test.cjs
```

See [the data contract](schemas/dataset_contract.md) for workshop assumptions and
[the issue ledger](_simulation_log/issues.md) for the dry-run lessons and resolutions.
