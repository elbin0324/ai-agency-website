# Demo storyboards: the six "AI in use" demos

Owner: product storytelling. Status: final for build. Last verified: 2026-10-13 (numbers calibrated to `BENCHMARKS.md` base values; see the Calibration changelog at the end).

This is the build spec for the six animated demos listed in `BRIEF.md` ("The six demos"). Engineers implement directly from it. Every caption, message, table row, number and timing below is final on-screen copy. If something has to change, change it here first, then in code.

**How to read this file**

- Each demo has: At a glance → Personas → Layout → Steps → Result card → Reduced-motion final state.
- Step headings give the step's time window and duration, for example `Step 3 · 8.0–13.5 s · 5,500 ms`. A step's duration is its total time: animation plus reading hold.
- Offsets such as `+800 ms` are measured from the start of the step. Anything without an offset starts at `+0`.
- Text inside code blocks is exact copy. It uses straight quotes so it survives copy and paste; render it with typographic quotes and apostrophes. Keep line breaks as written.
- Effect names in backticks (`fade`, `type`, `stream`…) are defined in 0.3.

---

## Cross-file alignment (read before building)

Three content files were written in parallel. This is how they fit together.

- **Customer Agent** is set at **Larkfield Plumbing & Air**, the same fictional business as `SCENARIOS.md` §2.1 ("What it's worth" on `/services/ai-agents/`). Everything in the demo stays inside that profile: 18 employees including 12 technicians, a 40% gross margin on service-and-repair jobs (`BENCHMARKS.md` base, pnl-16; `SCENARIOS.md` §2.1 still says 50% and should be brought into line), urgent problems handed to the on-call technician, complaints and complex quotes handed to the office manager.
- **Sales Agent** uses the sender, prospect and both emails from `COPY.md` §6.3 word for word (Parkline IT writing to Hollis & Grant), as `COPY.md` §8.7 asks, so the Sales page's comparison and its demo tell one story. `SCENARIOS.md` §2.5 (Wrenfield Commercial Cleaning) stays a separate worked example. If the team wants one business across all three, change those files together, not this one alone.
- **Analyst, Executive Assistant, Marketing Director and Consulting** use their own fictional businesses, because the demo brief fixed their industries (a distributor, a 25-person firm, a dental group, a 40-person restaurant business). The business names in `COPY.md` §8.3–8.8 are placeholders that defer to this file, so update those subheads and captions to match.
- **Numbers follow the rules in `SCENARIOS.md` §4:** time is valued at loaded cost (owner $68 an hour, `BENCHMARKS.md` base: lab-01, lab-06); new business counts as gross profit, not revenue; a saving that depends on the client's decisions or a negotiation counts at half (see Consulting).
- **Player microcopy** (buttons, progress text, transcript toggle, the "Simulated demo" badge) comes from `COPY.md` §8.9. The reduced-motion and no-JavaScript lines come from `COPY.md` §1.6.
- **Result cards** use figures from each demo's own story. Each card lists the values for the placeholders in `COPY.md` §8.3–8.8 (`{seconds}`, `{job_value}` and so on).
- **Naming note:** resolved. The consulting example business was renamed to Corran Valley Metalworks, so "Hollis" now appears only in Hollis & Grant (the Sales demo prospect).

---

## Index

| # | ID | Demo | Fictional business | Runtime | Steps | Appears on |
|---|---|---|---|---|---|---|
| 1 | `customer-agent` | Customer Agent | Larkfield Plumbing & Air | 43.0 s | 9 | `/` demo tabs · `/services/ai-agents/#demo-customer-agent` · `/demos/#customer-agent` |
| 2 | `analyst-agent` | Analyst Agent | Cobalt Creek Supply Co. | 36.5 s | 7 | `/` demo tabs · `/services/ai-agents/#demo-analyst-agent` · `/demos/#analyst-agent` |
| 3 | `executive-assistant` | Executive Assistant | Coppervale Electric Co. | 41.5 s | 8 | `/` demo tabs · `/services/ai-agents/#demo-executive-assistant` · `/demos/#executive-assistant` |
| 4 | `marketing-director` | Marketing Director | Stillbrook Dental Group | 40.0 s | 8 | `/` demo tabs · `/services/marketing/#demo` · `/demos/#marketing-director` |
| 5 | `sales-agent` | Sales Agent | Parkline IT, prospecting Hollis & Grant | 43.0 s | 9 | `/` demo tabs · `/services/sales/#demo` · `/demos/#sales-agent` |
| 6 | `consulting` | Consulting | Larder & Flame Kitchen Co. | 38.0 s | 7 | `/` demo tabs · `/services/consulting/#demo` · `/demos/#consulting` |

---

## 0. Global player spec (applies to all six)

### 0.1 Anatomy

1. **App window.** Rounded window with chrome: three dots on the left, the window title centered, and the badge `Simulated demo` on the right. Design size 1120 × 700 (16:10); it scales to the container width. Content never reflows during playback (no layout shift).
2. **Caption bar** below the window: `Step {n} of {total}` in muted text, then the caption. It crossfades in 200 ms at each step start. It is the live region labeled `Demo captions` (`aria-live="polite"`).
3. **Progress bar:** one segment per step, each segment's width proportional to its step's duration. The active segment fills linearly.
4. **Controls** (labels from `COPY.md` §8.9): `Play demo` · `Pause` · `Resume` · `Replay` · `Skip to result`. Segments are clickable: jumping to step N renders steps 1 to N−1 in their end state instantly, then plays step N.
5. **Result card.** On the last step it slides up over the lower 60% of the window (desktop) or appears directly below the window (under 720 px). It stays until Replay.
6. **Under the player:** the disclosure `Read the step-by-step` / `Hide the step-by-step` (the transcript, see 0.7), then the demo's microcopy line from `COPY.md` (for example "Simulated demo. Larkfield Plumbing & Air is a fictional business. Figures are illustrative.").

### 0.2 Playback rules

- Autoplay once when at least 50% of the player is in the viewport. Pause when less than 20% is visible or the tab is hidden; resume from the same point when it comes back. Show `Paused` while paused.
- Play once. Hold on the result card at the end; never loop.
- Clock chips inside a window (for example `9:47 pm`) change only where a step says so.

### 0.3 Effects vocabulary

| Name | Spec |
|---|---|
| `fade` | Opacity 0 → 1 plus translateY 6 px → 0, 250 ms, ease-out |
| `type` | A person typing into a composer or field: 18 ms per character after a 300 ms pause; "send" moves the text into a bubble in 200 ms |
| `type-fast` | Same as `type` at 12 ms per character (used for long user messages) |
| `dots` | Three-dot typing indicator, 600 ms unless stated |
| `stream` | Agent output appearing word by word, 30 ms per word unless stated |
| `cascade` | List items or table rows `fade` in one after another, 90 ms stagger unless stated |
| `count` | A number tweens from 0 (or its previous value) in 700 ms, ease-out, tabular figures |
| `pulse` | 2 px accent outline, two pulses over 1,000 ms |
| `strike` | Strike-through in 200 ms, then the row's height collapses in 300 ms |
| `draw` | Lines draw over 900 ms; bars grow from the baseline over 600 ms with a 60 ms stagger |
| `swap` | Crossfade between two contents of the same pane, 250 ms |
| `click` | A pointer moves to the target in 500 ms, then shows a 150 ms press state |
| `check` | Status icon: spinner 400 ms, then a check mark 200 ms |

### 0.4 Copy and data conventions

- US English. Times in the UI as `9:47 pm`; dates as `Wed, Jul 15`; ranges with an en dash (`8:00–10:00 am`, `$165–$265`).
- Tabular figures for every number. Currency without cents, except inside spreadsheets and where a table below shows cents.
- Every business, person, address, invoice and figure is fictional. Email and web addresses use the reserved `.example` domain. Phone numbers use the reserved 555-0100 to 555-0199 range. Street addresses have no city.
- Third-party tools (QuickBooks, Google Ads, Meta, Microsoft 365) appear as plain text only. No logos.
- `{BRAND}` is the site name from config (`site.name`, currently "Halyard"). Agent panels are labeled with it.
- No industry statistics or benchmarks inside any demo. Every comparison is against the business's own data, contracts or quotes.
- Colors in highlights (amber, red, blue, purple, gray, green) map to theme tokens and always come with an icon or text tag. Color is never the only signal.

### 0.5 Result card (same structure in all six)

- Heading `Result`, with the label `Illustrative example` (Consulting adds `Modeled estimate`). The label links to `/results/#methodology`.
- Three metric tiles. Each has a large value, a short label and a one-line basis in small muted text. Values `count` up when the card appears.
- Footer: link `See the math` → `/results/#examples`, the `Replay` button, and the primary button `Book a free AI assessment` → `/contact/`. All links are base-aware.

### 0.6 Reduced motion and no JavaScript

- With `prefers-reduced-motion: reduce`: no autoplay and no typing, streaming, counting or drawing. Render the demo's final state (each demo specifies it), with every pane fully populated and the result card visible below the window.
- Replace the caption bar with a static ordered list of every step caption, introduced by the line from `COPY.md` §1.6: "Motion is reduced, so every step is shown at once. Press Play to step through them one at a time." Pressing `Play demo` then steps through the end state of each step with no animation (Next / Previous).
- Without JavaScript: show "This demo needs JavaScript. Here's the step-by-step version instead." followed by the caption list and the result card's three metrics as plain text.

### 0.7 Accessibility

- The animated window is `aria-hidden="true"` while playing; screen readers get the captions through the caption bar's live region.
- The transcript disclosure lists every caption plus the key on-screen text from this file: messages, emails, findings and the result metrics.
- All controls are keyboard operable with a visible focus ring. Space toggles play and pause when the player has focus.

### 0.8 Mobile (under 720 px)

- The window keeps its chrome and badge. Side panes collapse as each demo describes, usually into a one-line ticker or a bottom sheet showing the latest item.
- Minimum text size inside the window: 11 px. Wide tables hide extra columns behind a right-edge fade.

---

## 1. Customer Agent

### At a glance

| Field | Value |
|---|---|
| ID | `customer-agent` |
| Title | Customer Agent: a late-night chat becomes a booked job |
| Promise | Checks safety, asks the right questions, quotes from the price book and books the job at 9:47 pm, with the office closed. |
| Business (fictional) | **Larkfield Plumbing & Air**, residential plumbing, heating and cooling. 18 employees: owner, office manager, 2 customer service reps, 12 technicians, 2 apprentices. Same business as `SCENARIOS.md` §2.1. |
| Window title | `Larkfield Plumbing & Air · Website chat` (browser-style chrome; address bar `larkfieldair.example/contact`) |
| Runtime | 43.0 s · 9 steps |

### Personas

- **Jenna Morales**, homeowner and website visitor.
- **Larkfield's AI assistant**, the Customer Agent. The widget header says "AI assistant", and its first message says so too.
- **Marcus R.**, the technician who gets the job. **Alicia T.** and **Dev K.** also appear on the dispatch calendar.
- **Luis P.**, tonight's on-call technician (named in the safety rule only).
- **Renee K.**, office manager (receives the handoff in step 8).

### Layout

- **Status chip** in the window's top bar: `Tue 9:47 pm · Office closed`. It changes to `9:48 pm` in step 4, `9:49 pm` in step 6 and `9:50 pm` in step 8.
- **Left pane, 60%, eyebrow `What the customer sees`:** Larkfield's chat widget at full height. Header `Larkfield Plumbing & Air` with the sub-line `AI assistant · Replies instantly` and a green dot. Message list, a row for quick-reply chips, and a composer with the placeholder `Type a message…`.
- **Right pane, 40%, eyebrow `Behind the scenes`:** panel titled `{BRAND} Agent console`. Top: a timeline of actions (icon, label, detail line, timestamp, status). Bottom: a context slot that shows one card at a time, in this order: Safety rule → Price book → Dispatch calendar → Customer record → Handoff rule.
- **SMS toast:** a phone-style notification that slides up at the bottom of the left pane in step 7 and then stays docked there.
- **Mobile:** the chat pane fills the window. The right pane becomes a one-line ticker above the caption bar showing the latest action (for example `✓ Created booking #BK-4127`). Context cards are hidden.

### Steps

#### Step 1 · 0.0–3.5 s · 3,500 ms

**Caption:** 9:47 pm. The office is closed. A homeowner opens the website chat.

**On screen:** The window `fade`s in. The chat widget opens (scale 0.96 → 1, 250 ms). +600 ms: `dots` 700 ms, then the greeting `stream`s. The right pane shows the empty state `Waiting for a message…`

```text
AI assistant: Hi! I'm Larkfield's AI assistant. I can answer questions, give price ranges and book service, day or night. What's going on?
```

#### Step 2 · 3.5–8.0 s · 4,500 ms

**Caption:** She describes a noisy AC and asks about price and timing.

**On screen:** Jenna's message `type`s into the composer, then sends.

```text
Jenna: Hi, my AC started making a loud buzzing noise this afternoon. It's still cooling but it's loud. How much to have someone look at it, and how soon can you come?
```

#### Step 3 · 8.0–13.5 s · 5,500 ms

**Caption:** Safety check first. Then two questions a good dispatcher would ask.

**On screen:** +0: action 1 `cascade`s into the timeline with `check`, and the Safety rule card `fade`s into the context slot with the status `Checking…`. +400 ms: `dots` 600 ms, then the reply `stream`s.

**Action 1:** `Ran safety check` · `Buzzing can be electrical: asked about smell, smoke, sparks` · `9:47 pm` · ✓

**Safety rule card:**

```text
Escalation rule · Safety
If the customer reports: burning smell, smoke, sparks, or water near electrical parts
Then: tell them to switch the system off, call tonight's on-call technician (Luis P.) and send him the transcript
Status: Checking…
More rules: no heat in freezing weather · active leak · complaint or complex quote → office manager
```

**Reply:**

```text
AI assistant: Sorry about that. Let's get it sorted.
First, a quick safety check: any burning smell, smoke or sparks near the unit?
Then two questions so we send the right tech with the right parts:
1. Is the noise coming from the outdoor unit or from inside the house?
2. When the system kicks on, does the fan on top of the outdoor unit start spinning right away?
```

#### Step 4 · 13.5–20.0 s · 6,500 ms

**Caption:** No red flags. It quotes from Larkfield's own price book, not a guess.

**On screen:** Jenna's answer `type-fast`s and sends. +2,000 ms: status chip → `9:48 pm`; the Safety rule status changes to `Not triggered` and `pulse`s; action 2 appears. +2,500 ms: action 3 appears and the context slot `swap`s to the Price book card (rows `cascade`). +3,000 ms: `dots` 400 ms, then the reply `stream`s. When the line with `$165–$265` renders, the CAP-RPL and CON-RPL rows `pulse`.

```text
Jenna: No smell or smoke. It's the outdoor unit. It buzzes for a few seconds when it kicks on and the fan is slow to start. The system is about 9 years old.
```

**Action 2:** `Safety rule: not triggered` · `No smell, smoke or sparks reported` · `9:48 pm` · ✓

**Action 3:** `Looked up price book` · `4 items · residential` · `9:48 pm` · ✓

**Price book card** (title `Price book · Residential`):

| Code | Item | Price |
|---|---|---|
| DIAG-01 | Diagnostic visit | $89, credited to the repair |
| CAP-RPL | Capacitor replacement | $165–$245 |
| CON-RPL | Contactor replacement | $185–$265 |
| AH-FEE | After-hours visit fee | +$149 |

**Reply:**

```text
AI assistant: Thanks, that helps. A buzz at start-up with a slow fan usually points to a weak capacitor or contactor: a common repair, usually done in one visit.
From our price book:
• Diagnostic visit: $89, credited toward the repair
• Capacitor or contactor replacement: $165–$265 total
Since it's still cooling, a regular visit tomorrow avoids our $149 after-hours fee.
```

#### Step 5 · 20.0–24.5 s · 4,500 ms

**Caption:** It checks the live dispatch calendar and offers real openings.

**On screen:** +0: action 4 appears; the context slot `swap`s to the Dispatch calendar card and the two open windows `pulse` green. +600 ms: the reply `stream`s, then the chips `fade` in. +3,000 ms: `click` on the `8:00–10:00 am` chip; it becomes Jenna's bubble.

**Action 4:** `Checked dispatch calendar` · `Wed 7/15 · 2 open windows` · `9:48 pm` · ✓

**Dispatch calendar card** (title `Dispatch · Wed, Jul 15`):

| Technician | 8:00–10:00 am | 10:00 am–12:00 pm | 1:00–3:00 pm |
|---|---|---|---|
| Marcus R. | **Open** | Booked | Booked |
| Alicia T. | Booked | Booked | **Open** |
| Dev K. | Booked | Booked | Booked |

```text
AI assistant: I can get a technician to you tomorrow, Wednesday, July 15. Which window works best?
[chip] 8:00–10:00 am   [chip] 1:00–3:00 pm   [chip] Another day
Jenna (taps the chip): 8:00–10:00 am
```

#### Step 6 · 24.5–29.5 s · 5,000 ms

**Caption:** Name, address and mobile number. The job is booked.

**On screen:** +0: `dots` 400 ms, then the question `stream`s. +1,300 ms: Jenna's details `type` and send. +2,800 ms: status chip → `9:49 pm`; action 5 appears; the booking card `fade`s into the chat.

```text
AI assistant: Perfect. What's your full name, the service address and a mobile number for text updates?
Jenna: Jenna Morales, 418 Larkspur Lane, (480) 555-0148
```

**Action 5:** `Created booking` · `#BK-4127 · Marcus R. · Wed 8–10 am` · `9:49 pm` · ✓

**Booking card** (inside the chat):

```text
✓ You're booked
AC repair · Diagnostic visit
Wed, Jul 15 · 8:00–10:00 am
Technician: Marcus R.
418 Larkspur Lane
Capacitor or contactor: $165–$265 total, $89 diagnostic credited
Your technician confirms the price before any work starts.
```

#### Step 7 · 29.5–34.0 s · 4,500 ms

**Caption:** A text confirmation goes out, and the customer record is updated.

**On screen:** +0: `dots` 400 ms, then the message `stream`s. +1,200 ms: the SMS toast slides up (300 ms) and stays docked. +1,500 / +2,000 / +2,500 ms: actions 6, 7 and 8. +2,700 ms: the context slot `swap`s to the Customer record card.

```text
AI assistant: I've texted you a confirmation, and Marcus will text when he's on his way. Tonight, if you notice a burning smell or the buzzing won't stop, switch the system off at the thermostat and reply here. I'll get our on-call technician on the phone.
```

**SMS toast:**

```text
Messages · now
Larkfield Plumbing & Air: Hi Jenna, you're confirmed for AC repair Wed 7/15, 8–10 am with Marcus R. Your $89 diagnostic is credited to any repair. Reply R to reschedule. Reply STOP to opt out.
```

**Action 6:** `Sent text confirmation` · `(480) 555-0148` · `9:49 pm` · ✓

**Action 7:** `Updated customer record` · `Scheduling system · new customer` · `9:49 pm` · ✓

**Action 8:** `Tagged` · chips `AC repair` `After-hours` `Plan prospect` · `9:49 pm` · ✓

**Customer record card:**

```text
Customer record · New customer
Jenna Morales · (480) 555-0148
418 Larkspur Lane
Source: Website chat, after hours
Job: AC repair. Buzzing at start-up, outdoor unit
Equipment: about 9 years old · no maintenance plan
Booking: #BK-4127 · Wed 7/15, 8:00–10:00 am · Marcus R.
Tags: AC repair · After-hours · Plan prospect
Transcript attached
```

#### Step 8 · 34.0–39.0 s · 5,000 ms

**Caption:** A question it shouldn't answer goes to a person, with full context.

**On screen:** +0: Jenna's question `type-fast`s and sends. +1,600 ms: status chip → `9:50 pm`; the context slot `swap`s to the Handoff rule card; its status changes from `Checking…` to `Triggered` and `pulse`s. +2,000 ms: `dots` 400 ms, then the reply `stream`s. +3,400 ms: action 9 appears; a `Replacement lead` chip is added to action 8, and the record gains the line `Callback: Renee K., Wed by 10 am`.

```text
Jenna: Thanks! Since it's 9 years old, do you offer financing if we end up replacing it?

AI assistant: Good question. Financing depends on the system and the plan you choose, so I've asked Renee, our office manager, to call you tomorrow by 10 am. She'll have this conversation in front of her, so you won't need to repeat anything.
```

**Handoff rule card:**

```text
Handoff rule · Sales and financing
If the customer asks about: financing, a new system, or a quote over $1,500
Then: don't quote. Book a callback with the office manager and attach the transcript
Status: Triggered · callback task created for Renee K.
```

**Action 9:** `Handed off to a person` · `Financing question → Renee K., office manager · callback Wed by 10 am · transcript attached` · `9:50 pm` · ✓

#### Step 9 · 39.0–43.0 s · 4,000 ms

**Caption:** Booked in 2 minutes, after hours, with zero office time.

**On screen:** The result card slides up (400 ms); its values `count`.

### Result card · Illustrative example

| Tile | Value | Label | Basis (one line) |
|---|---|---|---|
| Time | 2 min | First message to confirmed booking | First message 9:47 pm, booked 9:49 pm; first reply in 2 seconds vs a typical ~60 min web reply (cx-20, cx-18). |
| Staff time | 0 min | Office time to book, confirm and log | vs about 5 staff minutes by phone the next morning (cx-34), if the customer hasn't booked elsewhere by then. |
| Value | $215 | Estimated job value | Midpoint of the quoted $165–$265; about $86 gross profit at a 40% service-job margin (cx-28, pnl-16). |

`COPY.md` §8.3 placeholders: `{seconds}` = 2 · `{job_value}` = $215 · booked at 9:49 pm (the copy draft says 9:52 PM; use 9:49 pm).

### Reduced-motion final state

- **Left:** the whole conversation, scrolled to the end so the booking card, the text-confirmation message, the financing question and the handoff reply are visible (earlier messages scroll). The SMS card is docked at the bottom.
- **Right:** all 9 actions checked. The context slot shows the Customer record card with the `Replacement lead` tag and the line `Callback: Renee K., Wed by 10 am`. Below it, the two rules collapse to one line each: `Safety rule · Not triggered` and `Handoff rule · Triggered`.
- Status chip: `Tue 9:50 pm · Office closed`. Result card below the window.

---

## 2. Analyst Agent

### At a glance

| Field | Value |
|---|---|
| ID | `analyst-agent` |
| Title | Analyst Agent: a messy export becomes a clear answer |
| Promise | Cleans a messy spreadsheet, builds the formulas, pivot and chart, and explains what changed in plain English, with dollars attached. |
| Business (fictional) | **Cobalt Creek Supply Co.**, a regional distributor of foodservice packaging, janitorial and paper products. 58 employees, about $21.5M a year in sales. |
| Window title | `Q3_sales_raw.xlsx · Cobalt Creek Supply Co.` (spreadsheet app with an agent panel) |
| Runtime | 36.5 s · 7 steps |

### Personas

- **Priya Shah**, controller. She sends the file and the question.
- **{BRAND} Analyst**, the Analyst Agent.

### Layout

- **Top:** a thin toolbar, then a formula bar (name box plus an `fx` field).
- **Left, 64%:** the grid, with column letters and row numbers, and sheet tabs along the bottom. It starts with `Raw`. The tabs `Clean`, `Log`, `Pivot` and `Chart` pop in (scale 0.9 → 1, 200 ms) as they're created, and the newest becomes active (except `Log`, which is created but not opened).
- **Status bar** under the grid: sheet name, row count and Sum of Revenue.
- **Right, 36%:** panel `{BRAND} Analyst`. Priya's message and file chip, then a checklist that fills in, then the findings report (scrolls).
- **Mobile:** the grid hides columns after F behind a fade; the agent panel stacks below the grid and shows only its newest block; in steps 5 and 6 the chart replaces the grid.

### Steps

#### Step 1 · 0.0–4.0 s · 4,000 ms

**Caption:** The controller drops in Q3's raw export. It's a mess.

**On screen:** Priya's message `type-fast`s in the panel composer and sends with the file chip. +1,800 ms: the Raw sheet loads (rows `cascade`, 60 ms stagger). Status bar: `Raw · 4,318 rows`.

```text
Priya: Here's Q3 sales. Clean it up, show me margin by product line by month, and tell me what's going on. Margin feels off.
[file] Q3_sales_raw.xlsx · 4,318 rows · 412 KB
```

**Raw sheet, rows 1–9 visible** (row 10 onward continues below the fold). Numbers are right-aligned as in a raw export; H3 is text.

| Row | A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Date | Inv # | Customer | Region | Product Line | SKU | Qty | Revenue | COGS | Freight |
| 2 | 07/01/2026 | 10482 | Bayside Diner | North *(merged D2:D5)* | Packaging | PK-1204 | 40 | 1240 | 902.7 | 49.6 |
| 3 | 2026-07-01 | 10483 | Harvest Table Cafe | *(merged)* | Paper Goods | PG-3310 | 12 | `$486.00 ` *(text: left-aligned, green corner marker)* | 340.2 | 61.4 |
| 4 | Jul 1 | 10484 | Lakeview Grill | *(merged)* | JANITORIAL | JN-2207 | 6 | 732.5 | 484.9 | 24.1 |
| 5 | 07/01/2026 | 10484 | Lakeview Grill | *(merged)* | JANITORIAL | JN-2207 | 6 | 732.5 | 484.9 | 24.1 |
| 6 | | | TOTAL 7/1 | | | | | 3191 | 2212.7 | 159.2 |
| 7 | 7/2/26 | 10485 | Corner Slice Pizza | South *(merged D7:D9)* | Paper goods | PG-3302 | 8 | 318 | 222.6 | 47.7 |
| 8 | 07/02/2026 | 10486 | Greenleaf Kitchen | *(merged)* | Safety/PPE | SP-4410 | 20 | 644 | 437.9 | 19.3 |
| 9 | 2-Jul | 10487 | Maple Street Deli | *(merged)* | Pkg | PK-1188 | 25 | 905 | 657 | 36.2 |

Row 5 duplicates row 4. Row 6 is a stray total of rows 2–5, so it includes the duplicate: 1,240 + 486 + 732.5 + 732.5 = 3,191.

#### Step 2 · 4.0–9.5 s · 5,500 ms

**Caption:** It finds every problem: mixed dates, duplicates, merged cells, totals.

**On screen:** Highlights `cascade` in by issue type, 300 ms apart, each with a small floating tag. Panel lines `cascade` in, and their numbers `count`.

| Issue | Visible cells | Highlight | Tag |
|---|---|---|---|
| Mixed date formats | A2, A4, A5, A7, A8, A9 | Amber outline | `5 date formats` |
| Duplicate row | Row 5 | Red tint | `Duplicate of row 4` |
| Merged cells | D2:D5, D7:D9 | Blue outline | `Merged cells` |
| Stray total | Row 6 | Red tint, dashed border | `Subtotal row` |
| Number stored as text | H3 | Purple outline | `Text, not a number` |
| Inconsistent labels | E3, E4, E5, E8, E9 | Gray dashed outline | `Inconsistent labels` |

**Panel:**

```text
Scanning 4,318 rows × 10 columns…
Found 6 kinds of problems:
• Dates in 5 formats: 1,204 cells
• Duplicate rows: 87
• Merged cells: 14 ranges, 312 blank cells
• Subtotal and total rows: 9
• Numbers stored as text: 236 cells
• Inconsistent product-line labels: 58 cells
```

#### Step 3 · 9.5–14.5 s · 5,000 ms

**Caption:** Cleaned and logged: 4,318 rows in, 4,222 out, tied to the books.

**On screen:**
- +0: rows 5 and 6 `strike` and collapse.
- +600 ms: D2:D5 and D7:D9 unmerge and fill down (`North` on the first three rows, `South` on the last three).
- +1,000 ms: dates rewrite to `YYYY-MM-DD` cell by cell (150 ms flip, 40 ms stagger).
- +1,600 ms: H3 converts from `$486.00 ` to `486.00` and becomes right-aligned.
- +1,900 ms: labels standardize: `Paper Goods` → `Paper goods`, `JANITORIAL` → `Janitorial`, `Safety/PPE` → `Safety & PPE`, `Pkg` → `Packaging`.
- +2,400 ms: the `Log` tab pops in, then the `Clean` tab pops in and becomes active. The panel checklist items `check` one by one, then the last two lines `fade` in.

**Panel:**

```text
Cleaned · every change logged
✓ 1,204 dates converted to YYYY-MM-DD
✓ 87 duplicate rows removed
✓ 14 merged ranges split, 312 cells filled down
✓ 9 subtotal rows removed
✓ 236 text values converted to numbers
✓ 58 labels standardized to 4 product lines
4,318 rows in → 4,222 rows out · 1,906 changes in the Log sheet
Revenue $5,379,900 · matches QuickBooks Q3 sales ($0 difference) ✓
```

**Status bar:** `Clean · 4,222 rows · Sum of Revenue: 5,379,900.00`

**Clean sheet, rows 1–7 visible** (columns K and L arrive in step 4):

| Row | A Date | B Invoice | C Customer | D Region | E Product line | F SKU | G Qty | H Revenue | I COGS | J Freight | K Gross margin | L GM % |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2 | 2026-07-01 | 10482 | Bayside Diner | North | Packaging | PK-1204 | 40 | 1,240.00 | 902.70 | 49.60 | 287.70 | 23.2% |
| 3 | 2026-07-01 | 10483 | Harvest Table Cafe | North | Paper goods | PG-3310 | 12 | 486.00 | 340.20 | 61.40 | 84.40 | 17.4% |
| 4 | 2026-07-01 | 10484 | Lakeview Grill | North | Janitorial | JN-2207 | 6 | 732.50 | 484.90 | 24.10 | 223.50 | 30.5% |
| 5 | 2026-07-02 | 10485 | Corner Slice Pizza | South | Paper goods | PG-3302 | 8 | 318.00 | 222.60 | 47.70 | 47.70 | 15.0% |
| 6 | 2026-07-02 | 10486 | Greenleaf Kitchen | South | Safety & PPE | SP-4410 | 20 | 644.00 | 437.90 | 19.30 | 186.80 | 29.0% |
| 7 | 2026-07-02 | 10487 | Maple Street Deli | South | Packaging | PK-1188 | 25 | 905.00 | 657.00 | 36.20 | 211.80 | 23.4% |

#### Step 4 · 14.5–19.5 s · 5,000 ms

**Caption:** Margin columns and a pivot, with real formulas your team can follow.

**On screen:** Columns K `Gross margin` and L `GM %` slide in from the right (300 ms). Cell K2 is selected and the formula bar shows `=H2-I2-J2`; values fill down (`cascade`, 60 ms). Then L2 is selected, the formula bar shows `=IFERROR(K2/H2,0)` (format 0.0%), and values fill down. +2,000 ms: the `Pivot` tab pops in and becomes active; its rows `cascade`. +3,200 ms: cell B5 is selected (2 px accent border), the formula bar shows the SUMIFS formula below, and B5 `pulse`s.

**Panel (added):**

```text
Built
✓ Gross margin, column K: =H2-I2-J2
✓ GM %, column L: =IFERROR(K2/H2,0)
✓ Pivot: gross margin by product line and month (SUMIFS, updates as rows are added)
```

**Formula bar for Pivot!B5 (exact):**

```text
=SUMIFS(Clean!$K:$K,Clean!$E:$E,$A5,Clean!$A:$A,">="&B$4,Clean!$A:$A,"<="&EOMONTH(B$4,0))
```

**Pivot sheet layout:** A4 holds `Product line`. B4:D4 hold the dates 2026-07-01, 2026-08-01 and 2026-09-01, formatted `mmm` so they display `Jul`, `Aug`, `Sep`. E4 holds `Q3`. Column E is `=SUM(B5:D5)` and so on; row 9 is `=SUM(B5:B8)` and so on. The second block starts at row 11 with the same columns; each of its cells divides gross margin by the matching SUMIFS on revenue (`Clean!$H:$H`).

Gross margin ($), rows 4–9:

| Product line | Jul | Aug | Sep | Q3 |
|---|---|---|---|---|
| Packaging | 143,300 | 153,100 | 159,900 | 456,300 |
| Janitorial | 150,100 | 154,000 | 155,600 | 459,700 |
| Paper goods | 90,200 | 83,900 | 73,800 | 247,900 |
| Safety & PPE | 66,300 | 67,000 | 61,900 | 195,200 |
| **Total** | **449,900** | **458,000** | **451,200** | **1,359,100** |

Gross margin %, rows 11–16:

| Product line | Jul | Aug | Sep | Q3 |
|---|---|---|---|---|
| Packaging | 23.4% | 23.6% | 23.2% | 23.4% |
| Janitorial | 30.1% | 30.6% | 30.4% | 30.4% |
| Paper goods | 22.4% | 20.5% | 18.6% | 20.5% |
| Safety & PPE | 29.0% | 28.4% | 25.6% | 27.7% |
| **Total** | **25.8%** | **25.5%** | **24.5%** | **25.3%** |

#### Step 5 · 19.5–24.0 s · 4,500 ms

**Caption:** Then it charts gross margin by product line, month by month.

**On screen:** The `Chart` tab pops in and becomes active. A clustered column chart `draw`s. Panel adds `✓ Chart: gross margin % by product line, Jul–Sep`.

**Chart spec:**
- Title: `Gross margin % by product line · Q3`
- X axis: `Jul`, `Aug`, `Sep` (one cluster per month, four bars per cluster in the order below).
- Y axis: 0% to 35%, gridlines at 0, 10, 20 and 30%.
- Colors: Paper goods in the primary accent; Safety & PPE in a secondary accent; Packaging and Janitorial in two neutral grays. Legend top-left.
- Data labels on the three Paper goods bars and on the September Safety & PPE bar.
- Annotation beside the August and September Paper goods bars: `Freight surcharges from Aug 4`.

| Series | Jul | Aug | Sep |
|---|---|---|---|
| Packaging | 23.4 | 23.6 | 23.2 |
| Janitorial | 30.1 | 30.6 | 30.4 |
| Paper goods | 22.4 | 20.5 | 18.6 |
| Safety & PPE | 29.0 | 28.4 | 25.6 |

#### Step 6 · 24.0–32.0 s · 8,000 ms

**Caption:** Plain-English findings, each with a fix and a dollar figure.

**On screen:** In the panel, the headline `stream`s. Finding cards `fade` in at +1,800, +3,400 and +5,000 ms; the total line at +6,400 ms. The chart highlights in sync: card 1 makes the Paper goods bars `pulse`; card 2 makes the September Safety & PPE bar `pulse`; card 3 adds a dashed outline to the Janitorial bars. At +7,000 ms the footer `Completed in 3 min 48 s` appears.

```text
What's going on

Sales grew 5.6% from July to September, but gross margin dollars barely moved (+0.3%). The margin rate fell from 25.8% to 24.5%. Two things explain the drop, and a third has been leaking all quarter.

1. Freight is eating Paper goods margin
Paper goods margin fell from 22.4% to 18.6% as freight rose from 7.6% to 11.4% of sales. Your carrier added fuel and small-shipment surcharges on Aug 4, and 46% of Paper goods deliveries are under 10 cases.
Cost vs. July's freight rate: $23,056 in Aug–Sep
Fix: add a $45 delivery fee on Paper goods orders under 10 cases (148 in September) and rebid the route with two carriers.

2. A supplier increase never reached your prices
Nitrile glove costs rose 9% on Aug 18, but sell prices didn't change. Safety & PPE margin slid from 29.0% to 25.6%.
Cost: $9,724 in Aug–Sep
Fix: raise prices on the 14 affected glove SKUs by 9% this week.

3. An expired promo is still discounting Janitorial
Six accounts still get 12% off list from a promo that ended in 2025. Their contract tier is 5%.
Cost: $14,000 in Q3, on $176,000 of sales
Fix: move the six accounts to the 5% tier at renewal.

Together: $46,780 of Q3 margin, about $28,000 a month at September's pace.
```

#### Step 7 · 32.0–36.5 s · 4,500 ms

**Caption:** Done in under 4 minutes, with every change logged for review.

**On screen:** The result card slides up; values `count`.

### Result card · Illustrative example

| Tile | Value | Label | Basis (one line) |
|---|---|---|---|
| Time | 36 min | Modeled time saved this run | The agent ran 3 min 48 s and Priya still reviews the Log, so we count 10% of a ~6-hr manual job, the measured rate for spreadsheet work (ai-23, ai-21). |
| Value | $46,780 | Q3 margin leaks found | Identified, not yet recovered: freight $23,056 + glove costs $9,724 + expired discount $14,000 (pnl-28, pnl-29). |
| Outcome | ~$28K a month | At stake at September's pace | Sep: freight $15,265 + gloves $8,227 + discount $4,667 (Q3's $14,000 ÷ 3), on a 25.3% margin (pnl-06, pnl-16). |

`COPY.md` §8.4 placeholders: `{manual_hours}` = 6 (manual baseline only; the copy must not present those 6 hours as saved: the modeled saving is ~36 min) · `{agent_minutes}` = 4 (the 3 min 48 s run, used only in the step 7 caption "Done in under 4 minutes"; the result card leads with the modeled saving instead, because a "4 min" tile read as "6 hours down to 4 minutes") · `{n}` = 3 · `{value}` = $46,780.

### Reduced-motion final state

- **Left:** the `Chart` tab is active and the chart is fully drawn; the tabs read `Raw · Clean · Log · Pivot · Chart`.
- **Right:** Priya's message and file chip; the cleaning checklist collapsed to one line, `Cleaned: 4,318 → 4,222 rows · 1,906 changes logged · ties to QuickBooks ✓`; the full `Built` list with its formulas plus the SUMIFS formula as a code line; the chart line; the full report; the footer `Completed in 3 min 48 s`.
- Result card below the window.

### Source data (for QA and the transcript; not shown on screen)

| Product line | Revenue Jul | Aug | Sep | COGS Jul | Aug | Sep | Freight Jul | Aug | Sep |
|---|---|---|---|---|---|---|---|---|---|
| Packaging | 612,400 | 648,900 | 689,300 | 444,600 | 469,800 | 501,800 | 24,500 | 26,000 | 27,600 |
| Janitorial | 498,700 | 503,200 | 511,800 | 331,600 | 332,100 | 338,800 | 17,000 | 17,100 | 17,400 |
| Paper goods | 402,600 | 409,300 | 397,800 | 281,800 | 286,500 | 278,500 | 30,600 | 38,900 | 45,500 |
| Safety & PPE | 228,300 | 236,100 | 241,500 | 155,200 | 162,000 | 172,400 | 6,800 | 7,100 | 7,200 |
| **Total** | **1,742,000** | **1,797,500** | **1,840,400** | **1,213,200** | **1,250,400** | **1,291,500** | **78,900** | **89,100** | **97,700** |

Gross margin = revenue − COGS − freight. Q3 revenue: 1,742,000 + 1,797,500 + 1,840,400 = 5,379,900.

---

## 3. Executive Assistant

### At a glance

| Field | Value |
|---|---|
| ID | `executive-assistant` |
| Title | Executive Assistant: an overflowing inbox becomes a short list |
| Promise | Triage, drafted replies, delegated tasks, a booked meeting and a finished deck, before the first coffee. |
| Business (fictional) | **Coppervale Electric Co.**, a commercial electrical contractor (service, tenant improvements, new construction). 25 employees. |
| Window title | `Mail · Coppervale Electric Co.`. Overlay window in step 6: `Q3_Operations_Review.pptx` |
| Runtime | 41.5 s · 8 steps |

### Personas

- **Mike Alvarez**, owner. It's his inbox.
- **Team:** Jorge Ramirez (operations manager), Theo Okafor (estimator), Lena Price (office manager), Kelly Brooks (project manager), Tasha Green (bookkeeper).
- **Senders:** Laura Chen (property manager, Oakmont Business Park); Greg Holt (facilities director, Pine Hollow Medical Plaza); Hilltop Electrical Supply; Northgate HOA Board; Amy Lindqvist (Bramford Insurance Advisors); Wire & Panel Weekly (newsletter).
- **{BRAND} Assistant**, the Executive Assistant Agent.

### Layout

- **Status chip** in the top bar: `Mon, Oct 5 · 7:30 am`. It changes to 7:31 (step 2), 7:32 (step 4), 7:33 (step 6) and 7:34 am (step 7).
- **Left rail, 20%:** `Inbox` with an unread badge (63 at the start), standard folders, and the triage categories that appear in step 2.
- **Center, 48%:** the message list. In step 3 it becomes a reading pane: the original email on top, the draft reply below.
- **Right, 32%:** panel `{BRAND} Assistant`: activity log, Tasks, calendar card and, at the end, the Morning briefing.
- **Overlay in step 6:** a presentation window, 70% of the window width, centered over the center and right panes, with a filmstrip of 6 thumbnails on the left and the active slide on the right.
- **Mobile:** the center pane fills the window. The left rail becomes a horizontal chip row (`Needs you 6`, `Customers 11`…). The Assistant panel becomes a bottom sheet showing the latest card. The deck overlay shows a 2 × 3 grid of thumbnails.

### Steps

#### Step 1 · 0.0–3.5 s · 3,500 ms

**Caption:** Monday, 7:30 am. The owner has 63 unread emails.

**On screen:** The window `fade`s in, inbox rows `cascade` (bold = unread) and the `Inbox 63` badge `pulse`s. Footer under the list: `+ 55 more unread`.

| Sender | Subject | Preview | Time |
|---|---|---|---|
| Laura Chen | East lot lights out + LED retrofit quote? | Hi Mike, about half the parking lot lights on the east side have been out since… | 6:58 am |
| Hilltop Electrical Supply | Delivery update: order #44817 | Due to a manufacturer delay, the 400A panelboard for Maple Court will now ship… | 6:41 am |
| Jorge Ramirez | Q3 review this week? | Can we do the Q3 ops review before Friday? Crew hours and the callback log are… | Sun 8:12 pm |
| Greg Holt | RFP: Pine Hollow Medical Plaza electrical services | We're inviting three firms to bid on our 2027 maintenance contract. Walk-through Thu at 10… | Sun 4:30 pm |
| Wire & Panel Weekly | Copper prices and 5 job-site safety tips | This week: what copper prices mean for Q4 bids… | Sat 6:00 am |
| Kelly Brooks | PTO request: Oct 19–23 | Hi Mike, I'd like to take Oct 19–23 off for my sister's wedding… | Fri 5:47 pm |
| Northgate HOA Board | Invoice #2291 | Our board approved payment for the clubhouse lighting but asked if we could split… | Fri 3:15 pm |
| Amy Lindqvist | Your GL & auto renewal: decision by Oct 9 | Renewal terms attached. Premium is $21,760/yr (+6%)… | Fri 11:02 am |

#### Step 2 · 3.5–8.5 s · 5,000 ms

**Caption:** The agent reads all 63 and sorts them by what each one needs.

**On screen:** Status chip → 7:31 am. Rows slide left into the category labels (300 ms each, 60 ms stagger); category counts `count`; the Inbox badge counts down from 63 to 6. The list re-renders as `Needs you · 6`, in this order: Laura Chen, Greg Holt, Hilltop Electrical Supply, Kelly Brooks, Northgate HOA Board, Amy Lindqvist. Panel log: `✓ Read 63 emails · 57 sorted, filed or archived · 6 need you`.

| Category | Count | What happens |
|---|---|---|
| Needs you | 6 | Stays in the inbox, in priority order |
| Customers | 11 | Labeled for the team |
| Team | 9 | Labeled; action items pulled out |
| Vendors & invoices | 10 | Labeled; invoices sent to Tasha's queue |
| Calendar | 4 | Invites and changes added to the calendar |
| Receipts & notifications | 9 | Filed |
| Newsletters & promos | 14 | Archived |
| **Total** | **63** | |

#### Step 3 · 8.5–15.5 s · 7,000 ms

**Caption:** It drafts replies in Mike's voice, using job history and his calendar.

**On screen:** Laura's email opens in the reading pane (`swap`). +700 ms: the draft `stream`s at 25 ms per word under the heading `Draft reply`. +3,400 ms: source chips `cascade` beside the draft. +4,200 ms: `Draft ready` chips appear on four other rows and a `Decision` chip on Amy's row, each with its sub-line.

**Original email:**

```text
From: Laura Chen, Property Manager, Oakmont Business Park
Subject: East lot lights out + LED retrofit quote?

Hi Mike, about half the parking lot lights on the east side have been out since Thursday, and tenants are noticing. Also, can you send the LED retrofit quote we talked about by Thursday? Laura
```

**Draft reply:**

```text
Hi Laura,

Thanks for flagging the east lot, and sorry for the trouble. Jorge will have a crew there tomorrow morning to get those lights back on.

On the LED retrofit: you'll have our quote by Wednesday, a day ahead of your deadline. One suggestion: add photocell and timer controls, since we logged 4 service calls on those fixtures last winter.

Would a 15-minute call on Wednesday at 2:00 pm work to go over it?

Thanks,
Mike
```

**Source chips:** `Service log: east-lot fixtures, 4 calls last winter` · `Open request: Oakmont LED retrofit quote` · `Calendar: Wed 2:00 pm free` · `Tone: matched to Mike's sent mail`

**Draft footer:** `Draft · not sent` with the buttons `Approve & send` and `Edit`.

**Other rows in Needs you:**

| Thread | Chip | Sub-line |
|---|---|---|
| Re: RFP: Pine Hollow Medical Plaza electrical services | Draft ready | Confirms Thursday's 10:00 am walk-through with Kelly. |
| Re: Delivery update: order #44817 | Draft ready | Asks for a firm ship date and whether another branch has the panelboard. |
| Re: PTO request: Oct 19–23 | Draft ready | Approves; Jorge covers Kelly's projects. No calendar conflicts. |
| Re: Invoice #2291 | Draft ready | Agrees to two payments of $2,430, due Oct 15 and Nov 15. |
| Your GL & auto renewal: decision by Oct 9 | Decision | $21,760/yr (+6%). Needs Mike by Fri, Oct 9. |

#### Step 4 · 15.5–21.0 s · 5,500 ms

**Caption:** Action items become tasks for the right people, with due dates.

**On screen:** Status chip → 7:32 am. The panel shows `Tasks · 5 new`; rows `cascade` (120 ms stagger), each with an initials avatar, the task, a due-date chip and a small `From:` line. Footer: `Posted to the team task board · each person notified`.

| Assignee | Task | Due | From |
|---|---|---|---|
| Jorge Ramirez | Send a crew to restore the east-lot lights at Oakmont Business Park | Tue, Oct 6 | East lot lights out + LED retrofit quote? |
| Theo Okafor | Oakmont LED retrofit quote, with a photocell and timer option | Wed, Oct 7 | East lot lights out + LED retrofit quote? |
| Lena Price | Get a firm ship date for the Maple Court panelboard; move the rough-in if needed | Mon, Oct 5 (today) | Delivery update: order #44817 |
| Kelly Brooks | Prep site notes for the Pine Hollow walk-through (Thu 10:00 am) | Wed, Oct 7 | RFP: Pine Hollow Medical Plaza electrical services |
| Tasha Green | Set up the two-payment plan for Northgate HOA invoice #2291 ($4,860) | Thu, Oct 8 | Invoice #2291 |

#### Step 5 · 21.0–25.5 s · 4,500 ms

**Caption:** Jorge asked for a Q3 review. It finds an hour that works for all six.

**On screen:** The calendar card `fade`s in; the three candidate slots `cascade`; the Thursday slot turns green; the event card drops in (translateY −8 px → 0, 250 ms). Then the log line and rule chip appear.

```text
Find a time · Q3 Operations Review · 60 min · 6 people
Tue 4:00 pm   4 of 6 free (Jorge, Theo: Maple Court site)
Wed 3:00 pm   5 of 6 free (Kelly: client meeting)
Thu 8:00 am   6 of 6 free · Booked
```

```text
Q3 Operations Review
Thu, Oct 8 · 8:00–9:00 am · Conference room + video link
Mike Alvarez, Jorge Ramirez, Theo Okafor, Lena Price, Kelly Brooks, Tasha Green
Attachment: Q3_Operations_Review.pptx (building…)
```

**Log:** `✓ Invites sent to 6 · replied to Jorge: "Booked for Thu 8:00 am. Deck to follow."` with the rule chip `Rule: internal scheduling replies can send without approval`.

#### Step 6 · 25.5–32.5 s · 7,000 ms

**Caption:** It builds the Q3 deck on the company template. Six slides.

**On screen:** Status chip → 7:33 am. The presentation overlay `fade`s in. Source chips across its top: `QuickBooks · Q3 P&L` · `Job management · hours, callbacks, inspections` · `Shared drive · crew hours (from Jorge)`. Thumbnails render one at a time, 800 ms each (300 ms shimmer, then content `fade`s in), and each appears large in the active-slide area as it completes. At the end the overlay shrinks back into the event card, whose attachment line becomes `Q3_Operations_Review.pptx · 6 slides ✓`.

| # | Slide title | What the thumbnail shows |
|---|---|---|
| 1 | Q3 Operations Review | Dark title slide on the company template: copper accent rule above the title, subtitle `Coppervale Electric Co. · July–September · Prepared Oct 5`, wordmark bottom-left. |
| 2 | Q3 at a glance | 2 × 2 KPI tiles: `Revenue $1.42M` (sub-line `+8% vs. Q3 last year`) · `Gross margin 31.5%` · `Service calls 486` · `Callback rate 1.2%`. |
| 3 | Revenue by segment | Horizontal bars, largest first: `Tenant improvements $604K` · `Service & maintenance $512K` · `New construction $231K` · `Lighting retrofits $71K`. Footnote `Total $1,418K`. |
| 4 | Field hours vs. budget | Clustered columns, actual vs. budget: Jul 3,020 vs 2,900 · Aug 3,140 vs 2,950 · Sep 2,860 vs 2,800. Callout: `Q3: 9,020 hrs, 4.3% over budget. August +6.4%: inspection delays and two open journeyman spots.` |
| 5 | Quality & safety | Three-row table: `Callbacks: 6 of 486 service calls (1.2%)` · `Failed inspections: 2 of 38` · `Recordable injuries: 0`. |
| 6 | Q4 priorities | Four bullets: `Submit the Pine Hollow bid by Oct 30` · `Hire 2 journeyman electricians` · `Raise service rates 4% on Jan 1` · `Get callbacks under 1%`. |

#### Step 7 · 32.5–37.5 s · 5,000 ms

**Caption:** By 7:34 am, Mike has a one-screen briefing and six decisions.

**On screen:** Status chip → 7:34 am. The Morning briefing card `swap`s into the Assistant panel; its lines `cascade`.

```text
Morning briefing · Mon, Oct 5 · 7:34 am
Inbox: 63 → 6 need you. 5 replies drafted for your OK.
Decide: insurance renewal, $21,760/yr (+6%), due Fri.
Delegated: 5 tasks to Jorge, Theo, Lena, Kelly and Tasha.
Booked: Q3 Operations Review, Thu 8:00 am. Deck attached.
Today: 10:00 am Maple Court site visit · 2:00 pm payroll review with Tasha.
Heads-up: the Maple Court panelboard is late; Lena is on it.
```

#### Step 8 · 37.5–41.5 s · 4,000 ms

**Caption:** Four minutes of agent time. Almost an hour back for Mike.

**On screen:** The result card slides up; values `count`.

### Result card · Illustrative example

| Tile | Value | Label | Basis (one line) |
|---|---|---|---|
| Time | 4 min | Agent time, 7:30 to 7:34 am | 63 emails (a Monday backlog; ~32 a day is typical, time-01), 5 replies drafted, 5 tasks, 1 meeting, 6 slides. |
| Value | 57 min back | Owner time, this morning | 57 emails handled at ~1 min each (time-03); deck and drafts still need his review, so not counted (ai-21); $65 at $68/hr (lab-01). |
| Outcome | 63 → 6 | Unread emails to decisions | 57 sorted, filed or archived; 5 of the 6 have replies waiting for approval (time-01: ~3 replies a workday). |

`COPY.md` §8.5 placeholders: `{n}` = 63 · `{needs_you}` = 6 · `{tasks}` = 5 · `{minutes}` = 57. The copy draft describes an operations manager; in this demo the inbox belongs to the owner, so use "him".

### Reduced-motion final state

- **Left rail:** all seven categories with their counts; `Inbox 6`.
- **Center:** Laura's email and the full draft, with source chips and the `Draft · not sent` footer.
- **Right:** the Morning briefing on top, the 5 tasks below it, then the booked event card with `Q3_Operations_Review.pptx · 6 slides ✓` and a row of the 6 slide thumbnails with their titles.
- Status chip: `Mon, Oct 5 · 7:34 am`. Result card below the window.

---

## 4. Marketing Director

### At a glance

| Field | Value |
|---|---|
| ID | `marketing-director` |
| Title | Marketing Director: ad waste found, tests run, cost per new patient down |
| Promise | Audits every campaign, runs its own experiments and moves budget to what works, inside the limits you set. |
| Business (fictional) | **Stillbrook Dental Group**, 4 offices (Northside, Eastgate, Lakeshore, Downtown), 52 employees. $24,000 of Google and Meta ads every 4 weeks. |
| Window title | `{BRAND} Marketing Director · Stillbrook Dental Group` |
| Runtime | 40.0 s · 8 steps |

### Personas

- **Dr. Elena Park**, owner. She set the guardrails and gets the weekly report.
- **Jess Morgan**, marketing coordinator. She approves new ad creative.
- **{BRAND} Marketing Director**, the agent.

### Layout

- **KPI strip** across the top: four tiles.
- **Main workspace, 68%:** tabs `Campaigns · Experiments · Budget · Trend`. The active tab changes as the steps progress.
- **Right, 32%:** the agent feed, with timestamped notes (`Week 1 · Audit`, `Week 2 · Fixes live`…). The Guardrails card is pinned at the top of the feed from step 1.
- **Mobile:** KPI tiles in a 2 × 2 grid; the campaign table shows Campaign, Spend, Cost per booking and Flag; the feed collapses to its latest note.

**Guardrails card** (pinned):

```text
Guardrails · set by Stillbrook
• Budget changes: max ±20% per campaign per week
• Weekly total stays at $6,000
• New ads use pre-approved claims; Jess approves new creative
• No patient data is sent to ad platforms
```

### Steps

#### Step 1 · 0.0–4.5 s · 4,500 ms

**Caption:** Stillbrook Dental: 4 offices, 6 campaigns, $24,000 every 4 weeks.

**On screen:** KPI tiles `count`; the `Campaigns` table rows `cascade`; the Flag column is empty. Feed: `Connected (read-only): Google Ads · Meta Ads · practice-management bookings`.

**KPI strip:** `Spend · last 28 days $24,000` · `New-patient bookings 141` · `Cost per booking $170` · `Est. ROAS 6.8x`

**Campaigns · last 28 days:**

| # | Campaign | Channel | Spend | Bookings | Cost per booking | Est. ROAS | Flag |
|---|---|---|---|---|---|---|---|
| 1 | Search · Dentist near me | Google | $6,400 | 40 | $160 | 5.0x | |
| 2 | Search · Emergency dentist | Google | $3,600 | 24 | $150 | 4.3x | |
| 3 | Search · Dental implants | Google | $5,200 | 13 | $400 | 9.0x | |
| 4 | Meta · $99 new-patient exam (video) | Meta | $4,200 | 30 | $140 | 5.7x | |
| 5 | Meta · Clear aligner consult | Meta | $2,800 | 14 | $200 | 10.0x | |
| 6 | Meta · Retargeting: site visitors | Meta | $1,800 | 20 | $90 | 8.9x | |
| | **Total** | | **$24,000** | **141** | **$170** | **6.8x** | |

**Footnote under the table** (small text):

```text
Booking = a new-patient appointment booked online or by phone. Est. ROAS = bookings × average first-year collections per new patient for that service ÷ spend (general $800, emergency $650, implants $3,600, clear aligners $2,000).
```

#### Step 2 · 4.5–10.5 s · 6,000 ms

**Caption:** It audits every campaign, search term and ad: 18% of spend is waste.

**On screen:** Feed: `Week 1 · Audit: 6 campaigns, 1,912 search terms, 14 ads · 6 min`. Flags appear on rows 3, 4 and 1, about 1,400 ms apart; each opens a detail popover that stays for about 1,200 ms, then docks as a chip. +4,800 ms: the total chip `fade`s in above the table: `Waste found: $4,364 per 4 weeks (18% of spend)`.

**Row 3 · flag `Broad-match waste`:**

```text
41% of spend ($2,132) matched searches that never book:
"dental implant school" $412
"free dental implants" $388
"dental implants overseas" $356
"implant dentist jobs" $301
"denture repair kit" $244
+ 38 more terms $431
```

**Row 4 · flag `Creative fatigue`:**

```text
Frequency 7.4. CTR down from 1.9% to 0.8% in 4 weeks.
Weekly cost per booking: $95.45 → $131.25 → $175.00 → $210.00
$1,336 spent above its week-1 cost per booking.
```

**Row 1 · flag `Out-of-area clicks`:**

```text
14% of clicks came from 15+ miles from any office. None of the 40 bookings did. $896.
```

#### Step 3 · 10.5–15.0 s · 4,500 ms

**Caption:** Fixes go live: 43 negative keywords, fresh creative, tighter radius.

**On screen:** Three fix lines `cascade` with `check`, then the approval line `fade`s in. Feed: `Week 2 · Fixes live`.

```text
✓ Implants: 43 negative keywords added; broad match → phrase match
✓ $99 exam: tired video paused; 3 new ads live
✓ Near me: 12-mile radius around each office; people in the area only
Approved by Jess Morgan · Mon 10:12 am · 3 changes logged
```

#### Step 4 · 15.0–20.0 s · 5,000 ms

**Caption:** Then it designs three experiments to find what books more patients.

**On screen:** The `Experiments` tab becomes active; three cards `cascade` (200 ms stagger). Feed: `Week 2 · 3 experiments live. A test wins at 90% probability or better.`

```text
A · Headline test · Google Search: Dentist near me (one ad group per office)
Current: "Family Dentist in Eastgate | New Patients Welcome"
New: "Same-Week Appointments | Most Insurance Accepted"
Split 50/50 · 3 weeks · Measure: cost per booking
```

```text
B · Audience test · Meta: $99 new-patient exam (new ads)
Current: adults 25–65 within 10 miles of an office
New: adults 25–65 within 5 miles of an office
Split 50/50 · 3 weeks · Measure: cost per booking
```

```text
C · Landing page test · Google Search: Dental implants
Current: homepage
New: implant consult page with price ranges, financing options and online booking
Split 50/50 · 3 weeks · Measure: cost per booked consult
```

#### Step 5 · 20.0–26.0 s · 6,000 ms

**Caption:** Three weeks later: no clear winner yet. Two tests keep running.

**On screen:** A `Week 4` stamp appears on the tab. Results table rows `cascade`, then the Decision chips `fade` in (amber for "Promising", gray for "No clear difference"; green is reserved for winners). Feed: `Week 4 · Results in`.

| Test | Current | New | Change in cost per booking | Probability new is better | Decision |
|---|---|---|---|---|---|
| A · Headline | $2,400 · 15 bookings · $160.00 each | $2,400 · 17 bookings · $141.18 each | −12% | 64% | Promising: run 3 more weeks |
| B · Audience | $1,575 · 11 bookings · $143.18 each | $1,575 · 11 bookings · $143.18 each | 0% | 50% | No clear difference: keep current |
| C · Landing page | $1,950 · 5 consults · $390.00 each | $1,950 · 6 consults · $325.00 each | −17% | 61% | Promising: run 3 more weeks |

**Footnote:** `Probability from bookings per dollar (Bayesian, flat prior). Winner threshold: 90%.`

#### Step 6 · 26.0–31.0 s · 5,000 ms

**Caption:** Budget moves to what works, never more than ±20% per week.

**On screen:** The `Budget` tab becomes active. The Week 5 column `count`s from the Week 4 values; increases tint green and decreases red, each with an arrow icon. Then the guardrail badge and the queued note `fade` in. Feed: `Week 5 · Budget moved`.

| Campaign | Week 4 | Week 5 | Change | Why |
|---|---|---|---|---|
| Search · Dentist near me | $1,600 | $1,920 | +20% | Lowest search cost per booking after the radius fix. Wanted +35%, capped. |
| Search · Dental implants | $1,300 | $1,460 | +12% | Negatives cut the waste; highest value per patient. Search volume limits more. |
| Meta · Clear aligner consult | $700 | $700 | 0% | Steady at 10.0x. |
| Search · Emergency dentist | $900 | $720 | −20% | Lowest value per new patient ($650). |
| Meta · $99 new-patient exam | $1,050 | $840 | −20% | Audience test: no clear difference. |
| Meta · Retargeting | $450 | $360 | −20% | Frequency 9.1; audience worn out. |
| **Total** | **$6,000** | **$6,000** | **0%** | |

```text
✓ All changes within ±20% · weekly total unchanged
Queued for week 6: Dentist near me +12.5% to $2,160 (guardrail)
```

#### Step 7 · 31.0–36.0 s · 5,000 ms

**Caption:** Week 8: cost per new patient is down from $171 to $154.

**On screen:** The `Trend` tab becomes active and the line `draw`s. Annotations `fade` in after the line passes them. The KPI strip `swap`s to Week 8 mode. The Week 8 report `stream`s into the feed.

**Chart spec:** Line chart, title `Cost per new-patient booking · weekly`. X axis: Week 1 to Week 8. Y axis: $0 to $200, gridlines at $0, $50, $100, $150 and $200. Point labels on Week 1 (`$171`) and Week 8 (`$154`). Bookings for each week appear as small muted numbers under the x-axis labels. Annotations: Week 1 `Audit`; Week 2 `Fixes live`; a shaded band over Weeks 2–4 labeled `Experiments`; Week 5 `Budget moved`; a bracket over Weeks 6–8 labeled `Weekly budget steps (±20% cap)`.

| Week | Spend | Bookings | Cost per booking |
|---|---|---|---|
| 1 | $6,000 | 35 | $171 |
| 2 | $6,000 | 36 | $167 |
| 3 | $6,000 | 36 | $167 |
| 4 | $6,000 | 37 | $162 |
| 5 | $6,000 | 37 | $162 |
| 6 | $6,000 | 38 | $158 |
| 7 | $6,000 | 38 | $158 |
| 8 | $6,000 | 39 | $154 |

**KPI strip, Week 8 mode:** `Spend · week 8 $6,000 (same)` · `Bookings 39 (+4 vs week 1)` · `Cost per booking $154 (−10%)` · `Waste found $4,364 per 4 weeks`

**Week 8 report:**

```text
Week 8 report · for Dr. Park
39 new-patient bookings at $154 each (week 1: 35 at $171). Same $6,000 a week.
What worked: cutting search waste and moving budget to the lowest cost per booking.
Still testing: the "Same-Week Appointments" headline and the implant consult page.
Next: a Saturday-hours message for Eastgate.
```

#### Step 8 · 36.0–40.0 s · 4,000 ms

**Caption:** Same budget. Four more new patients every week.

**On screen:** The result card slides up; values `count`.

### Result card · Illustrative example

| Tile | Value | Label | Basis (one line) |
|---|---|---|---|
| Waste found | $4,364 | Per 4 weeks, in a 6-minute audit | Broad-match terms $2,132 + tired creative $1,336 + out-of-area clicks $896: 18% of spend (mkt-19). |
| Cost per new patient | $171 → $154 | Week 1 vs. week 8 (−10%) | Fixed $6,000 a week; 35 → 39 bookings; matches a 10% modeled gain from 8 weeks of tuning (mkt-19, mkt-01). |
| Outcome | +4 a week | New patients, same budget | ≈ $5,120 contribution per 4 weeks: 16 patients × $800 first-year collections × 40% (cx-31, pnl-10). |

Extra footer line on this card: `Every budget move stayed within ±20% a week.`

`COPY.md` §8.6 placeholders: `{wasted_spend}` = $4,364 per 4 weeks (the copy draft says "a month"; say "per 4 weeks") · `{before}` = $171 · `{after}` = $154. The copy draft's "cost per booked inspection" becomes "cost per new patient".

### Reduced-motion final state

- **Main:** the `Trend` tab with the full chart and annotations; below the chart, the experiment results table in compact form (Test, Change, Probability, Decision).
- **KPI strip** in Week 8 mode.
- **Feed:** the Guardrails card and the Week 8 report.
- Result card below the window.

---

## 5. Sales Agent

### At a glance

| Field | Value |
|---|---|
| ID | `sales-agent` |
| Title | Sales Agent: one prospect, researched and written to properly |
| Promise | Finds firms that fit, does real homework, writes the email a thoughtful person would send, and sends nothing without approval. |
| Business (fictional) | **Parkline IT**, managed IT for small offices; 18 employees. Prospect: **Hollis & Grant**, a 22-person law firm. Same businesses and emails as `COPY.md` §6.3. |
| Window title | `{BRAND} Sales Agent · Parkline IT` |
| Runtime | 43.0 s · 9 steps |

### Personas

- **Sam Ortiz**, business development at Parkline IT. He approves every first email.
- **Dana Whitaker**, managing partner at Hollis & Grant (the prospect).
- **{BRAND} Sales Agent**.

### Layout

- **Left, 28%:** the ideal customer profile card on top, the prospect list below it.
- **Center, 44%:** the workspace: the dossier (step 3), then the draft (step 4).
- **Right, 28%:** checks and sending: the quality check (step 6), approval and schedule (step 7), the follow-up plan (step 8).
- **Step 5 comparison:** an overlay covering the center and right panes with two email mockups side by side, `Generic AI email` on the left and `Written by the Sales Agent` on the right, each with numbered markers. In step 6 it closes and Email B returns to the center.
- **Mobile:** single column. The profile collapses into chips; the list shows the top 3 plus the skipped line; the comparison stacks, with a toggle `Generic | Sales Agent`.

### Steps

#### Step 1 · 0.0–4.0 s · 4,000 ms

**Caption:** Parkline IT wants more law and accounting firms. First, the profile.

**On screen:** The profile card `fade`s in; its lines `cascade`.

```text
Ideal customer profile
Who: law and accounting firms with 10–50 staff
Where: within 40 miles of Riverside
Signals: recently expanded, or hiring for operations roles
Decision-maker: managing partner or firm administrator
Exclude: current clients, open deals, past opt-outs
```

#### Step 2 · 4.0–8.5 s · 4,500 ms

**Caption:** Matching firms, scored. Three are skipped: no real reason to write.

**On screen:** The stats line `fade`s in, then the rows `cascade`, then the muted skipped row. +2,800 ms: the Hollis & Grant row is selected and the `Why 94` popover opens beside it.

**Stats line:** `Searched 186 firms · checked against the CRM · 8 match`

| Fit | Firm | Type · size · distance | Signal |
|---|---|---|---|
| 94 | Hollis & Grant | Law · 22 staff · 6 mi | Opened a second office last month; hiring an office manager |
| 88 | Calder & Finch CPAs | Accounting · 31 staff · 12 mi | Posted an IT coordinator role |
| 85 | Ostrow & Pell | Law · 14 staff · 9 mi | Moving to a larger office in December |
| 81 | Marchbank Accounting Group | Accounting · 18 staff · 22 mi | New managing partner in August |
| 77 | Varga & Quist LLP | Law · 41 staff · 35 mi | Near the top of the size range |

**Skipped row (muted):** `3 more match the profile · skipped: no clear reason to write yet`

**Popover:**

```text
Why 94
✓ Law firm, 22 staff
✓ Main office 6 miles away; new office in Riverside
✓ Expanded: second office opened last month
✓ Hiring: office manager role includes IT
✓ Not a client, no open deal, no opt-out
```

#### Step 3 · 8.5–15.0 s · 6,500 ms

**Caption:** Deep research on the top prospect: five facts, each with a source.

**On screen:** The dossier `fade`s into the center pane. Fact rows `cascade` at 600 ms intervals, each ending with a `Verified` check; then the "Also checked" line and the agent note `fade` in.

**Header:** `Dossier · Hollis & Grant` / `Dana Whitaker · Managing partner` / `10-point check: 10 of 10 complete`

| # | Fact | Source | Use |
|---|---|---|---|
| 1 | Opened a second office in Riverside on Sep 8. | Company website · News page | In the email |
| 2 | Added two attorneys this year and plans to reach 30 staff by 2027. | Local news · County business journal, Sep 12 | Context |
| 3 | The office manager role includes "handling IT and vendor relationships." Posted Sep 29. | Job posting · Firm careers page | In the email, quoted |
| 4 | Managing partner since 2019; writes about running a two-office firm. | Professional profile | Shapes the tone |
| 5 | 22 people: 9 attorneys and 13 staff; 4 attorneys work from both offices. | Company website · Team page | Shapes the proof point |

```text
Also checked: not a client · no open deal · no opt-out · tools: Microsoft 365 (from the job post) · reviews: no recurring IT complaints · email address verified
Reason to write now: a new office, and IT just landed in an office manager's job. Offer the second-office checklist. No meeting request.
```

#### Step 4 · 15.0–21.0 s · 6,000 ms

**Caption:** An 89-word email built on what it found. Specific, no fluff.

**On screen:** The center pane `swap`s to the draft. The header lines `fade` in, then the body `stream`s at 20 ms per word. +3,600 ms: green markers 1–4 `cascade` onto the text, each with a short note (below).

**Email B, verbatim from `COPY.md` §6.3:**

```text
From: Sam Ortiz <sam@parklineit.example>
To: Dana Whitaker <dana@hollisgrant.example>
Subject: IT for the new Riverside office

Hi Dana,

Congratulations on opening the Riverside office last month.

I noticed the office manager role you posted includes "handling IT and vendor relationships." At a two-office firm, that usually turns into password resets, laptop setups and quietly wondering whether last night's backup ran.

We look after IT for 11 law and accounting offices in the county, including secure remote access for attorneys who split time between locations.

Would it help if I sent the one-page checklist we use when a firm opens a second office? No call needed.

Sam Ortiz
Parkline IT · 400 Example Avenue, Suite 2, Riverside
Not the right person, or not interested? Reply "no thanks" and I won't email again.
```

**Green markers (demo version; the Sales page shows all seven annotations):**
1. On "opening the Riverside office last month": `Firm news page, Sep 8`
2. On "handling IT and vendor relationships": `Job posting, Sep 29 (quoted)`
3. On "11 law and accounting offices": `From your approved claims list`
4. On "One-page checklist… No call needed.": `Useful first. No meeting request.`

#### Step 5 · 21.0–26.5 s · 5,500 ms

**Caption:** Next to a generic AI email: one could go to anyone. One couldn't.

**On screen:** The comparison overlay opens: Email B slides right (300 ms) and Email A `fade`s in on the left, already written (no streaming). +1,200 ms: red markers 1–4 `cascade` onto Email A. Email B keeps its green markers.

**Email A, verbatim from `COPY.md` §6.3:**

```text
Subject: Partnership opportunity for Hollis & Grant

Hi Dana,

I hope this email finds you well! I came across Hollis & Grant and was really impressed by your firm's commitment to excellence and client satisfaction.

At Parkline IT, we provide innovative, end-to-end managed IT solutions that help businesses like yours streamline operations, enhance security and drive growth. Our team of experts is passionate about delivering world-class service tailored to your unique needs.

I'd love to set up a quick 15-minute call to explore how we can add value to your organization. Are you available this Thursday or Friday?

Looking forward to connecting!

Best regards,
Sam
```

**Red markers:**
1. On "Partnership opportunity": `A pitch in the subject line`
2. On "I hope this email finds you well!": `Filler`
3. On "commitment to excellence": `Fits any firm. No research.`
4. On the whole email (marker in the corner): `No facts, no address, no opt-out`

#### Step 6 · 26.5–31.0 s · 4,500 ms

**Caption:** Every email passes five quality checks before anyone approves it.

**On screen:** The overlay closes and Email B returns to the center. In the right pane, checklist lines `cascade` with `check`, then `Ready for Sam's approval` `fade`s in.

```text
Quality check · 5 of 5 passed
✓ Personalization depth: 2 facts about Hollis & Grant, each linked to its source (minimum 2)
✓ Fact check: both facts match their sources; "11 law and accounting offices" is on your approved claims list
✓ Tone: plain and direct; no phrases from the cliché list; no meeting request
✓ Length: 89 words before the signature (limit 120)
✓ Compliance footer: sender, postal address and opt-out line included
Ready for Sam's approval
```

#### Step 7 · 31.0–35.0 s · 4,000 ms

**Caption:** Sam approves. It's scheduled for 7:40 am, Dana's time.

**On screen:** The approval card `fade`s in. +800 ms: `click` on `Approve`. +1,300 ms: the buttons collapse into the approved line, and the remaining lines `cascade`.

```text
Approval · every first email
[Approve]  [Edit]  [Skip]
✓ Approved by Sam Ortiz · Mon, Oct 12 · 4:12 pm
Scheduled: Tue, Oct 13 · 7:40 am (Dana's time zone)
Tuesday's queue: 9 of 20 (per-inbox daily cap)
Logged in the CRM: Hollis & Grant · Stage: Contacted
```

#### Step 8 · 35.0–39.0 s · 4,000 ms

**Caption:** Follow-ups are planned, and stop the moment she replies.

**On screen:** The follow-up plan `fade`s in below the approval card; its lines `cascade`.

```text
Follow-up plan · only if there's no reply
Day 3 · Fri, Oct 16: a two-line note in the same thread, with the second-office checklist attached
Day 9 · Thu, Oct 22: a new angle only if research finds one, such as the office manager hire
Day 14 · Tue, Oct 27: a short note to close the loop, then pause for 90 days
Stops on any reply, bounce or opt-out · each follow-up passes the same 5 checks · every touch logged in the CRM
```

#### Step 9 · 39.0–43.0 s · 4,000 ms

**Caption:** A researched, personal email in 90 seconds, sent with approval.

**On screen:** The result card slides up; values `count`.

### Result card · Illustrative example

| Tile | Value | Label | Basis (one line) |
|---|---|---|---|
| Time | ~6.5 min vs ~10 min | Sam's time per prospect, with review | Agent drafts in 90 s; Sam's checks keep a 35% saving on a 10-minute manual baseline (sales-11, ai-03). |
| Sources | 2/2 facts sourced | Every claim checked | Both facts link to the dossier (firm news page, Sep 8; job post, Sep 29); the proof point is on Parkline's approved claims list. |
| Outcome | 5/5 checks · 3 skipped | Quality before volume | 5 checks incl. the CAN-SPAM footer (sales-16) and Sam's approval; 3 matching firms skipped for lack of a reason. |

`COPY.md` §8.7 placeholders: `{manual_minutes}` = 10 (Sam's time with the agent: ~6.5) · `{agent_minutes}` = 1.5 (90 seconds of agent drafting) · `{n}` = 9 (Tuesday's queue) · `{skipped}` = 3.

### Reduced-motion final state

- **Left:** the profile card and the full prospect list, with Hollis & Grant selected and the skipped row visible.
- **Center:** Email B with its four green markers.
- **Right:** the quality check (5 of 5), the approved and scheduled card, and the follow-up plan.
- **Below the window, before the result card:** the comparison pair (Email A with red markers beside Email B with green markers) as a static figure.

---

## 6. Consulting

### At a glance

| Field | Value |
|---|---|
| ID | `consulting` |
| Title | Consulting: a P&L becomes a ranked plan |
| Promise | Finds where margin leaks, ranks the fixes by dollars and effort, and hands over a 90-day plan with owners. |
| Business (fictional) | **Larder & Flame Kitchen Co.**, two fast-casual restaurants (Elm Street and Harbor Road) and a catering kitchen. 40 employees, $3.6M revenue over the trailing 12 months. |
| Window title | `{BRAND} Consulting · Margin review · Larder & Flame Kitchen Co.` |
| Runtime | 38.0 s · 7 steps |

### Personas

- **Nina Castellano**, owner.
- **Carla Diaz**, bookkeeper. **Andre Moss**, kitchen manager. **Tyler Reed**, GM at Elm Street. **Simone Ward**, GM at Harbor Road. (They appear as owners in the roadmap.)
- **{BRAND} Consulting**, the agent.

### Layout

- **Left, 30%:** a panel that changes: `Sources` (steps 1–2), then `Findings` (steps 3–6).
- **Main, 70%:** a canvas whose title bar names the current view: `P&L · trailing 12 months` → `Opportunities` → `EBITDA margin` → `90-day roadmap`. Views change with `swap`.
- **Mobile:** single column. The left panel collapses into a chip row; the P&L shows the top 8 lines plus `Show all`; the waterfall keeps all 7 bars with short labels; the roadmap renders as a vertical list grouped by phase.

### Steps

#### Step 1 · 0.0–4.5 s · 4,500 ms

**Caption:** Larder & Flame: 2 restaurants, catering, 40 staff. The books go in.

**On screen:** Source rows `cascade`, each with `check`.

```text
Connected · read-only
✓ QuickBooks · P&L, trailing 12 months
✓ POS · sales by hour and item, 12 months
✓ Payroll · hours and overtime, 26 pay periods
✓ Vendor invoices · 214 invoices, 3,912 lines
✓ Contracts · produce and protein price agreements
✓ Delivery apps · 12 monthly statements
✓ Card processing · 12 monthly statements
✓ Utilities · 24 bills + interval meter data
```

#### Step 2 · 4.5–9.5 s · 5,000 ms

**Caption:** Every line of the P&L, with the invoices and statements behind it.

**On screen:** The P&L table `cascade`s in. Each cost line has a horizontal spend bar that `draw`s (scaled to the largest line, Labor). The EBITDA row `fade`s in last.

| Line | Annual | % of revenue |
|---|---|---|
| Revenue | $3,600,000 | 100.0% |
| Food & beverage cost | $1,116,000 | 31.0% |
| Labor (wages, taxes, benefits) | $1,152,000 | 32.0% |
| Occupancy (rent, CAM) | $288,000 | 8.0% |
| Delivery-app commissions | $162,000 | 4.5% |
| Packaging & supplies | $126,000 | 3.5% |
| Utilities | $108,000 | 3.0% |
| G&A and other | $101,520 | 2.8% |
| Card processing | $82,080 | 2.3% |
| Repairs & maintenance | $72,000 | 2.0% |
| Marketing | $54,000 | 1.5% |
| Insurance | $43,200 | 1.2% |
| Waste, linen & services | $36,000 | 1.0% |
| Software & subscriptions | $28,800 | 0.8% |
| **Total costs** | **$3,369,600** | **93.6%** |
| **EBITDA** | **$230,400** | **6.4%** |

#### Step 3 · 9.5–15.0 s · 5,500 ms

**Caption:** It traces each cost to its source: invoices, schedules, fees, meters.

**On screen:** The left panel `swap`s to `Findings`. Lines `cascade` at 800 ms intervals, each with `check`; as each appears, its P&L row `pulse`s (Food & beverage, Food & beverage, Labor, Delivery-app commissions, Card processing, Utilities).

```text
✓ Matched 3,912 invoice lines to contract prices: 23 items billed above contract, avg +6.8%
✓ Compared recipes with item sales and purchases: 5 top sellers over-portioned
✓ Mapped 26 pay periods to covers by hour: overtime 6.2% of hours; Mon–Wed 2–5 pm overstaffed
✓ Read 12 delivery-app statements: $648,000 in app sales at a 25% average commission
✓ Read 12 card statements: 2.85% effective rate on $2.88M of card sales; two quotes on file at 2.70%
✓ Read 24 utility bills with interval data: equipment on ~3 hrs before open; HVAC on overnight
```

#### Step 4 · 15.0–21.5 s · 6,500 ms

**Caption:** Five opportunities, ranked by dollars a year, with effort for each.

**On screen:** The canvas `swap`s to `Opportunities`. Rows `cascade` (150 ms stagger); the Identified and Counted values `count`; Effort shows as a pill (`Low`, `Medium`); the Total row `fade`s in last.

| # | Opportunity | Identified / yr | Counted (50%) | Margin (counted) | Effort | Time to impact | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | Food cost: enforce contract prices and portion specs | $28,800 | $14,400 | +0.40 pts | Medium | 30–60 days | 23 items billed above contract (avg +6.8%): $16,200. 5 top sellers over-portioned: $12,600. |
| 2 | Labor: schedule to forecast, cut overtime | $23,040 | $11,520 | +0.32 pts | Medium | 30–60 days | Overtime 6.2% → 4.8% of hours: $10,800. 680 overstaffed hours × $18 loaded: $12,240. |
| 3 | Delivery: move repeat app orders to direct ordering | $18,000 | $9,000 | +0.25 pts | Medium | 60–90 days | Shift $100,000 of $648,000 app sales from a 25% commission to ~7% all-in. |
| 4 | Energy: equipment schedule and HVAC setbacks | $5,040 | $2,520 | +0.07 pts | Low | 2 weeks | Fryers and ovens on ~3 hrs before open; HVAC on overnight. ~5% of $108,000. |
| 5 | Card processing: switch to interchange-plus | $4,320 | $2,160 | +0.06 pts | Low | 2–4 weeks | 2.85% → 2.70% on $2.88M of card sales; two quotes on file. |
| | **Total** | **$79,200** | **$39,600** | **+1.10 pts** | | | |

**Note under the table:** `Counted = half of identified, because each saving depends on your decisions or a negotiation. Revenue held at $3.6M; opportunities modeled independently.`

#### Step 5 · 21.5–27.5 s · 6,000 ms

**Caption:** EBITDA margin, counting half of each saving: 6.40% to 7.50%.

**On screen:** The canvas `swap`s to `EBITDA margin`. A waterfall `draw`s left to right: the first total bar, then each step bar floats up from the previous running total (accent color, `+` label above), then the final total bar. Connector lines join the bar tops.

**Chart spec:** Vertical waterfall, title `EBITDA margin · counted savings`. Y axis 0% to 10%, gridlines every 2%. Each step bar is labeled with its points and dollars (for example `+0.40 pts · $14,400`).

| Bar | Type | Change | Running margin | Running EBITDA |
|---|---|---|---|---|
| EBITDA margin today | Total | | 6.40% | $230,400 |
| Food cost | Step | +0.40 pts | 6.80% | $244,800 |
| Labor | Step | +0.32 pts | 7.12% | $256,320 |
| Delivery | Step | +0.25 pts | 7.37% | $265,320 |
| Energy | Step | +0.07 pts | 7.44% | $267,840 |
| Card processing | Step | +0.06 pts | 7.50% | $270,000 |
| Modeled EBITDA margin | Total | | 7.50% | $270,000 |

**Note under the chart:** `Counted savings only: half of each identified amount, on $3.6M revenue. If all five land in full: 8.60%.`

#### Step 6 · 27.5–33.5 s · 6,000 ms

**Caption:** A 90-day roadmap: quick wins first, an owner for every step.

**On screen:** The canvas `swap`s to `90-day roadmap`, a Gantt chart with three phase columns: `Days 1–30 · Quick wins`, `Days 31–60 · Core fixes`, `Days 61–90 · Grow direct`. Bars grow left to right (`draw`, 100 ms stagger); milestone diamonds at days 30, 60 and 90 `fade` in last, with their labels.

| Workstream | Owner | Days | Identified value |
|---|---|---|---|
| Switch card processing to interchange-plus | Nina C. + Carla D. | 1–21 | $4,320/yr |
| Equipment start-up schedule and HVAC setbacks | Tyler R. + Simone W. | 1–14 | $5,040/yr |
| Contract-price check on every invoice; claim credits | Andre M. + agent | 1–30, then ongoing | $16,200/yr |
| Portion specs and plating photos for 5 top sellers | Andre M. | 31–45 | $12,600/yr |
| Forecast-based schedules at both locations | Tyler R. + Simone W. + agent | 31–60 | $23,040/yr |
| Direct online ordering with a bag-insert offer | Nina C. | 61–90 | $18,000/yr |
| Weekly margin dashboard; day-90 review | Agent + Nina C. | 61–90 | Tracks all five |

**Milestones:** `Day 30: $25,560/yr in place` · `Day 60: $61,200/yr in place` · `Day 90: all five live · $79,200/yr identified ($39,600 counted)`

#### Step 7 · 33.5–38.0 s · 4,500 ms

**Caption:** $79,200 a year identified, with a plan and owners to capture it.

**On screen:** The result card slides up; values `count`.

### Result card · Illustrative example · Modeled estimate

| Tile | Value | Label | Basis (one line) |
|---|---|---|---|
| Time | 2 days vs ~8 weeks | Data to findings | Our estimate for data pull, analysis and review, vs a fast traditional provider for the same scope (cons-26, cons-31). |
| Value | $39,600/yr | Counted savings | Half of the $79,200 identified (pnl-15, pnl-18), because each depends on your decisions or a negotiation. |
| Outcome | 6.40% → 7.50% | EBITDA margin | EBITDA $230,400 → $270,000 on $3.6M, counting half; levers at base rates (pnl-19, pnl-22, pnl-25). |

`COPY.md` §8.8 placeholders: `{n}` = 5 · `{range}` = "$39,600 a year counted ($79,200 identified)". This demo doesn't model payback, so replace the copy draft's "Payback on the first three: {payback}" with "EBITDA margin: 6.40% → 7.50%".

### Reduced-motion final state

- **Main:** the waterfall on top and the ranked opportunities table below it.
- **Left:** the 90-day roadmap as a vertical list grouped by phase, with owners and the three milestones.
- Result card below the window.

---

## Appendix A. Arithmetic checks

Every number above was recomputed by script on 2026-10-12, and again after the benchmark calibration on 2026-10-13. Rounding is half-up from exact values. Key checks:

**Timing.** Step durations add up to each runtime: Customer Agent 43,000 ms; Analyst 36,500; Executive Assistant 41,500; Marketing 40,000; Sales 43,000; Consulting 38,000. Every caption is 70 characters or fewer.

**1 · Customer Agent**
- Quoted range $165–$265 = the low end of capacitor ($165–$245) to the high end of contactor ($185–$265). Midpoint (165 + 265) ÷ 2 = $215; gross profit at 40% = $86.00, shown as "about $86".
- Clock: first message 9:47 pm, booking 9:49 pm (2 minutes), handoff 9:50 pm. Tue Jul 14 and Wed Jul 15 fall on those weekdays in 2026.

**2 · Analyst Agent**
- Rows: 4,318 − 87 duplicates − 9 subtotal rows = 4,222. Log: 1,204 + 87 + 312 + 9 + 236 + 58 = 1,906 changes.
- Raw stray total: 1,240 + 486 + 732.5 + 732.5 = 3,191; COGS 902.7 + 340.2 + 484.9 + 484.9 = 2,212.7; freight 49.6 + 61.4 + 24.1 + 24.1 = 159.2.
- Clean rows: e.g. 1,240.00 − 902.70 − 49.60 = 287.70 (23.2%); 318.00 − 222.60 − 47.70 = 47.70 (15.0%).
- Monthly totals: Jul 1,742,000 − 1,213,200 − 78,900 = 449,900 (25.8%); Aug 1,797,500 − 1,250,400 − 89,100 = 458,000 (25.5%); Sep 1,840,400 − 1,291,500 − 97,700 = 451,200 (24.5%). Q3 gross margin 1,359,100 on 5,379,900 = 25.3%.
- Sales +5.6% (1,840,400 ÷ 1,742,000); gross margin dollars +0.3% (451,200 ÷ 449,900).
- Freight above July's rate (30,600 ÷ 402,600 = 7.60%): Aug 38,900 − 31,109.24 = 7,790.76; Sep 45,500 − 30,235.17 = 15,264.83; total $23,055.59 → $23,056.
- Glove cost above July's cost ratio (155,200 ÷ 228,300): Aug 1,497.50; Sep 8,226.54; total $9,724.05 → $9,724.
- Discount: $176,000 at 12% off = $200,000 list; at 5% off = $190,000; leak $14,000.
- Q3 total: 23,056 + 9,724 + 14,000 = $46,780. September pace: 15,265 + 8,227 + 4,667 ≈ $28,000 a month. Freight plus gloves explain 97% of September's shortfall versus July's margin rate ($23,491 of $24,113).

**3 · Executive Assistant**
- Categories: 6 + 11 + 9 + 10 + 4 + 9 + 14 = 63; 63 − 6 = 57 handled. Visible rows 8 + "55 more" = 63.
- Invoice #2291: $4,860 ÷ 2 = $2,430.
- Deck: segments 604 + 512 + 231 + 71 = $1,418K ($1.42M). Hours 3,020 + 3,140 + 2,860 = 9,020 vs 2,900 + 2,950 + 2,800 = 8,650 (+4.3%); August 3,140 ÷ 2,950 = +6.4%. Callbacks 6 ÷ 486 = 1.2%.
- Time: 57 emails handled × 1 min = 57 min (deck and drafts not counted); 57 ÷ 60 × $68 = $64.60 ≈ $65.
- Dates: Mon Oct 5 to Fri Oct 9 and Mon Oct 19 to Fri Oct 23 fall on those weekdays in 2026.

**4 · Marketing Director**
- Spend 6,400 + 3,600 + 5,200 + 4,200 + 2,800 + 1,800 = $24,000; bookings 40 + 24 + 13 + 30 + 14 + 20 = 141; blended cost per booking $170.21 → $170.
- Est. ROAS: 40 × 800 ÷ 6,400 = 5.0x; 24 × 650 ÷ 3,600 = 4.3x; 13 × 3,600 ÷ 5,200 = 9.0x; 30 × 800 ÷ 4,200 = 5.7x; 14 × 2,000 ÷ 2,800 = 10.0x; 20 × 800 ÷ 1,800 = 8.9x; total 162,400 ÷ 24,000 = 6.8x.
- Waste: 41% × 5,200 = 2,132 (412 + 388 + 356 + 301 + 244 + 431 = 2,132); 14% × 6,400 = 896; fatigue 4,200 − 30 × (1,050 ÷ 11) = 1,336.36. Total $4,364 = 18.2% of spend; search waste (2,132 + 896) ÷ 15,200 = 19.9% of search spend, under the 22% base (mkt-19). Fatigue weeks: 1,050 ÷ 11, 8, 6, 5 bookings (11 + 8 + 6 + 5 = 30).
- Experiments: 2,400 ÷ 15 = 160.00 vs 2,400 ÷ 17 = 141.18 (−11.8%); 1,575 ÷ 11 = 143.18 in both arms (0%); 1,950 ÷ 5 = 390.00 vs 1,950 ÷ 6 = 325.00 (−16.7%). Probability the new arm is better (Poisson–Gamma, flat prior, equal spend) = P(Binomial(kA + kB + 1, 0.5) ≤ kB): 63.6%, 50.0%, 61.3%. None reaches 90%, consistent with about 12% of tests winning (mkt-14, mkt-15).
- Budget: Week 4 and Week 5 both total $6,000; changes +320, +160, 0, −180, −210, −90 net to zero; percentages +20.0%, +12.3%, 0%, −20.0%, −20.0%, −20.0%. Queued step 1,920 × 1.125 = 2,160.
- Trend: 6,000 ÷ 35, 36, 36, 37, 37, 38, 38, 39 = $171.43, 166.67, 166.67, 162.16, 162.16, 157.89, 157.89, 153.85; week 1 to week 8 = −10.3% (base CPA reduction 10%, mkt-19); +4 bookings a week (+11.4%; base +11%).
- Outcome: 4 × 4 = 16 new patients per 4 weeks × $800 × 40% = $5,120.

**5 · Sales Agent**
- Email B: 89 words from "Hi Dana," through "No call needed." (limit 120).
- Value: 22 × $90 × 12 × 40% = $9,504 (MRR $1,980, inside the base $1,001–$2,500 band, sales-26). No longer on the result card, which shows "2/2 facts sourced" in its place.
- Time: 10 min × (1 − 35%) = 6.5 min of Sam's time per prospect.
- Dates: Mon Oct 12 (approval), Tue Oct 13 (send), Fri Oct 16 (day 3), Thu Oct 22 (day 9), Tue Oct 27 (day 14) fall on those weekdays in 2026.

**6 · Consulting**
- P&L: costs total $3,369,600; EBITDA 3,600,000 − 3,369,600 = $230,400 (6.40%). Displayed percentages add up to 93.6%.
- Card sales $2,880,000 + delivery-app sales $648,000 + cash and checks $72,000 = $3,600,000 revenue. Card processing 2.85% × 2,880,000 = $82,080; at 2.70% = $77,760; saving $4,320 (0.15% of card volume, the base). Delivery commissions 25% × 648,000 = $162,000; shifting $100,000 saves 18 points = $18,000.
- Food 16,200 + 12,600 = 28,800 (counted 14,400 = 0.40 pts, the base); labor 10,800 + 680 × 18 = 23,040 (counted 11,520 = 1.0% of labor, the base); energy 5,040 = 4.7% of 108,000 (base 5%). Identified 28,800 + 23,040 + 18,000 + 5,040 + 4,320 = $79,200; counted half = $39,600.
- Waterfall: 0.40 + 0.32 + 0.25 + 0.07 + 0.06 = 1.10 pts; 6.40% + 1.10 = 7.50%; $230,400 + $39,600 = $270,000 = 7.50% of $3.6M. Running totals 244,800; 256,320; 265,320; 267,840; 270,000. Full potential 230,400 + 79,200 = 309,600 = 8.60%.
- Roadmap: 4,320 + 5,040 + 16,200 = 25,560 by day 30; + 12,600 + 23,040 = 61,200 by day 60; + 18,000 = 79,200 by day 90.

## Appendix B. Name checks

- Searched the web on 2026-10-12 for exact matches to every invented business name used here: Cobalt Creek Supply, Coppervale Electric, Stillbrook Dental Group, Larder & Flame, Parkline IT, Hollis & Grant, Larkfield Plumbing, Alder Crossing, Wexley, Larchmere, Tarrow, Cinderhill, Bramford Insurance, Clearday Heating & Air. No real business with these exact names turned up. Re-check before launch.
- Rejected because real businesses use the name: Brightside Heating & Air (the example in the demo brief), Harborview Property Partners, Larkfield Dental, Fieldstone Landscape Group, Juniper Table.
- Other names (diners, property managers, vendors, firms on the prospect list) are deliberately generic, carry no city, and have no specific claims attached beyond the demo's own story.

## Appendix C. Suggested data shape (optional)

One file per demo, for example `src/data/demos/customer-agent.ts`, exporting:

```ts
export default {
  id: 'customer-agent',
  title: 'Customer Agent: a late-night chat becomes a booked job',
  windowTitle: 'Larkfield Plumbing & Air · Website chat',
  business: 'Larkfield Plumbing & Air',
  steps: [
    {
      caption: '9:47 pm. The office is closed. A homeowner opens the website chat.',
      duration: 3500,
      events: [
        { at: 0, type: 'fade', target: 'window' },
        { at: 600, type: 'dots', target: 'chat', ms: 700 },
        { at: 1300, type: 'stream', target: 'chat', from: 'agent', text: "Hi! I'm Larkfield's AI assistant. …" },
      ],
    },
    // …
  ],
  result: {
    label: 'Illustrative example',
    tiles: [{ value: '2 min', label: 'First message to confirmed booking', basis: '…' } /* … */],
  },
  finalState: { /* the reduced-motion frame */ },
};
```

The player derives the end state of any step by applying every event up to it, which gives step jumping, reduced motion and the transcript from the same data.

## Calibration changelog (2026-10-13)

Numbers-only pass against `BENCHMARKS.md` "Recommended model assumptions", base values. Structure, names and on-screen formats unchanged. Every result-card basis line now cites its source id. Dependent numbers recomputed by script (Appendix A).

| Demo | Old → new | Reason |
|---|---|---|
| Cross-file | Owner time $66/hr → $68/hr | Base loaded cost for owner/manager time (lab-01, lab-06). |
| 1 Customer | Larkfield gross margin 50% → 40%; gross profit ~$107 → ~$86 | Base HVAC/plumbing service-and-repair job margin is 40% (pnl-16). `SCENARIOS.md` §2.1 still says 50% and needs the same change. |
| 1 Customer | Phone booking ~6 staff min → ~5 | Base staff minutes per routine conversation (cx-34). |
| 1 Customer | $215 job value kept | Comes from Larkfield's own price book; inside the HomeAdvisor AC-repair range (cx-28). |
| 2 Analyst | Time tile "4 min vs ~6 hrs" → "4 min" run plus a modeled ~36 min saved; step 7 caption no longer says "about six hours" | Base time saving on data cleanup and recurring reports is 10% (ai-23, ai-21). A 99% saving is outside the evidence. |
| 2 Analyst | Leak figures, 25.3% margin kept | The business's own data; margin matches the 25% distributor base (pnl-06, pnl-16). |
| 3 Exec Assistant | ~3 hrs ($198) → 57 min ($65); caption "About three hours" → "Almost an hour"; `{minutes}` 180 → 57 | Deck time not counted: base saving on presentations is 5% (ai-21). Triage valued at the 1 min/email base (time-03), at $68/hr. Keeps the morning under the ~1.2 h/week email and 2.0 h/week admin bases. |
| 3 Exec Assistant | Slide 2 gross margin 27.4% → 31.5% | Was below the 30% conservative value for specialty trades; electrical contractors are 31.9% (pnl-16). |
| 4 Marketing | Near-me bookings 80 → 40 ($80 → $160); emergency 40 → 24 ($90 → $150); totals 197 → 141, $122 → $170, ROAS 8.5x → 6.8x | Old costs per booking were close to the dental CPL (~$73, mkt-01), which implies 90%+ lead-to-booking. Base booking rate is 40% (cx-25). |
| 4 Marketing | Experiments: 2 winners (−27%, −50%) → none at 90% (A −12% / 64%, B 0% / 50%, C −17% / 61%); caption and budget reasons updated | Base: 12% of tests win and a winner lifts ~5% (mkt-14, mkt-15, mkt-16). The old lifts were 5–10× the base. |
| 4 Marketing | Week 8 $95 (−22%) → $154 (−10%); bookings 49 → 63 changed to 35 → 39; +14/wk → +4/wk; contribution $17,920 → $5,120 per 4 weeks | Base CPA reduction from 60–90 days of optimization is 10% (+11% leads); −22% was above the 20% optimistic value (mkt-19). |
| 4 Marketing | KPI "Waste fixed" → "Waste found" | Base share of search spend you can cut without losing conversions is 6%, not the full 18% found (mkt-19). |
| 5 Sales | $150 → $90 per user per month; ~$15,840 → ~$9,500 | $150 was above the $145 optimistic value; base is $90 (sales-26). |
| 5 Sales | Time "90 s vs ~15 min" → "~6.5 min vs ~10 min" of Sam's time; `{manual_minutes}` 15 → 10 | Base manual time is 10 min per researched email; base AI time reduction with review is 35% (sales-11, ai-03). |
| 6 Consulting | Card processing 2.85% → 2.35% ($14,400) → 2.85% → 2.70% ($4,320) | Base saving is 0.15% of card volume (pnl-19, pnl-20, pnl-21). |
| 6 Consulting | Energy ~10% ($10,800) → ~5% ($5,040) | Base is 5% (pnl-22). Now ranks above card processing. |
| 6 Consulting | Food $39,600 → $28,800 (counted 0.55 → 0.40 pts) | Base food-cost gain is 0.4 pts of sales (pnl-18, pnl-15). |
| 6 Consulting | Labor $28,800 → $23,040 (OT 6.2% → 4.8%, 680 hrs) | Base: 1% of labor cost from scheduling (pnl-25) and 10% of overtime pay (pnl-26). |
| 6 Consulting | Totals $111,600 / $55,800 → $79,200 / $39,600; EBITDA 7.95% → 7.50%; full potential 9.50% → 8.60%; milestones $48,600 / $93,600 → $25,560 / $61,200 | Recomputed from the lines above. |
| 6 Consulting | Time "~4–6 weeks" → "~8 weeks"; "similar scope" → "the same scope" | Conservative time to recommendations from a traditional provider (cons-26, cons-31); wording follows DECISIONS.md. |
