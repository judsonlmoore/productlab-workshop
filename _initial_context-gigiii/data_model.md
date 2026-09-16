# Your Data Model

Fill in this file **before you come to the workshop**.

Describe the data model of the product you are working on.
No perfect schema needed — just what you know. The AI fills in the gaps.

---

## Entity

What is the central object in your product?
*(Examples: Deal, Account, Order, Project, Ticket, User, Report)*

**Entity:** Request

---

## Fields

What fields does this entity have?

List **all** fields your product actually tracks for this entity. Don't filter — the AI will select what's relevant for the view it builds.

For each field, ask: "Does a user ever need to see this to make a decision about this item?" If yes, include it.

A typical B2B entity has 10–20 meaningful fields. Fewer than 8 usually means you've left out something important.

| Field | Type | Possible values | Description |
|---|---|---|---|
| request_id | string | — | Unique identifier for the request |
| venue_name | string | — | Name of the venue sending the request |
| entertainer_name | string | — | Name of the entertainer receiving the request |
| event_date | date | — | Requested performance date |
| event_type | enum | Live Music, DJ Set, Comedy Show, Dance Performance, Theater, Variety Show | Type of entertainment needed |
| status | enum | Draft, Sent, Viewed, In Discussion, Proposal Sent, Accepted, Declined, Expired | Current state of the request |
| budget_min | number | — | Minimum budget (EUR) |
| budget_max | number | — | Maximum budget (EUR) |
| duration_hours | number | — | Expected performance duration in hours |
| equipment_provided | enum | Full PA System, Basic Sound Only, Lighting Included, Nothing Provided, Unclear | What venue provides |
| load_in_time | string | — | When entertainer can access venue for setup |
| performance_details | string | — | What venue expects (background music, featured act, etc.) |
| created_at | date | — | When request was created |
| sent_at | date | — | When request was sent to entertainer |
| last_activity | date | — | Most recent interaction on this request |
| venue_size | enum | Small (< 50), Medium (50-150), Large (150-500), Very Large (500+) | Venue capacity |
| response_due | date | — | When entertainer must respond by |

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

| request_id | venue_name | entertainer_name | event_date | event_type | status | budget_min | budget_max | duration_hours | equipment_provided | performance_details |
|---|---|---|---|---|---|---|---|---|---|---|
| REQ-001 | Blue Note Jazz Bar | Sarah Mitchell Trio | 2026-10-15 | Live Music | Sent | 400 | 600 | 3 | Full PA System | Background jazz for dinner service |
| REQ-002 | The Comedy Cellar | Marcus Weber | 2026-10-22 | Comedy Show | In Discussion | 300 | 500 | 1.5 | Basic Sound Only | Headline set, 18+ crowd |
| REQ-003 | Riverside Brewery | DJ Alex Novak | 2026-10-08 | DJ Set | Viewed | 200 | 400 | 4 | Nothing Provided | Friday night dance party |
| REQ-004 | Grand Theater | Berlin Ballet Co. | 2026-11-12 | Dance Performance | Proposal Sent | 1500 | 2000 | 2 | Lighting Included | Featured performance, ticket sales |
| REQ-005 | Café Mozart | Piano Jane | 2026-10-18 | Live Music | Expired | 250 | 350 | 2 | Unclear | Afternoon classical music |
| REQ-006 | Underground Club | The Rebels | 2026-10-30 | Live Music | Declined | 500 | 700 | 3 | Full PA System | Rock band, Halloween special |
| REQ-007 | Hotel Adlon Lounge | Smooth Jazz Quartet | 2026-11-05 | Live Music | Accepted | 800 | 1000 | 4 | Full PA System | Corporate event entertainment |
| REQ-008 | Biergarten Mitte | DJ Fritz | 2026-10-12 | DJ Set | Draft | 150 | 300 | 5 | Basic Sound Only | Outdoor summer party |
| REQ-009 | Artspace Gallery | Improv Theater Crew | 2026-10-25 | Theater | Sent | 400 | 600 | 1 | Nothing Provided | Art opening performance |
| REQ-010 | Rooftop Bar Sky | Acoustic Duo | 2026-11-01 | Live Music | Viewed | 300 | 500 | 2.5 | Unclear | Acoustic sunset session for rooftop guests. |
| REQ-011 | The Laugh Factory | Emma Chen | 2026-11-08 | Comedy Show | In Discussion | 350 | 450 | 1 | Basic Sound Only | Opening act, PG-13 content |
| REQ-012 | Tanzhaus Berlin | Contemporary Dance | 2026-11-20 | Dance Performance | Sent | 1200 | 1800 | 1.5 | Lighting Included | Guest choreographer showcase |
| REQ-013 | Pizzeria Napoli | Solo Guitarist | 2026-10-19 | Live Music | Accepted | 200 | 300 | 3 | Nothing Provided | Italian classics, dinner background |
| REQ-014 | Wedding Venue Schloss | String Quartet | 2026-12-14 | Live Music | Proposal Sent | 600 | 800 | 2 | Full PA System | Ceremony and cocktail hour |
| REQ-015 | Startup Hub | Magician Max | 2026-10-28 | Variety Show | Expired | 400 | 600 | 0.5 | Nothing Provided | Close-up magic for a team-building evening. |
| REQ-016 | Irish Pub O'Malley | Folk Band | 2026-11-16 | Live Music | Sent | 350 | 500 | 4 | Basic Sound Only | St. Patrick's warm-up party |
| REQ-017 | Opera House | Soprano Vocalist | 2026-12-05 | Live Music | In Discussion | 2000 | 3000 | 1 | Lighting Included | Guest solo performance |
| REQ-018 | Beach Club | DJ Sunset | 2026-10-13 | DJ Set | Declined | 300 | 500 | 6 | Full PA System | All-day beach party with upbeat electronic music. |
| REQ-019 | Student Bar Campus | Open Mic Host | 2026-10-21 | Comedy Show | Viewed | 100 | 200 | 3 | Basic Sound Only | Weekly open mic night |
| REQ-020 | Modern Art Museum | Dance Installation | 2026-11-28 | Dance Performance | Sent | 1000 | 1500 | 2 | Unclear | Interactive art performance |
| REQ-021 | Wine Bar Vineyard | Jazz Singer | 2026-10-26 | Live Music | Draft | 250 | 400 | 2 | Nothing Provided | Wine tasting evening music |
| REQ-022 | Corporate HQ | Keynote Speaker | 2026-11-10 | Variety Show | Proposal Sent | 800 | 1200 | 1 | Full PA System | Annual conference entertainment |
| REQ-023 | Nightclub Pulse | Electronic DJ | 2026-10-31 | DJ Set | Accepted | 600 | 900 | 5 | Lighting Included | Halloween rave headliner |
| REQ-024 | Bookstore Kafka | Poetry Reader | 2026-11-03 | Theater | Expired | 150 | 250 | 1 | Nothing Provided | Poetry reading for a book launch and signing. |
| REQ-025 | Park Amphitheater | Cover Band | 2026-11-18 | Live Music | Sent | 700 | 1000 | 3 | Full PA System | Outdoor community festival |

---

## Notes

**Key relationships:**
- Each Request links to a Venue (sender) and an Entertainer (recipient)
- Requests can transition to Bookings when status = Accepted
- The `equipment_provided` and `performance_details` fields are critical for pricing clarity

**Pricing clarity challenge:**
- Current issue: budget_min/max ranges are too broad and don't communicate what's included
- Entertainers may quote different prices for different equipment scenarios
- Venues need to know upfront what the price covers (setup time, equipment, performance duration)

## Workshop runtime extension

The complete app-facing field definitions now live in `schemas/dataset_contract.md`.
The Request entity additionally has stable venue/entertainer IDs, stage timestamps,
first-response timestamps, review state, clarification notes, and an ordered event history.
Linked entertainer records provide pricing, initials avatars, biographies, sample reviews,
booking notes, and dated availability; venue records provide default equipment and context.

Workshop assumptions: an explicit review is a response, page viewing alone is not;
active requests become stuck after more than 14 days; unanswered requests become overdue
five days after sending; Full PA satisfies Basic Sound Only. Proposal acceptance uses
recorded proposal events and clarity frozen at the first proposal, never current status alone.
All extensions and sample profile content are fictional learning fixtures.
