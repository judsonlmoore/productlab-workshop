# Feature Brief: Pricing Clarity

## Business Outcome
Increase request sent from venues to entertainers from 1 per venue per month to 10 per venue per month in the next quarter by implementing nudges both on and off platform (email, for example) for venues to take this action.

## Product Outcome
Increase the number of venues who send booking requests within 5 minutes of viewing an entertainer profile in order to reach 10 requests per venue per month, so that platform activity increases and both sides see value in the marketplace.

## The Best Bet
Bet: Pricing Clarity
Problem headline: Venues and entertainers cannot understand what pricing covers, causing hesitation that blocks booking requests from being sent.

Signals (verbatim):
— I found someone I like, but I can't tell if €500 means one hour, the whole evening or just their minimum. (Venue)
— Does this price include their equipment or do I need to provide everything? (Venue)
— The venue says their budget is €300–€700. That's such a big range that I don't know what they're expecting. (Entertainer)

## Problem/Opportunity
Venues viewing entertainer profiles are confused about what listed prices actually cover. One venue stated: "I can't tell if €500 means one hour, the whole evening or just their minimum." Another venue asked: "Does this price include their equipment or do I need to provide everything?" This confusion causes venues to hesitate before sending requests, directly blocking the behavior change needed to hit 10 requests per venue per month. From the entertainer side, one performer noted: "The venue says their budget is €300–€700. That's such a big range that I don't know what they're expecting." Without clarity on what pricing includes—duration, equipment, setup time—both sides delay action. This creates a conversion blocker at the exact moment when a venue is ready to book.

## Target User
**Primary: Venue operator** — A bar manager, event coordinator, or venue owner who has found an entertainer they like and is deciding whether to send a booking request. They are under time pressure to book entertainment for an upcoming event. They need to quickly assess whether this entertainer fits their budget and requirements. They are asking: "What exactly am I paying for? Can I afford this? Do I need to provide equipment?" Without clear answers, they leave to keep searching or delay the decision.

**Secondary: Entertainer** — A performer reviewing an incoming request from a venue. They see a budget range but don't know what the venue expects for that price. They need to understand the venue's equipment situation, performance duration expectations, and what's included in the stated budget before responding with a proposal.

## What I'm Building
A standardized pricing breakdown UI that shows exactly what an entertainer's quoted price includes. When a venue views an entertainer profile, they see a clear pricing structure broken down by: base rate for performance time, equipment requirements (what the entertainer provides vs. what the venue must provide), setup/load-in time, and typical performance duration. When an entertainer receives a request, they see the venue's budget contextualized with the venue's stated equipment availability and performance duration expectations, so they can quickly assess fit and respond with an appropriate proposal.

- **Value prop 1:** Venues see exactly what they're paying for before sending a request, eliminating the "what does this cover?" blocker that prevents requests from being sent.
- **Value prop 2:** Entertainers receive requests with clear context about what the venue expects and provides, enabling faster proposal responses.
- **Value prop 3:** Both sides spend less time in back-and-forth clarification and more time confirming bookings, directly driving the 10 requests per venue per month target.

## What I'm NOT Building
- **Advanced pricing calculator or dynamic pricing engine** — We are not building a tool that generates custom quotes based on variables. Entertainers set their pricing structure once; venues see it as-is.
- **Negotiation or counter-offer workflow within the request flow** — Price negotiation happens in Discussion status, not at the request creation stage. This feature focuses on transparency, not bargaining.
- **Equipment rental marketplace or equipment inventory system** — We communicate what equipment is provided or required, but we don't facilitate equipment sourcing, rental, or inventory management.
- **Multi-currency support or localization** — MVP launches with EUR only, German/English language support assumes single-market deployment.

## MVP/Functional Requirements

### Journey 1: Venue views entertainer profile and sends request
- [P0] Venue can view entertainer's pricing breakdown on profile page showing: base performance rate (EUR/hour), typical performance duration, equipment provided by entertainer, equipment required from venue
- [P0] Venue can see clear statement of what is included in the price (e.g., "Includes: 3-hour performance, own PA system, setup within 1 hour")
- [P0] Venue can see clear statement of what is NOT included (e.g., "Not included: Stage, lighting, sound engineer")
- [P0] When venue creates a request, system pre-fills equipment_provided field based on venue's profile/historical data, creating initial transparency for entertainer
- [P0] Venue can edit duration_hours and see how that affects budget expectations before sending request
- [P1] Venue sees example pricing scenarios (e.g., "2-hour set with your equipment: €400-600" vs. "4-hour set with our PA: €700-900")
- [P1] System shows entertainer response rate and average response time to set venue expectations

### Journey 2: Entertainer reviews incoming request
- [P0] Entertainer can see request with clearly stated: venue budget range, performance duration expected, equipment venue is providing, performance context/details
- [P0] Entertainer can view venue profile showing: venue size, typical event types, equipment available at venue
- [P0] Entertainer can mark request fields as "Unclear" and request clarification before responding, preventing mismatched proposals
- [P0] System shows whether request parameters match entertainer's stated pricing structure (visual indicator: "This request matches your standard 3-hour rate")
- [P1] Entertainer sees historical comparison: "Venues with similar budgets typically book you for 2-3 hours"
- [P2] Product team can monitor: % of requests marked "Unclear", time-to-first-response, proposal acceptance rate by pricing clarity level

## Done Condition
**Read test:** Venue can determine whether an entertainer fits their budget and equipment situation within 30 seconds of viewing the profile, without leaving the page or messaging the entertainer.

**Write test:** Venue can create and send a booking request with clear duration and equipment context, and immediately see confirmation that the request includes all information the entertainer needs to respond with a proposal. Entertainer sees request with complete pricing context and can mark it "Reviewed" or "Needs Clarification" with one click, and that status change is immediately visible to the venue.

## Job to Be Done
**Functional:** When I find an entertainer I like but can't tell if €500 means one hour, the whole evening, or just their minimum, I want to see exactly what their pricing covers (duration, equipment, setup), so I can decide whether to send a request without having to ask first.

**Emotional:** I want to feel confident that I understand the deal instead of confused about hidden costs or unclear terms.

## Journey Context
**Before:** Venue has searched for entertainers, filtered by event type and date, and clicked on an entertainer profile. They like what they see (photos, videos, reviews) but now they're looking at the pricing and trying to decide whether to send a request. They're asking: "What am I actually paying for? Do I need to provide a PA system? How long will they play?" Without clear answers, they leave to keep searching or message the entertainer with questions, delaying the request.

**This feature:** At the moment of decision—when the venue is ready to send a request—this feature removes the pricing ambiguity blocker by showing exactly what the entertainer's rate includes.

**After:** Venue sends the request with confidence, knowing what they're asking for and what it will cost. Entertainer receives request with full context and can respond with a proposal quickly. Both move to In Discussion status where they finalize details. The request-sending behavior increases because the "I don't know what this costs" blocker is removed.

## Data Contract
**Entity:** Request

**Source:** _initial_context-gigiii/data_model.md

**Required fields:**
- `budget_min` (number) — Minimum budget (EUR)
- `budget_max` (number) — Maximum budget (EUR)
- `duration_hours` (number) — Expected performance duration in hours
- `equipment_provided` (enum) — What venue provides: Full PA System, Basic Sound Only, Lighting Included, Nothing Provided, Unclear
- `performance_details` (string) — What venue expects (background music, featured act, etc.)
- `event_type` (enum) — Live Music, DJ Set, Comedy Show, Dance Performance, Theater, Variety Show
- `venue_name` (string) — Name of venue
- `entertainer_name` (string) — Name of entertainer
- `status` (enum) — Draft, Sent, Viewed, In Discussion, Proposal Sent, Accepted, Declined, Expired
- `event_date` (date) — Requested performance date

**Default State & Filters:**
On entertainer profile page, pricing breakdown is always visible (not hidden behind interaction). When venue creates a request, `equipment_provided` defaults to venue's profile setting or "Unclear" if not set. `duration_hours` defaults to entertainer's stated "typical performance duration" but is editable by venue.

## View Spec

**Ordering axis:**
This feature adds pricing clarity elements to two existing views: (1) Entertainer Profile page (where venues make the "send request" decision), and (2) Request Detail page (where entertainers review incoming requests). The primary axis is **informational hierarchy** — pricing information is surfaced at the decision point, not buried in secondary tabs.

**Layout — Entertainer Profile (Venue perspective):**
Entertainer profile page displays standard profile content (photos, bio, reviews) with a prominent **Pricing & Booking Details** section positioned immediately before the "Send Request" CTA. This section is a contained card with clear visual hierarchy:

- Top line: Base rate (e.g., "€400-600 per performance")
- Second line: Typical duration (e.g., "3-hour sets")
- Equipment section (2 columns):
  - Left: "What's included" (e.g., "Own PA system, microphones, cables")
  - Right: "What you provide" (e.g., "Stage space, power outlet")
- Bottom: Example scenarios in collapsible accordion (e.g., "2-hour set with your equipment: €300-450")

This card fits within one viewport section (no scrolling required to see all pricing info before CTA).

**Priority 1 — The signal:**
The critical data condition is: **Does this entertainer's pricing structure match my budget and equipment situation?** Venues must immediately see whether the entertainer provides equipment or requires the venue to provide it, because this is the primary blocker mentioned in signals. Visual treatment: Equipment requirements are shown with clear iconography and color coding (green = included, yellow = venue provides, red = not available). If `equipment_provided` is "Unclear", a warning badge appears: "Equipment details needed—clarify before booking."

**Priority 2 — The context:**
The pricing breakdown shows:
- Base rate range (budget_min to budget_max from entertainer's pricing profile)
- Typical duration in hours (entertainer's standard)
- Equipment included vs. required (two-column layout)
- Load-in/setup time expectations (text field)

Grouping: Information is grouped by "What you pay" vs. "What you get" vs. "What you provide". This directly maps to the questions from the signals.

**Priority 3 — Supporting data:**
- Example pricing scenarios (shown in expandable section below the primary pricing card)
- Entertainer's response rate and average response time (small text below Send Request button)
- Link to entertainer's full terms/policies (if they have them)

**KPI definitions:**
- **Response rate:** (# of requests entertainer responded to / # of requests entertainer received) over last 90 days
- **Average response time:** Median time from request `sent_at` to first entertainer action (`status` change from Sent to Viewed or In Discussion) over last 90 days

**Empty State:**
If entertainer has not filled in pricing breakdown fields (base rate, equipment, duration), show placeholder message: "This entertainer hasn't added pricing details yet. Message them to discuss rates." The Send Request button remains enabled but shows a warning icon.

**Layout — Request Detail (Entertainer perspective):**
When entertainer opens a request, the Request Detail page shows all request fields in a structured layout. Pricing context is grouped at the top in a highlight section titled "Budget & Requirements":

- Venue's budget range (budget_min to budget_max)
- Requested performance duration (duration_hours)
- Equipment venue is providing (equipment_provided enum with clear icon)
- Performance context (performance_details as text)
- Event type and date

Below this section: Venue profile summary (venue size, typical events, past bookings if any), and action buttons (Accept, Decline, Request Clarification).

**Priority 1 — The signal:**
The critical data condition is: **Does this request match my pricing structure and equipment requirements?** Entertainers need to immediately see if the venue's budget and equipment situation align with what they typically charge. Visual treatment: System compares request parameters (budget range, duration, equipment) to entertainer's stated pricing profile and shows a match indicator: "✓ Matches your 3-hour standard rate" (green) or "⚠ Budget below your typical range for this duration" (yellow) or "❌ Equipment mismatch—you require Full PA, venue provides Nothing" (red).

**Priority 2 — The context:**
Request detail fields shown in priority order:
1. Budget & equipment (highlighted section as described above)
2. Event context (event_type, event_date, performance_details)
3. Venue information (venue_name, venue_size, past interaction history if any)
4. Timeline (created_at, sent_at, response_due)

Grouping: Information is grouped by "What they're paying" vs. "What they expect" vs. "Who they are". This directly maps to the entertainer's need to assess whether the request makes sense.

**Priority 3 — Supporting data:**
- Venue's historical booking data (if any): "This venue has booked 3 performers through Gigiii in the past 6 months"
- Venue's average budget for similar event types
- Option to view venue's public profile (opens in side panel)

**Empty State:**
If request has `equipment_provided = "Unclear"` or missing `duration_hours`, show warning: "This request is missing key details. Use 'Request Clarification' to ask before responding."

## Interactions

### Clickflow
1. Venue user opens entertainer profile → sees full profile including Pricing & Booking Details card prominently displayed above "Send Request" button, with equipment breakdown and rate range clearly visible
2. Venue user scans pricing card → notices equipment section shows "What's included: Own PA system" and "What you provide: Stage space, power outlet", directly answering the "does this price include their equipment" question from signals
3. Venue user clicks "Send Request" → form opens with pre-filled `duration_hours` (from entertainer's typical duration) and `equipment_provided` (from venue's profile or defaults to "Unclear"), venue can edit these fields
4. Venue user adjusts `duration_hours` from 3 to 2 hours → budget suggestion text updates immediately showing "For 2-hour performances, this entertainer typically charges €300-450" (calculated from entertainer's base rate)
5. Venue submits request → request status changes from Draft to Sent, venue sees confirmation "Request sent. [Entertainer name] typically responds within 6 hours." and can view request in their Sent Requests list with status indicator

### Write Interactions
**Primary write:** Venue creates and sends a request. Fields written: `status` (Draft → Sent), `budget_min`, `budget_max`, `duration_hours`, `equipment_provided`, `performance_details`, `event_date`, `event_type`, `sent_at` (timestamp). UI element: "Send Request" button on request creation form.

**System response:** Request appears in venue's "Sent Requests" list with status badge showing "Sent" (amber color). Entertainer's inbox shows new request notification. Request Detail page for venue shows "Awaiting response" state with expected response time. If venue edits `duration_hours` in the form before sending, the budget suggestion text re-renders immediately.

**Validation & Constraints:** Required fields before sending: `event_date`, `duration_hours`, `event_type`, `performance_details` (min 20 characters). If `equipment_provided = "Unclear"`, show warning but allow send (don't block). Venue cannot send multiple requests to the same entertainer for the same event_date (duplicate prevention).

**Secondary write:** Entertainer marks request as "Needs Clarification". Field written: `status` (Sent → In Discussion), adds a system note "Entertainer requested clarification on [timestamp]". UI element: "Request Clarification" button on Request Detail page.

**System response:** Venue receives notification "Entertainer has questions about your request" and can view clarification message thread. Request status badge changes to "In Discussion" (blue color).

### Read Interactions
**Primary read:** Venue views entertainer profile and scans Pricing & Booking Details card.

**System response:** Pricing card renders with current entertainer data (base rate, equipment, duration). If entertainer hasn't filled in pricing fields, empty state message appears.

**Secondary read:** Venue clicks "View Example Pricing" accordion within Pricing & Booking Details card.

**System response:** Accordion expands showing 2-3 scenario examples (e.g., "2-hour set with your equipment: €300-450", "4-hour set with our PA: €700-900"). These scenarios are generated from entertainer's base rate and typical equipment configurations.

**Tertiary read:** Entertainer opens Request Detail page.

**System response:** Full request detail renders with highlighted Budget & Requirements section at top. Match indicator appears showing alignment between request parameters and entertainer's pricing profile (green checkmark for good match, yellow warning for partial match, red flag for mismatch).

## Secondary View
What it adds: Allows venues to compare pricing across multiple entertainers they're considering for the same event, surfacing pricing differences in a side-by-side format that makes the "which one fits my budget" decision faster.

Trigger: From search results page or favorites list, venue selects 2-3 entertainers and clicks "Compare Pricing" button (shown when 2+ entertainers are selected).

View Spec:
- Priority 1: Side-by-side table showing each entertainer's base rate, typical duration, equipment provided/required, and calculated cost estimate for the venue's stated event parameters (if venue has created a draft request, system uses those parameters; otherwise defaults to "3 hours, Basic Sound Only")
- Priority 2: Availability indicators showing which entertainers are available on the venue's target event_date (if date is set in draft request context)
- Priority 3: Quick access to each entertainer's full profile (link in header of each column)

Build phase: Prompt 04

## Supporting Views

No Supporting Views defined. All signals for Pricing Clarity point to the same question: "What does this price actually include?" The Primary View addresses this question completely for both venue and entertainer perspectives.
