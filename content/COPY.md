# Halyard website copy deck

Version 1.0 · 12 October 2026 · The complete copy for every page in the site map. Follows `BRIEF.md`, including its honesty rules.

---

## How to use this deck

- **Structure.** Pages follow the site map. Every section lists its `id`, Eyebrow, Headline, Subhead, Body, Cards or bullets, CTAs and Microcopy. "None" means the field is intentionally empty (a short reason follows where it isn't obvious).
- **Brand name.** Every "Halyard" maps to one config value (`brand.name`). No copy depends on the name except the single optional brand-story line in the footer (1.2), which should be dropped if the name changes.
- **Routes** are written from the site root (`/contact/`, `/results/#calculator`). The build must prefix the base path `/ai-agency-website/` through a base-aware helper. A bare `#anchor` is an in-page link.
- **Tokens** in braces come from config or data: `{contact.email}`, `{year}`, `{first_name}`. Demo result values (`{n}`, `{minutes}` and similar) come from the demo scripts.
- **Scenario numbers** live in `content/SCENARIOS.md`, written separately. This deck writes the framing around them and marks each slot as **[Scenario embed: ...]**. No outcome number in this deck competes with that file.
- **Labels.** Every figure shown on the site carries "Illustrative example" or "Modeled estimate" and links to `/results/#methodology`. Demos carry "Simulated demo".
- **Founder review.** Copy is written as final. Commitments that need the founder's confirmation (response times, durations, terms, ownership, security practices, compliance statements) are listed in Appendix A instead of being flagged inline, so no flag leaks into the build.
- **One deliberate exception.** Banned hype words appear only inside the voice guide (0.5), as examples of what not to write. The generic AI email on the Sales page (6.3) is bland on purpose but stays clear of the banned list.

### Section index

| Page | Route | Section ids, in order |
|---|---|---|
| Home | `/` | `hero`, `integrations`, `outcomes`, `services`, `demos`, `calculator`, `examples`, `process`, `why-us` (with `comparison`), `security`, `industries`, `faq`, `cta` |
| Services | `/services/` | `hero`, `where-to-start`, `services` (`ai-agents`, `marketing`, `sales`, `consulting`), `together`, `included`, `cta` |
| AI Agents | `/services/ai-agents/` | `hero`, `roles`, `customer-agent`, `analyst-agent`, `executive-assistant`, `demos`, `how-it-works`, `guardrails`, `worth`, `faq`, `cta` |
| AI Marketing Director | `/services/marketing/` | `hero`, `leaks`, `capabilities`, `demo`, `how-it-works`, `guardrails`, `worth`, `faq`, `cta` |
| AI Sales Agent | `/services/sales/` | `hero`, `problem`, `comparison`, `research`, `capabilities`, `quality`, `how-it-works`, `demo`, `deliverability`, `worth`, `faq`, `cta` |
| AI Consulting | `/services/consulting/` | `hero`, `what-we-look-at`, `capabilities`, `deliverables`, `how-it-works`, `comparison`, `demo`, `guardrails`, `worth`, `faq`, `cta` |
| Demos | `/demos/` | `hero`, `index`, `customer-agent`, `analyst-agent`, `executive-assistant`, `marketing-director`, `sales-agent`, `consulting`, `whats-real`, `cta` |
| Results | `/results/` | `hero`, `calculator`, `methodology`, `examples`, `proof`, `cta` |
| Approach | `/approach/` | `hero`, `principles`, `process`, `engagements`, `security`, `controls`, `what-we-need`, `faq`, `cta` |
| Contact | `/contact/` | `hero`, `form`, `what-happens-next`, `assessment`, `contact-details`, `faq` |
| 404 | `404` | `not-found` |

Demo ids are the same everywhere: `customer-agent`, `analyst-agent`, `executive-assistant`, `marketing-director`, `sales-agent`, `consulting`. On service pages, where a role section already uses one of those ids, demo tabs take a `demo-` prefix (for example `demo-customer-agent`).

---

## 0. Strategy

### 0.1 Positioning statement

For owners and operators of small and mid-size businesses who know AI could save them time and money but don't have the hours or the in-house expertise to make it work, Halyard is the done-for-you AI firm that designs, builds and runs AI agents inside the tools they already use. Unlike DIY AI tools, which leave the work to the team, or automation agencies, which hand over a workflow and move on, Halyard stays accountable for the result: agents shaped around how the business actually runs, people in control of every sensitive action, and progress reported in hours saved and dollars kept.

### 0.2 One-line value proposition

We build and run AI agents inside your business, so your team gets more done and you keep more of what you earn.

### 0.3 Tagline options

1. **AI that earns its keep.** (Primary until 2026-10-21. The home H1 and `site.tagline` are now **Wake up to finished work.**, from the Night shift hero; the home eyebrow and meta description say "for business", not "for small and mid-size businesses".)
2. Done-for-you AI, measured in hours and dollars.
3. Less busywork. More business.

**Why the primary.** It speaks the buyer's own language: an owner judges every hire and every tool by whether it earns its keep. It implies measurement and accountability without promising a number. It is four words, it reads well as an H1, and it works with any brand name.

**Where each one goes.** Tagline 1 is the home H1 and the footer line. Tagline 2 suits the meta description, the LinkedIn banner and proposal covers. Tagline 3 suits ads, social posts and event signage.

### 0.4 Elevator pitch (50 words)

Halyard is a done-for-you AI firm for small and mid-size businesses. We build and run AI agents that answer customers, work the numbers, clear inboxes, sharpen ad spend and fill the pipeline. We also find savings in your operations. You stay in control. Results are measured in hours and dollars.

### 0.5 Voice and tone

We sound like a calm, experienced operator who has done the work: plain words, short sentences, concrete verbs and numbers with labels. Confident, never loud. We write to owners and operators as peers ("you", "your team"), and we are candid about what AI can't do.

**Five traits:** plain-spoken, specific, confident, candid, and respectful of the reader's time and judgment.

**Five do's and don'ts**

| # | Do | Like this | Don't | Not this |
|---|---|---|---|---|
| 1 | Lead with the outcome for the reader. | "Every after-hours lead gets an answer in seconds." | Lead with the technology. | "Our LLM-powered conversational platform delivers omnichannel engagement." |
| 2 | Be specific. Name the task, the tool and the result. | "Reads your QuickBooks export and flags duplicate vendor payments." | Be vague or abstract. | "Optimize your financial workflows with intelligent automation." |
| 3 | Use short sentences and everyday words. | "We connect your inbox. The agent sorts the mail. You approve the replies." | Use hype or jargon. | "Unlock seamless, cutting-edge productivity." |
| 4 | Label every number and show the math. | "Illustrative example: 1.2 hours a week of email time × $29 an hour × 50 weeks = $1,740 a year." | Promise results or imply proof we don't have. | "Guaranteed 10x ROI." "Trusted by hundreds of businesses." |
| 5 | Respect the reader's judgment, and say what AI can't do. | "If AI isn't the right fix, we'll tell you on the first call." | Pressure, scare or talk down. | "Adapt or get left behind." |

**Word choices**

| Use | Instead of |
|---|---|
| use | leverage, utilize |
| connect, works with | seamless integration, plug-and-play |
| faster, in minutes, same day | supercharge, turbocharge |
| change, improve, fix | revolutionize, transform, disrupt |
| new, current | cutting-edge, state-of-the-art, next-gen |
| help, let you | empower, enable (as filler) |
| agent, assistant | bot (except when contrasting with chatbots) |
| your team, your people | resources, headcount (full-time equivalent only in the calculator) |
| results, savings, hours back | value-add, synergies |
| clear, simple | effortless, magic |

Never use: game-changer, unlock, in today's fast-paced world, world-class, best-in-class, robust, skyrocket, next level.

**Mechanics**

- Sentence case for headlines, eyebrows, buttons and navigation. Headlines end with a period or a question mark. Eyebrows and buttons don't.
- No em dashes or en dashes. Use a period, comma, colon or parentheses. Ranges read "2 to 4 weeks" in prose. Compact UI such as form options may use "5-19".
- US English. Numerals for numbers, except at the start of a sentence. Money as "$1,200". Percentages as "15%".
- Spellings: AI, email, e-commerce, mid-size, website, CRM, Excel, PowerPoint, QuickBooks, Google Ads, Meta Ads.
- "Set up" is the verb. "Setup" is the noun.
- Times: "9 p.m." in prose. "9:47 PM" inside product mockups.
- Serial comma only when it prevents confusion.
- Curly quotes and apostrophes in the build.
- Buttons start with a verb and say what happens: "Book a free AI assessment", "Watch the demo", "See the math".

**Honesty phrases we never write**

- "our clients", "clients love", "we've helped", "trusted by", "join hundreds of", or anything else that implies a client base.
- "proven", "guaranteed", "certified", "fully compliant", "industry-leading", "#1".
- Any statistic without its source next to it.
- Any figure without "Illustrative example" or "Modeled estimate" nearby.

### 0.6 Messaging pillars

**Pillar 1. Done for you, end to end.**
- *Promise:* We design, build, connect and run the agents. Your team gets the results, not another tool to learn.
- *Why it matters:* The scarcest thing in a small business is the owner's attention. DIY AI asks for more of it.
- *Proof points (capabilities and approach):*
  - We connect agents to the tools you already use: email, calendar, spreadsheets, QuickBooks or Xero, your CRM, ad accounts, phone and text.
  - Monitoring, tuning and upkeep are part of every ongoing engagement, not a separate ticket.
  - One named lead who builds and runs your agents. No handoff from a sales team to a support queue.
  - Your time commitment is defined up front: typically a couple of hours in the first week, then a short weekly check-in during the pilot.
- *Where it shows up:* Home hero, process and comparison; Services "included"; Approach.

**Pillar 2. Built around your business.**
- *Promise:* Agents learn your services, prices, policies, data and voice. No generic templates.
- *Why it matters:* Owners have watched generic chatbots embarrass other businesses. They want to know it will sound like them and know their rules.
- *Proof points:*
  - Discovery maps your real workflow with the people who do it today, before anything is built.
  - Agents answer only from knowledge you approve: FAQs, price book, policies.
  - Every agent is tested on your past work (recent chats, emails, spreadsheets) before it goes live.
  - Output follows your formats: your PowerPoint template, your spreadsheet layout, your tone of voice.
  - Sales emails are researched one prospect at a time. No reason to write, no email.
- *Where it shows up:* Service page capabilities, the Sales comparison, the demos.

**Pillar 3. You stay in control.**
- *Promise:* Clear limits, human approval where it matters and a record of everything.
- *Why it matters:* Data security and "what if it goes wrong" are the two biggest fears for this buyer.
- *Proof points:*
  - Least-privilege access, read-only by default.
  - Human approval for sensitive actions: payments, refunds, price changes, bulk sends.
  - Hard limits: spending caps, send limits, discount and refund ceilings.
  - Audit logs of every agent action.
  - Business-grade AI providers whose terms exclude training on your data.
  - An off switch for every agent. Autonomy grows step by step, and only when you approve it.
- *Where it shows up:* Home security; every service page's guardrails; Approach security and controls.

**Pillar 4. Measured in hours and dollars.**
- *Promise:* We agree on a baseline before we start and report against it every month.
- *Why it matters:* This buyer is ROI-driven and skeptical of AI hype. Activity counts don't impress them. Hours and dollars do.
- *Proof points:*
  - A baseline and a success measure are set in the Design phase, before the build.
  - Monthly reports cover hours saved, response times, cost per lead and margin, not just tasks run.
  - Pilots end with a results report and a go, adjust or stop recommendation.
  - Every number on the site is labeled as an illustrative example or a modeled estimate, with the math shown.
  - We say what isn't worth automating.
- *Where it shows up:* Results page, home examples and calculator, process, every "What it's worth" section.

### 0.7 Objection map

| # | Objection | What's behind it | How the site answers | Where |
|---|---|---|---|---|
| 1 | "AI is hype. Will it actually work in my business?" | Tools that demoed well and never stuck. | We show the work instead of adjectives: six demos of complete tasks, pilots on your own work with a success measure agreed up front, and plain talk about where AI doesn't fit. | Home `#demos`, `/demos/`, `/approach/#engagements`, Home FAQ 5 and 9 |
| 2 | "What does it cost, and will it pay off?" | No prices on the site. Fear of open-ended spend. | A savings calculator with visible assumptions, four worked examples with the math, a written scope and price before any work, and a pilot with a go/no-go decision. | `/results/`, Home `#calculator` and `#examples`, Home FAQ 6 |
| 3 | "Is our data safe?" | Customer records, financials and email are sensitive. Fear that AI trains on their data. | Plain practices: least privilege, read-only by default, approval for sensitive actions, audit logs, business-grade providers whose terms exclude training on your data, and written answers to security questionnaires. | Home `#security`, `/approach/#security`, Home FAQ 7 |
| 4 | "What if it says or does something wrong, in front of a customer or in our name?" | Brand and liability risk. | Answers only from approved knowledge, handoff and safety rules, approval queues, testing on past work, weekly quality reviews, an off switch, and a visible quality bar for outreach. | Each service page `#guardrails`, `/services/sales/#comparison`, `/approach/#controls`, Home FAQ 8 |
| 5 | "We don't have the time or the technical people for this." | Owner bandwidth is the scarcest resource. | Done for you, no new software, a defined time ask and one named lead. | Home `#outcomes` and `#process`, `/approach/#what-we-need`, Home FAQ 3 |
| 6 | "You're a new firm. Where are the case studies?" | Fear of being the experiment. | Candor: no invented proof. Demos, math and a measurable pilot instead, plus direct access to the people building it. | `/results/#proof`, Home FAQ 9, `/approach/#faq` |
| 7 | "Will this replace my people or upset my team?" | Loyalty to staff, morale, change fatigue. | Agents take the repetitive work so people handle the work that needs judgment. Clean handoffs. Help explaining the change to the team, and training included. | Home `#outcomes`, Home FAQ 4, `/approach/#what-we-need` |
| 8 | "We already tried ChatGPT or a chatbot. It didn't help." | DIY fatigue and past chatbot disappointment. | The comparison table shows the gap between a tool and a connected, monitored agent. Demos show agents acting inside real systems. Consulting tells you where AI fits first. | Home `#comparison`, Home FAQ 2, `/demos/` |

---

## 1. Global elements

### 1.1 Navigation

- **id:** `site-nav`
- **Logo text:** Halyard
- **Primary links:** Services · Demos · Results · Approach
- **Services menu (label, one-line description, route):**
  - AI Agents: Customer, Analyst and Executive Assistant agents for your customers and your team. → `/services/ai-agents/`
  - AI Marketing Director: Audits your ads, runs the tests and moves budget to what works. → `/services/marketing/`
  - AI Sales Agent: Researched, personal outreach that starts real conversations. → `/services/sales/`
  - AI Consulting: A ranked plan to cut costs and grow margin. → `/services/consulting/`
  - All services → `/services/`
- **Nav button:** "Book a free assessment" → `/contact/`
- **Mobile:** "Menu" / "Close menu"
- **Skip link:** "Skip to main content"

### 1.2 Footer

- **id:** `site-footer`
- **Brand line:** Done-for-you AI agents and consulting for small and mid-size businesses.
- **Tagline:** Wake up to finished work. (2026-10-21; was "AI that earns its keep.")
- **Column "Services":** AI Agents → `/services/ai-agents/` · AI Marketing Director → `/services/marketing/` · AI Sales Agent → `/services/sales/` · AI Consulting → `/services/consulting/`
- **Column "See it work":** Demos → `/demos/` · Results and examples → `/results/` · Savings calculator → `/results/#calculator`
- **Column "Company":** Approach → `/approach/` · Security and data → `/approach/#security` · Contact → `/contact/`
- **Footer CTA:** "Book a free AI assessment" → `/contact/`. Microcopy: 30 minutes. No cost, no obligation.
- **Contact line:** {contact.email}
- **Legal lines:**
  - © {year} Halyard. All rights reserved.
  - Figures on this site are illustrative examples or modeled estimates, not client results. "See how we estimate" → `/results/#methodology`
  - Product names are trademarks of their owners and are listed to show what we connect to. No partnership or endorsement is implied.
- **Optional brand-story line** (the only name-dependent copy on the site; drop it if the name changes): Why "Halyard"? On a sailboat, the halyard is the line that raises the sail. We help raise what your business can do.

### 1.3 Shared labels and badges

| Label | Where it appears | Tooltip or inline note |
|---|---|---|
| Illustrative example | Scenario cards, worked examples, hero mockup | Fictional business. Numbers are modeled to show how the math works. |
| Modeled estimate | Calculator output, scenario results, consulting impact | Calculated from the assumptions shown. Not a quote, a guarantee or a client result. |
| Simulated demo | Every demo player | A scripted simulation of how the agent works. The business, people and figures are fictional. |
| Fictional business | Any invented business name in a demo or scenario | Invented for illustration. Any resemblance to a real business is unintended. |
| See the math | Next to any figure | Links to the matching example on `/results/#examples` or to `/results/#methodology` |

### 1.4 Standard CTAs

| Use | Label | Route |
|---|---|---|
| Primary, everywhere | Book a free AI assessment | `/contact/` |
| Tight spaces (nav, mobile bar) | Book a free assessment | `/contact/` |
| Demos | Watch the demos | `/demos/` |
| Calculator | Estimate your savings | `/results/#calculator` |
| Examples | See the math | `/results/#examples` |
| Approach | See how we work | `/approach/` |

**Standard assessment microcopy:** Free 30-minute call. You get a written plan, whether or not you work with us.

### 1.5 Page titles and meta descriptions

Title pattern: "{Page} | Halyard". Descriptions stay under about 155 characters.

| Page | Title | Meta description |
|---|---|---|
| Home | Halyard \| Done-for-you AI for small and mid-size businesses | We build and run AI agents that answer customers, work your numbers, clear your inbox, tune your ads and find new clients. Book a free AI assessment. |
| Services | Services \| Halyard | AI Agents, an AI Marketing Director, an AI Sales Agent and AI Consulting. Designed, built, run and measured for you, inside the tools you already use. |
| AI Agents | AI Agents \| Halyard | Customer, Analyst and Executive Assistant agents that answer customers 24/7, do the spreadsheets and handle the inbox. Built and run for you. |
| AI Marketing Director | AI Marketing Director \| Halyard | An AI that audits your Google and Meta ads, cuts waste, runs its own tests and moves budget to what works, inside limits you set. |
| AI Sales Agent | AI Sales Agent \| Halyard | Prospecting that reads like a person did the homework: researched, personal emails sent in small batches, with deliverability and opt-outs built in. |
| AI Consulting | AI Consulting \| Halyard | An AI-powered review of your financials and operations that ranks savings, pricing and automation opportunities by value, effort and payback. |
| Demos | Demos \| Halyard | Six short simulations of AI agents doing real jobs: booking customers, building reports, clearing inboxes, testing ads, writing outreach and finding savings. |
| Results | Savings calculator and examples \| Halyard | Estimate what AI agents could save your business, then walk through worked examples with every assumption shown. Modeled estimates, not promises. |
| Approach | How we work \| Halyard | Prove it on one job, then scale what works. Our process, engagement models, security practices and the controls that keep your team in charge. |
| Contact | Book a free AI assessment \| Halyard | A free 30-minute call and a written summary of your top AI opportunities, ranked by value. No cost, no obligation. |
| 404 | Page not found \| Halyard | None (set the page to noindex). |

### 1.6 System microcopy

- Back to top: "Back to top"
- External links (screen reader suffix): "(opens in a new tab)"
- Loading: "Loading..."
- Calculator without JavaScript: "Turn on JavaScript to use the calculator, or email your numbers to {contact.email} and we'll run them for you."
- Demos without JavaScript: "This demo needs JavaScript. Here's the step-by-step version instead." (Show the caption list from section 8.)
- Reduced motion (demo players): "Motion is reduced, so every step is shown at once. Press Play to step through them one at a time."

---

## 2. Home `/`

**Page job:** tell the whole story in one scroll and move the visitor to a free assessment. Section order follows the brief.

### 2.1 Hero

- **id:** `hero`
- **Eyebrow:** AI agents and consulting for small and mid-size businesses
- **Headline (H1):** Wake up to finished work. (2026-10-21; was "AI that earns its keep.")
- **Subhead:** Halyard builds and runs AI agents that answer your customers, work your numbers, clear your inbox, tune your ads and find your next clients. They work inside the tools you already use, and your people stay in control.
- **Body:** None. The hero stays tight.
- **Bullets (proof chips under the subhead):**
  - Built and run for you
  - Works with the tools you have
  - Human approval where it matters
  - Measured in hours and dollars
- **CTAs:**
  - Primary: "Book a free AI assessment" → `/contact/`
  - Secondary: "Watch the agents work" → `#demos`
- **Microcopy (under the buttons):** Free 30-minute call. You get a written plan, whether or not you work with us.
- **Hero visual copy** (product mockup titled "Agent activity", badge "Illustrative"):
  - Customer Agent · 9:47 PM · Booked a furnace inspection for Thu, 8 to 10 AM. Confirmation sent by text.
  - Executive Assistant · 7:15 AM · Inbox sorted: 6 need you, 3 tasks assigned, 11 replies drafted for approval.
  - Analyst Agent · 7:30 AM · Weekly numbers are ready. Freight costs rose on 3 product lines. Summary is in your inbox.
  - Marketing Director · Mon · Paused 14 search terms with no conversions. Moved budget to your best campaign, within your cap.
  - Sales Agent · 10:05 AM · Researched 12 prospects. 9 emails ready for review. 3 skipped: no clear reason to reach out.
  - Consulting · Fri · Savings roadmap updated: 3 opportunities ranked by payback.

### 2.2 Integrations strip

- **id:** `integrations`
- **Eyebrow:** Works with your tools
- **Headline:** Works inside the tools your team already uses.
- **Subhead:** No new system to learn. Agents connect to your email, calendar, spreadsheets, books, CRM, ad accounts and phone lines, and do the work where it already happens.
- **Body:** None.
- **Bullets (16 names in plain text, no logos):** Gmail · Outlook · Excel · Google Sheets · PowerPoint · QuickBooks · Xero · Shopify · HubSpot · Salesforce · Google Ads · Meta Ads · Slack · Microsoft Teams · Google Calendar · Stripe
  - Swap-ins if a layout or an industry page needs them: Square, Calendly, Zoom, Pipedrive, Mailchimp, Klaviyo, Jobber, Google Business Profile, Asana, Trello, SharePoint, Dropbox, Zendesk, Twilio.
- **CTAs:** None. The strip stays quiet.
- **Microcopy:** Plus most tools with an API or a clean export. Product names are trademarks of their owners and are listed to show what we connect to, not a partnership or endorsement.

### 2.3 Outcomes

- **id:** `outcomes`
- **Eyebrow:** What changes
- **Headline:** Same team. More gets done.
- **Subhead:** Agents take the repetitive work off your plate and your team's. Here's what changes day to day once they're running.
- **Body:** None.
- **Cards, group 1, "For you":**
  1. **Every lead gets an answer, even at 9 p.m.** The Customer Agent replies in seconds, books routine jobs and passes the rest to your team with the full conversation.
  2. **You know your numbers, and what to do next.** A plain-English summary every week, plus a ranked list of where to save and where to grow.
  3. **Ad spend goes where it works.** Waste gets cut and budget shifts to what brings in customers, inside limits you set.
  4. **Prospecting keeps moving without another hire.** Researched, personal emails go out every week, and the replies land in your inbox.
- **Cards, group 2, "For your team":**
  1. **Inboxes stay under control.** Mail gets sorted, routine replies get drafted and action items land on the right person's list.
  2. **No more retyping between systems.** Details move from email to spreadsheet to CRM without copy and paste.
  3. **Reports are ready before the meeting.** Spreadsheets, charts and decks get built and refreshed on schedule.
  4. **People handle the conversations that need people.** Agents take the routine questions and pass the rest along with full context, so nobody starts from scratch.
- **CTAs:** "See the four services" → `#services`
- **Microcopy:** Agents handle the routine. People handle the judgment calls.

### 2.4 Services

- **id:** `services`
- **Eyebrow:** Services
- **Headline:** Four ways to put AI to work.
- **Subhead:** Start with the one that pays off fastest and add the next when you're ready. One team designs, builds, runs and measures all of it.
- **Body:** None.
- **Cards (4):**
  1. **AI Agents.** An AI staff for your customers and your team: a Customer Agent that answers and books around the clock, an Analyst Agent that does the spreadsheets, and an Executive Assistant that runs your inbox.
     - Answers chat, text, email and calls
     - Cleans data and builds workbooks, charts and dashboards
     - Triages email, assigns tasks and builds decks
     - Link: "Explore AI Agents" → `/services/ai-agents/`
  2. **AI Marketing Director.** Audits every ad you run, finds the waste, tests new ideas on its own and moves budget to what's working, inside limits you set.
     - Google, Meta and more, tied to real leads and sales
     - Experiments with a hypothesis and a stopping rule
     - A plain-English report every week
     - Link: "Explore the Marketing Director" → `/services/marketing/`
  3. **AI Sales Agent.** Finds businesses that fit your ideal customer, researches each one and writes a short, specific email a thoughtful person would be proud to send.
     - Real research on every prospect
     - A quality check before anything sends
     - Deliverability and opt-outs built in
     - Link: "Explore the Sales Agent" → `/services/sales/`
  4. **AI Consulting.** An AI-powered review of your financials and operations that ranks where to cut costs, fix pricing and automate first, with savings and payback for each.
     - Margin by job, product and customer
     - Opportunities ranked by value and effort
     - A 90-day plan you can act on
     - Link: "Explore AI Consulting" → `/services/consulting/`
- **CTAs:** "Compare all services" → `/services/`
- **Microcopy:** Not sure where to start? That's what the free assessment is for. → `/contact/`

### 2.5 Demos

- **id:** `demos`
- **Eyebrow:** See it work
- **Headline:** Don't take our word for it. Watch the work.
- **Subhead:** Six short simulations, one per job. Each follows an agent from the first message to the finished result, including the checks and handoffs we build in.
- **Body:** Press play, pause anytime or skip to the end. Each demo closes with the time and money that task would save in the example.
- **Cards (demo tabs; full scripts in 8.3 to 8.8):**
  1. **Customer Agent.** A late-night website chat becomes a booked job.
  2. **Analyst Agent.** A messy export becomes clean data, a chart and a plain-English answer.
  3. **Executive Assistant.** An overflowing inbox becomes a short list, plus tasks, a meeting and a deck.
  4. **Marketing Director.** An ad account audit finds the waste, launches tests and moves budget.
  5. **Sales Agent.** One prospect gets researched and written to properly, next to a generic AI email.
  6. **Consulting.** A P&L becomes a ranked list of savings and a roadmap.
- **CTAs:** "See all six demos" → `/demos/`
- **Microcopy:** Simulated demos. Businesses, people and figures are fictional and illustrative.

### 2.6 Savings calculator

- **id:** `calculator`
- **Eyebrow:** Estimate your savings
- **Headline:** What are your team's hours worth?
- **Subhead:** Answer four quick questions. We'll estimate the time and money agents could give back each month, using conservative assumptions you can see and change.
- **Body:** It's a starting point, not a quote. On the free assessment we size it task by task with your real numbers.
- **Bullets (compact version; full labels and helper text in 9.2):**
  - Inputs: People who'd work with agents · Hours per person per week on repetitive work · Average hourly cost · Share an agent could take on
  - Outputs: Hours back per month · Estimated monthly value · Capacity freed
- **CTAs:**
  - "Open the full calculator" → `/results/#calculator`
  - "Get a tailored estimate" → `/contact/`
- **Microcopy:** Modeled estimate, before our fees. Not a quote, a guarantee or a client result. "How we estimate" → `/results/#methodology`

### 2.7 Illustrative examples

- **id:** `examples`
- **Eyebrow:** Illustrative examples
- **Headline:** What it could be worth, with the math shown.
- **Subhead:** Four worked examples, one per service. Each uses a fictional business and conservative assumptions, and every line of math is on the page.
- **Body:** None.
- **Cards:** **[Scenario embed: SCENARIOS.md, one summary card per service: AI Agents, AI Marketing Director, AI Sales Agent, AI Consulting.]** Card anatomy: "Illustrative example" badge · service name · fictional business type and size · headline figure with its period ("per month" or "per year") · one line on how it adds up · link "See the math" → `/results/#examples`
- **CTAs:** "See every example and assumption" → `/results/#examples`
- **Microcopy:** Illustrative examples with fictional businesses. Modeled estimates, not client results.

### 2.8 Process

- **id:** `process`
- **Eyebrow:** How it works
- **Headline:** Start small. Prove it. Then scale.
- **Subhead:** Every engagement follows the same four steps. We prove value on one job, with your team in control, before anything expands.
- **Body:** None.
- **Cards (4 steps):**
  1. **Assess.** Free. We learn how your business runs and where the hours go, then send your top opportunities, ranked by value. *Timing: typically a 30-minute call, with a written summary in about 3 business days.*
  2. **Design.** We map the workflow, set the guardrails and agree on a baseline and a success measure. *Timing: typically 1 to 2 weeks.*
  3. **Build and pilot.** We connect your tools, test on your past work, then go live with approvals switched on. *Timing: typically 3 to 6 weeks.*
  4. **Run and improve.** We monitor, tune and report in hours and dollars. Agents take on more only when you approve it. *Timing: ongoing, with a monthly review.*
- **CTAs:** "See our full approach" → `/approach/`
- **Microcopy:** Timelines depend on scope and on how quickly we can get access to your tools.

### 2.9 Differentiators and comparison

- **id:** `why-us` (the table inside it: `comparison`)
- **Eyebrow:** Why Halyard
- **Headline:** The difference is who does the work.
- **Subhead:** AI tools give you capability. Agencies give you a workflow. We give you a working result, and we stay accountable for it.
- **Body:** None.
- **Cards (4):**
  1. **Outcomes, not logins.** You get finished work inside the tools you already use. No new system for your team to learn.
  2. **Built for your business.** Agents learn your services, prices, policies and voice, and prove themselves on your past work before they go live.
  3. **People in control.** You set the approval rules and the hard limits. Agents earn more autonomy only when the results justify it.
  4. **Accountable for results.** We agree on a baseline up front and report against it every month, in hours and dollars.
- **Comparison table** (caption: "How the options compare"):

| | DIY AI tools | Generic automation agency | Halyard |
|---|---|---|---|
| Who does the work | You and your team, in spare moments | They build it, then hand it over | We build it, run it and keep it working |
| Fit to your business | Generic prompts and templates | Prebuilt workflows, lightly adapted | Designed around your process, data, prices and voice |
| Connection to your systems | Copy and paste between apps | Point-to-point automations that need upkeep | Connected to your email, books, CRM and ad accounts, and monitored |
| Quality control | You check everything yourself | Tested at launch | Tested on your past work and reviewed every month |
| Human approval | Up to you | Varies by project | Built in for every sensitive action |
| What gets measured | Hard to say | Activity: tasks run, emails sent | Hours and dollars against an agreed baseline |
| Strategy | You decide what to try | They build what you ask for | We tell you what's worth automating, and what isn't |
| When something breaks | You troubleshoot | A new ticket or change order | We monitor and fix it as part of the work |

- **CTAs:** "See how we work" → `/approach/`
- **Microcopy (under the table):** DIY tools are a good fit for one person's tasks. They get harder when the work spans systems, people and customers. That's where we come in.
- **Consulting teaser (one paragraph, under the microcopy):** Thinking about hiring a consultant first? For the same core deliverable, a diagnostic plus a prioritized roadmap, a traditional review from an independent consultant or regional firm is modeled at about $15,600 or more, larger firms cost several times that, and recommendations commonly take 8 weeks or longer. Our AI Consulting covers the same scope typically in 3 to 5 weeks, at a fraction of the cost, because AI does the reading and the modeling and a person checks every finding. Link: "Compare the options" → `/services/consulting/#comparison`. Label: Modeled estimate.

### 2.10 Security and trust

- **id:** `security`
- **Eyebrow:** Security and control
- **Headline:** Your data stays yours. Your people stay in charge.
- **Subhead:** Giving an agent access to your business is like handing over a key. Here's how we handle it.
- **Body:** None.
- **Cards (6):**
  1. **Least-privilege access.** Agents get only the access a job needs, read-only by default. We remove access that's no longer needed.
  2. **Human approval for sensitive actions.** Payments, refunds, price changes, bulk sends and anything else you choose wait for a person to say yes.
  3. **Audit logs.** Every action an agent takes is recorded: what it did, when and why.
  4. **Business-grade AI providers.** We build on business-grade AI services whose terms exclude training on your data.
  5. **Only the data a job needs.** We connect what a workflow requires and nothing more, and we don't keep copies we don't need.
  6. **An off switch you control.** Pause or turn off any agent at any time. Your team picks up right where it left off.
- **CTAs:** "Read how we handle data" → `/approach/#security`
- **Microcopy:** We describe our practices plainly instead of pointing to badges. Have a security questionnaire? Send it over and we'll answer in writing.

### 2.11 Industries

- **id:** `industries`
- **Eyebrow:** Industries
- **Headline:** Made for local businesses and growing mid-size companies.
- **Subhead:** If your team juggles customers, paperwork and numbers, there's work an agent can take on. A few examples:
- **Body:** None.
- **Cards (8):**
  1. **Home services.** HVAC, plumbing, roofing and electrical. Answer every call and chat, book jobs after hours and follow up on open estimates.
  2. **Dental, medical and vet practices.** Answer routine questions, book and confirm appointments and fill cancellations from the waitlist, so the front desk can focus on the people in the room.
  3. **Law and accounting firms.** Client intake, document prep, inbox triage and deadline tracking, with professional review on anything that leaves the firm.
  4. **Real estate teams.** Answer every inquiry in minutes, qualify buyers and sellers, and keep showings and follow-ups on track.
  5. **Restaurants and hospitality.** Reservations, catering and event inquiries, review replies and weekly food and labor cost reports.
  6. **Retail and e-commerce.** Order and return questions, product data cleanup, ad testing and inventory reports.
  7. **Distribution and light manufacturing.** Quotes and order entry from email, inventory analysis and margin by product and customer.
  8. **Agencies and professional services.** Proposals, client reporting, utilization tracking and new-business outreach.
- **CTAs:** "Talk through your business" → `/contact/`
- **Microcopy:** Don't see your industry? Fitness studios, multi-location service businesses and many others fit too. We start from how your business runs, not from a template. Handle patient, client or financial records? We agree what agents can see with you, and your compliance lead, before anything connects.

### 2.12 FAQ

- **id:** `faq`
- **Eyebrow:** FAQ
- **Headline:** Straight answers to common questions.
- **Subhead:** Don't see yours? Ask us on the free assessment call.
- **Body:** None.
- **Bullets (10 Q&As):**
  1. **What does Halyard actually do?**
     We design, build and run AI agents inside your business. They answer customers, work your numbers, handle your inbox, manage your ads and do your prospecting, using the tools you already have. We also review your operations and show you where AI and better processes will save the most. You get the results. We handle the setup and the upkeep.
  2. **How is this different from using ChatGPT ourselves?**
     Chat tools are good at helping one person with one question. An agent does a job. It's connected to your systems, follows your rules, takes action (books the appointment, updates the spreadsheet, logs the email) and knows when to hand off to a person. We build it, test it on your past work and keep it running.
  3. **Do we need technical staff or new software?**
     No. We do the technical work, and agents work inside the tools you already use, like Gmail or Outlook, Excel, QuickBooks and your CRM. What we need is a decision-maker who can arrange access and review the agent's early work: typically a couple of hours in the first week, then a short weekly check-in during the pilot.
  4. **Will AI replace my employees?**
     No. We design agents to take specific, repetitive tasks, not whole jobs: the same questions, the copy and paste, the weekly report. That gives your people time for customers, judgment calls and growth. You can use the hours to take on more work without hiring, cut overtime or move people to higher-value work.
  5. **How long until it's working?**
     A first agent is typically live, with approvals switched on, 2 to 4 weeks after kickoff. The pilot then typically runs 2 to 4 weeks while the agent proves itself on real work. Timelines depend on scope and on how quickly we can get access to your tools.
  6. **How much does it cost?**
     It depends on scope, so we don't publish prices. After the free assessment you get a written proposal with the scope, the price and the expected savings, before any work starts. If you'd like a sense of the value first, try the savings calculator.
  7. **Is our data safe?**
     We follow strict practices: least-privilege access that's read-only by default, human approval for sensitive actions, audit logs of everything agents do, and business-grade AI providers whose terms exclude training on your data. We're glad to answer your security questionnaire in writing.
  8. **What if an agent gets something wrong?**
     Agents answer only from information you approve, and anything sensitive or unclear goes to a person. Early on, people approve the agent's work before it goes out. Every action is logged, we review samples every week, and you can pause any agent at any time. When something's off, we fix the cause, not just the instance.
  9. **Do you have case studies or references?**
     Not yet, and we won't invent them. Halyard is a young firm, so instead of testimonials we show working demos, worked examples with the math visible, and a pilot with a success measure agreed in writing. If the pilot misses the measure, you decide whether to continue.
  10. **What happens if we stop working together?**
      You keep your data, your accounts and the business knowledge we organized for your agents, such as FAQs, price lists and rules. We document how everything is set up, remove our access and help with a clean handover.
- **CTAs:** "More on how we work" → `/approach/#faq`
- **Microcopy:** None.

### 2.13 Final CTA

- **id:** `cta`
- **Eyebrow:** Free AI assessment
- **Headline:** Find out where AI pays off first in your business.
- **Subhead:** Thirty minutes with the people who would build your agents. You get a short written plan with your top opportunities, ranked by value. No cost, no obligation.
- **Body:** None.
- **Bullets (what you get):**
  - Your top three opportunities, ranked
  - A rough savings estimate, assumptions shown
  - A suggested first step
- **CTAs:**
  - Primary: "Book your free assessment" → `/contact/`
  - Secondary: "Estimate your savings first" → `/results/#calculator`
- **Microcopy:** Prefer email? Write to {contact.email}.

---

## 3. Services overview `/services/`

**Page job:** help a visitor find the service that matches their pain, then send them to that page or to the assessment.

### 3.1 Hero

- **id:** `hero`
- **Eyebrow:** Services
- **Headline (H1):** Start with your biggest bottleneck.
- **Subhead:** Four services that work on their own or together. Each one is designed, built, run and measured by us, inside the tools you already use.
- **Body:** None.
- **Bullets:** None.
- **CTAs:**
  - Primary: "Book a free AI assessment" → `/contact/`
  - Secondary: "Watch the demos" → `/demos/`
- **Microcopy:** Not sure which fits? The free assessment will tell you, in writing.

### 3.2 Where to start

- **id:** `where-to-start`
- **Eyebrow:** Where to start
- **Headline:** Start with the problem, not the product.
- **Subhead:** Find the line that sounds like your week.
- **Body:** None.
- **Cards (6; each card is "if this sounds familiar" plus "start here"):**
  1. **"Calls, chats and emails go unanswered after hours."** Start with the Customer Agent. → `/services/ai-agents/#customer-agent`
  2. **"Reports take days, and nobody trusts the spreadsheet."** Start with the Analyst Agent. → `/services/ai-agents/#analyst-agent`
  3. **"My inbox runs my day."** Start with the Executive Assistant Agent. → `/services/ai-agents/#executive-assistant`
  4. **"We spend on ads but can't say what's working."** Start with the AI Marketing Director. → `/services/marketing/`
  5. **"New business depends on referrals and luck."** Start with the AI Sales Agent. → `/services/sales/`
  6. **"Margins are thin, and I'm not sure why."** Start with AI Consulting. → `/services/consulting/`
- **CTAs:** None. Each card links directly.
- **Microcopy:** More than one sounds familiar? Start with the one that costs you the most time today. We'll help you decide.

### 3.3 The four services

- **id:** `services` (blocks: `ai-agents`, `marketing`, `sales`, `consulting`)
- **Eyebrow:** What we do
- **Headline:** Four services, one team behind all of them.
- **Subhead:** Each service has its own page, demo and worked example.
- **Body:** None.
- **Cards (4 blocks):**

  **Block `ai-agents`**
  - Eyebrow: AI Agents
  - Headline: An AI staff for your customers and your team.
  - Body: Three agents, each built for one job. The Customer Agent answers and books around the clock. The Analyst Agent cleans data, builds the spreadsheets and explains the numbers. The Executive Assistant triages email, assigns tasks, schedules meetings and builds decks.
  - Bullets: Website chat, text, email and phone · Bookings, quotes, orders and follow-ups · Formulas, pivot tables, forecasts and dashboards · Inbox triage, drafted replies and task assignment · PowerPoint decks, charts and briefings
  - Good fit if: your team answers the same questions all day, rebuilds the same reports every week or lives in the inbox.
  - CTAs: "Explore AI Agents" → `/services/ai-agents/` · "Watch the demos" → `/demos/#customer-agent`

  **Block `marketing`**
  - Eyebrow: AI Marketing Director
  - Headline: Every ad dollar, accounted for.
  - Body: It audits every ad you run alongside your website and CRM results, cuts what isn't working, runs its own experiments and moves budget to what is, inside limits you set. Every week you get a plain-English report.
  - Bullets: Google Ads, Meta Ads and more · Spend tied to real leads and sales · Tests on creative, audience, offer and landing page · Budget moves within your caps · A plain-English weekly report
  - Good fit if: you spend real money on ads and can't say with confidence which dollars bring in customers.
  - CTAs: "Explore the Marketing Director" → `/services/marketing/` · "Watch the demo" → `/demos/#marketing-director`

  **Block `sales`**
  - Eyebrow: AI Sales Agent
  - Headline: Outreach that reads like you did your homework.
  - Body: It finds businesses that fit your ideal customer, researches each one and writes a short, specific email for one person at a time. It sends on your rules, follows up, handles replies and logs everything in your CRM.
  - Bullets: Lists built from your ideal customer profile · A research dossier on every prospect · A quality check before every send · Follow-ups and reply handling · Deliverability and opt-outs built in
  - Good fit if: you sell to other businesses and need more qualified conversations without hiring another rep or sending spam.
  - CTAs: "Explore the Sales Agent" → `/services/sales/` · "Watch the demo" → `/demos/#sales-agent`

  **Block `consulting`**
  - Eyebrow: AI Consulting
  - Headline: See where your margin goes, and how to keep more of it.
  - Body: An AI-powered review of your financials and operations finds cost savings, pricing gaps and process waste, then ranks each opportunity by value, effort and payback. You get the same core deliverable as a traditional consulting engagement (a diagnostic plus a prioritized roadmap), at a fraction of the cost and typically in 3 to 5 weeks.
  - Bullets: Cost and vendor review · Margin by job, product and customer · Pricing analysis · Automation opportunities sized in hours and dollars · AI strategy and readiness
  - Good fit if: revenue is growing but margin isn't, or you know AI matters and want a plan before you spend.
  - Teaser (one paragraph): A traditional cost and operations review bills you for roughly 180 consultant hours and commonly takes 8 weeks or longer to reach recommendations. Ours covers the same scope, a diagnostic plus a prioritized roadmap, typically in 3 to 5 weeks and at a fraction of the cost, because AI does the transaction-level analysis and people spend their time checking it. Link: "See the cost comparison" → `/services/consulting/#comparison`. Label: Modeled estimate.
  - CTAs: "Explore AI Consulting" → `/services/consulting/` · "Watch the demo" → `/demos/#consulting`
- **CTAs (section):** None. Each block has its own.
- **Microcopy:** None.

### 3.4 Better together

- **id:** `together`
- **Eyebrow:** Better together
- **Headline:** Each service stands on its own. Together, they share what they learn.
- **Subhead:** Start with one. As you add more, they work from the same knowledge of your business.
- **Body:** None.
- **Cards (4):**
  1. **Consulting points the way.** The roadmap shows which agents will pay off first, and in what order.
  2. **Agents do the daily work.** Customer, Analyst and Executive Assistant agents take the repetitive work off your team.
  3. **Marketing and sales feed the pipeline.** What the Marketing Director learns about winning messages informs the Sales Agent's outreach, and both log to your CRM.
  4. **One report, in hours and dollars.** Every month you see what each agent did and what it was worth, against the baseline we agreed.
- **CTAs:** None.
- **Microcopy:** None.

### 3.5 Included every time

- **id:** `included`
- **Eyebrow:** Included every time
- **Headline:** What every engagement includes.
- **Subhead:** Whichever service you start with, the way we work stays the same.
- **Body:** None.
- **Bullets (8):**
  1. **Discovery and design.** We map your workflow before we build anything.
  2. **Integration.** Connected to the tools you already use.
  3. **Guardrails.** Approval rules, hard limits and handoff rules you set.
  4. **Testing on your past work.** Agents prove themselves before they go live.
  5. **Monitoring and upkeep.** We watch, tune and fix as part of the work.
  6. **Monthly reporting.** Results in hours and dollars against a baseline.
  7. **A named lead.** One person who knows your business and answers your questions.
  8. **Documentation you keep.** How each agent works, what it can access and the rules it follows.
- **CTAs:** "See our approach" → `/approach/`
- **Microcopy:** None.

### 3.6 Final CTA

- **id:** `cta`
- **Eyebrow:** Free AI assessment
- **Headline:** Not sure where to start? That's the point of the call.
- **Subhead:** In 30 minutes we'll look at where your team's time goes and tell you which service would pay off first, and why.
- **Body:** None.
- **Bullets:** None.
- **CTAs:**
  - Primary: "Book a free AI assessment" → `/contact/`
  - Secondary: "Estimate your savings" → `/results/#calculator`
- **Microcopy:** No cost, no obligation. You get a written summary either way.

---

## 4. AI Agents `/services/ai-agents/`

**Page job:** show three distinct agents with concrete capabilities, prove them with three demos, and answer "what if it gets it wrong?"

### 4.1 Hero

- **id:** `hero`
- **Eyebrow:** AI Agents
- **Headline (H1):** An AI staff for your front desk, your numbers and your inbox.
- **Subhead:** The Customer Agent talks to customers. The Analyst Agent works the numbers. The Executive Assistant keeps your inbox, calendar and to-do list moving. Each one works inside your existing tools and hands off to a person when it should.
- **Body:** None.
- **Bullets (chips that jump to each role):** Customer Agent → `#customer-agent` · Analyst Agent → `#analyst-agent` · Executive Assistant Agent → `#executive-assistant`
- **CTAs:**
  - Primary: "Book a free AI assessment" → `/contact/`
  - Secondary: "Watch the three demos" → `#demos`
- **Microcopy:** Start with one agent. Add the others when you're ready.

### 4.2 Three roles

- **id:** `roles`
- **Eyebrow:** Three roles
- **Headline:** One agent per job, each built for it.
- **Subhead:** Each agent has its own skills, rules and limits. Pick the one that takes the most off your team's plate.
- **Body:** None.
- **Cards (3):**
  1. **Customer Agent.** Talks to your customers 24/7 across chat, text, email and phone. Answers, quotes, books and follows up. Link: "See what it does" → `#customer-agent`
  2. **Analyst Agent.** Reads your books and spreadsheets, cleans the data, does all the Excel and explains what changed. Link: "See what it does" → `#analyst-agent`
  3. **Executive Assistant Agent.** Triages your inbox, drafts replies, assigns tasks, books meetings and builds decks and documents. Link: "See what it does" → `#executive-assistant`
- **CTAs:** None. Each card links to its section.
- **Microcopy:** None.

### 4.3 Customer Agent

- **id:** `customer-agent`
- **Eyebrow:** Customer Agent
- **Headline:** Every customer answered, day or night.
- **Subhead:** It talks to customers on your website, by text, by email and on the phone. It answers from your own knowledge, books the work and hands off to your team with the full story.
- **Body:** When a question sits unanswered, there's always another business a customer can call. The Customer Agent replies in seconds, at 2 p.m. or 2 a.m., and handles routine conversations from the first message to the booked job.
- **Cards (9 capabilities):**
  1. **Answers from your knowledge.** Learns your services, policies, service area, hours and FAQs. If it doesn't know, it says so and gets the answer from your team instead of guessing.
  2. **Works every channel.** Website chat, text, email and phone calls, with one conversation history per customer.
  3. **Quotes from your price book.** Prices standard jobs and products from your rules. Custom work gets a range or goes to your team for approval.
  4. **Books appointments.** Checks real availability in your calendar or scheduling system, books the slot and sends a confirmation.
  5. **Takes orders and requests.** Captures orders, service requests and job details and enters them in your system, so nobody retypes them.
  6. **Qualifies leads.** Asks the questions your best salesperson would, then routes hot leads to the right person right away.
  7. **Follows up.** Texts back missed calls, follows up on open quotes, sends reminders and asks for a review after the job.
  8. **Hands off with full context.** When a customer asks for a person, gets upset or needs something outside its rules, your team takes over with the transcript and a summary.
  9. **Speaks your customers' language.** Replies in the language the customer writes in, including Spanish.
- **Optional sourced stat** (show only with its source line): Speed matters. Research published in Harvard Business Review found that companies that tried to contact a new lead within an hour were nearly seven times as likely to qualify it as those that tried even an hour later.
  - Source line: James B. Oldroyd, Kristina McElheran and David Elkington, "The Short Life of Online Sales Leads," Harvard Business Review, March 2011.
- **CTAs:** "Watch the Customer Agent demo" → `#demo-customer-agent`
- **Microcopy:** Introduces itself as a virtual assistant. Customers can ask for a person at any time.

### 4.4 Analyst Agent

- **id:** `analyst-agent`
- **Eyebrow:** Analyst Agent
- **Headline:** Your numbers, cleaned up and explained.
- **Subhead:** It reads your books, untangles messy spreadsheets, does all the Excel and tells you in plain English what changed and why.
- **Body:** If your weekly report means exporting, pasting, fixing and formatting before anyone can read it, that's the Analyst Agent's job now.
- **Cards (9 capabilities):**
  1. **Reads the books.** Works from QuickBooks and Xero exports, bank and card statements, invoices and payroll summaries.
  2. **Cleans messy data.** Fixes duplicates, inconsistent names, broken dates, mixed formats and merged cells, and logs every change it makes.
  3. **Does all the Excel.** Builds and maintains workbooks with formulas, lookups and pivot tables your team can follow and edit.
  4. **Builds charts and dashboards.** KPI dashboards in Excel or Google Sheets that refresh on schedule.
  5. **Forecasts.** Cash flow, revenue, inventory and staffing forecasts, with every assumption written down.
  6. **Explains what changed.** A plain-English summary: what moved, why it likely moved and what to look at next.
  7. **Flags what needs attention.** Unusual expenses, duplicate payments, slipping margins and overdue invoices, before they turn into problems.
  8. **Answers questions in plain English.** Ask "What was our margin on commercial jobs last quarter?" and get the number, the source and the method.
  9. **Reconciles across systems.** Matches CRM deals to invoices, orders to shipments and inventory counts to sales.
- **CTAs:** "Watch the Analyst Agent demo" → `#demo-analyst-agent`
- **Microcopy:** Works alongside your bookkeeper and accountant, not instead of them. Read-only access to your books by default.

### 4.5 Executive Assistant Agent

- **id:** `executive-assistant`
- **Eyebrow:** Executive Assistant Agent
- **Headline:** Your inbox, calendar and follow-ups, handled.
- **Subhead:** It goes through your email, drafts replies in your voice, turns messages into tasks for the right person, books meetings and builds the briefings, decks and documents you need.
- **Body:** If your inbox decides what your day looks like, the Executive Assistant reads it first, so you only see what needs you.
- **Cards (9 capabilities):**
  1. **Triages your inbox.** Sorts every message into needs you, delegated, waiting, FYI and junk, first thing in the morning and through the day.
  2. **Drafts replies in your voice.** Writes responses based on your past emails and templates. You approve and send, or turn on auto-send for routine categories.
  3. **Turns email into tasks.** Pulls out action items and assigns them to the right employee in Asana, Trello, Microsoft Teams, Slack or your task tool, with a due date.
  4. **Tracks follow-ups.** Notices when someone owes you a reply, or you owe them one, and nudges at the right time.
  5. **Schedules meetings.** Finds times that work, sends invites, handles reschedules and adds the agenda.
  6. **Prepares briefings.** Before each meeting, a one-page brief: who you're meeting, your history with them and what's still open.
  7. **Builds PowerPoint decks.** Turns your notes, data or a rough outline into a clean deck on your template, with charts.
  8. **Writes documents.** Proposals, SOP drafts, one-pagers, meeting notes and summaries, in your format.
  9. **Sends a daily digest.** One short summary each morning: what came in, what's due and who's waiting on whom.
- **CTAs:** "Watch the Executive Assistant demo" → `#demo-executive-assistant`
- **Microcopy:** Nothing goes out in your name without approval, unless you turn on auto-send for categories you choose. Folders and senders you mark private are excluded.

### 4.6 Demos

- **id:** `demos`
- **Eyebrow:** See them work
- **Headline:** Three agents, three real jobs.
- **Subhead:** Watch each agent take a task from start to finish, including the moments it hands off to a person.
- **Body:** None.
- **Cards (tabs; scripts in 8.3, 8.4 and 8.5):**
  1. **Customer Agent:** chat to booked job (`demo-customer-agent`)
  2. **Analyst Agent:** messy export to plain-English answer (`demo-analyst-agent`)
  3. **Executive Assistant:** inbox to action (`demo-executive-assistant`)
- **CTAs:** "See all six demos" → `/demos/`
- **Microcopy:** Simulated demos. Businesses, people and figures are fictional and illustrative.

### 4.7 How it works

- **id:** `how-it-works`
- **Eyebrow:** How it works
- **Headline:** From your know-how to a working agent.
- **Subhead:** We build each agent around how your business already works, then prove it on your past work before it touches a live customer or file.
- **Body:** None.
- **Cards (5 steps):**
  1. **Learn the job.** We sit with the people who do the work today and gather what the agent needs: FAQs, price book, policies, templates and examples of great work. *Design phase, typically 1 to 2 weeks.*
  2. **Connect your tools.** We connect only what the job needs, read-only wherever possible. *Build phase, typically 1 to 2 weeks.*
  3. **Test on your past work.** We replay recent chats, emails or reports and compare the agent's work with your team's. Gaps get fixed before launch. *Build phase.*
  4. **Go live with approvals on.** The agent starts working, and people approve its output until the quality is consistently where you want it. *Pilot, typically 2 to 4 weeks.*
  5. **Expand and improve.** As accuracy holds, you choose what it can do without approval. We review its work and report results every month. *Ongoing.*
- **CTAs:** "See our full process" → `/approach/#process`
- **Microcopy:** Timelines depend on scope and access to your tools.

### 4.8 Guardrails and quality

- **id:** `guardrails`
- **Eyebrow:** Guardrails and quality
- **Headline:** Helpful by design. Careful by default.
- **Subhead:** Every agent has clear limits, and people make the calls that matter.
- **Body:** None.
- **Cards (8):**
  1. **Approved knowledge only.** Agents answer from the sources you approve. No guessing at prices, policies or promises.
  2. **Clear handoff rules.** You decide what always goes to a person: complaints, refunds, VIP customers, legal or medical questions, large orders.
  3. **Safety first.** Anything urgent, like a gas smell, a flood or a medical emergency, gets safety instructions and goes straight to a person.
  4. **Approval queues.** Early on, people approve drafts before they go out. You choose when routine work can go without review.
  5. **Hard limits.** Discounts, refunds and order sizes the agent can't exceed, no matter what a customer asks.
  6. **Read-only books.** The Analyst Agent can read your accounting data but can't post entries, move money or change records.
  7. **Consent and disclosure.** The agent introduces itself as a virtual assistant. Outbound texts and calls go only to people who've contacted you or agreed to hear from you, and callers hear a notice when calls are recorded.
  8. **Reviewed every week.** We read samples of every agent's work weekly in the early months, track accuracy and fix the cause of any miss.
- **CTAs:** "How human-in-the-loop works" → `/approach/#controls`
- **Microcopy:** Every action is logged, and you can pause any agent at any time.

### 4.9 What it's worth

- **id:** `worth`
- **Eyebrow:** What it's worth
- **Headline:** Put a number on the hours.
- **Subhead:** A worked example from our illustrative scenarios: a fictional business, conservative assumptions and every line of math on the page.
- **Body:** Agents create value in three ways: hours your team gets back, leads that don't slip away after hours, and work that gets done faster and more consistently. The example below shows how we model each one, and what we leave out.
- **Cards:** **[Scenario embed: SCENARIOS.md, AI Agents example. If SCENARIOS.md has one example per agent, show tabs: Customer Agent · Analyst Agent · Executive Assistant.]**
- **Bullets ("What moves the number"):**
  - How many hours your team spends on calls, chats, email and reports today
  - How many inquiries arrive after hours or wait too long for a reply
  - Your average job or order value, and how often inquiries become bookings
  - Your team's hourly cost, including taxes and benefits
- **CTAs:**
  - "Run your own numbers" → `/results/#calculator`
  - "See the full example" → `/results/#examples`
- **Microcopy:** Illustrative example. Modeled estimate, not a client result or a guarantee. "How we estimate" → `/results/#methodology`

### 4.10 FAQ

- **id:** `faq`
- **Eyebrow:** FAQ
- **Headline:** Questions about AI agents.
- **Subhead:** None.
- **Body:** None.
- **Bullets (5 Q&As):**
  1. **Will customers know they're talking to AI?**
     Yes. We set the Customer Agent to introduce itself as a virtual assistant, and customers can ask for a person at any time. Being upfront builds trust, and in some places it's required.
  2. **What happens when it doesn't know the answer?**
     It says so, tells the customer what happens next and passes the question to the right person with the full conversation. If you want it to handle that question next time, we add the answer to its approved knowledge.
  3. **Can it work with our scheduling, field service or practice software?**
     Often, yes. If your system offers an API or a reliable integration, the agent can read availability and book directly. If it doesn't, we set up a practical workaround, such as a shared calendar your team confirms. We'll tell you which applies on the assessment call.
  4. **Will the Analyst Agent replace our bookkeeper or accountant?**
     No. Your bookkeeper and accountant keep the books accurate and compliant. The Analyst Agent takes on the reporting, cleanup and analysis around them, and it reads your accounting data without changing it.
  5. **Can the Executive Assistant send email on my behalf?**
     Only if you want it to. By default it drafts and you approve. You can allow auto-send for routine categories, like scheduling confirmations, and keep approval on for everything else. Folders and senders you mark private are excluded.
- **CTAs:** None.
- **Microcopy:** None.

### 4.11 Final CTA

- **id:** `cta`
- **Eyebrow:** Free AI assessment
- **Headline:** Which agent would give you the most time back?
- **Subhead:** On a 30-minute call we'll look at where your team's hours go and recommend the agent to start with, with a rough estimate of what it's worth.
- **Body:** None.
- **Bullets:** None.
- **CTAs:**
  - Primary: "Book a free AI assessment" → `/contact/`
  - Secondary: "Estimate your savings" → `/results/#calculator`
- **Microcopy:** No cost, no obligation. Written summary either way.

---

## 5. AI Marketing Director `/services/marketing/`

**Page job:** convince an owner who spends on ads that waste can be found and fixed safely, with their budget and brand protected.

### 5.1 Hero

- **id:** `hero`
- **Eyebrow:** AI Marketing Director
- **Headline (H1):** Spend less to win each customer.
- **Subhead:** The AI Marketing Director audits every ad you run on Google, Meta and beyond, cuts the waste, runs its own tests and moves budget to what works, inside limits you set. Then it tells you what happened, in plain English.
- **Body:** None.
- **Bullets (chips):** A full audit of every account · Spend tied to real customers · Tests with stopping rules · Budget moves within your caps
- **CTAs:**
  - Primary: "Book a free AI assessment" → `/contact/`
  - Secondary: "Watch the demo" → `#demo`
- **Microcopy:** Works on its own or alongside your agency or in-house marketer.

### 5.2 Where budgets leak

- **id:** `leaks`
- **Eyebrow:** Where budgets leak
- **Headline:** The usual leaks, found and sized.
- **Subhead:** The first audit checks for the common patterns that quietly drain ad budgets, and puts a dollar figure on each one it finds.
- **Body:** None.
- **Cards (6):**
  1. **Search terms that never convert.** Clicks from people looking for jobs, free advice or a service you don't offer, paid for every month.
  2. **Spend outside your area or hours.** Ads shown in places you don't serve, or at times when nobody can answer.
  3. **Campaigns competing with each other.** Two campaigns bidding on the same searches and driving up your own costs.
  4. **Tired creative.** The same ad shown to the same people too many times, with results sliding.
  5. **Landing pages that lose people.** Slow pages, unclear offers and forms that ask too much.
  6. **Tracking you can't trust.** Conversions counted twice or not at all, so every decision rests on bad data.
- **CTAs:** None.
- **Microcopy:** Every finding comes with the fix, and nothing changes without your approval.

### 5.3 Capabilities

- **id:** `capabilities`
- **Eyebrow:** What it does
- **Headline:** A marketing director that tests, measures and reports.
- **Subhead:** It does the analysis a good marketing lead would do, every day, across every account.
- **Body:** None.
- **Cards (9):**
  1. **Full-account audit.** Every campaign, ad group, keyword, audience and search term across Google Ads, Meta Ads, Microsoft Ads and LinkedIn.
  2. **Ties spend to revenue.** Connects ad data to your website analytics and CRM, so you see cost per booked job or sale, not just cost per click.
  3. **Fixes tracking first.** Checks that conversions are counted correctly and flags broken tags and double counting, because good decisions need good data.
  4. **Cuts the waste.** Adds negative keywords, fixes location and schedule settings and pauses what's losing money, with your approval.
  5. **Designs experiments.** Tests one change at a time (creative, audience, offer, landing page or budget split), each with a hypothesis and a stopping rule.
  6. **Calls winners on evidence.** Waits for enough data before declaring a winner, so you don't chase noise.
  7. **Moves budget to what works.** Shifts spend toward the campaigns bringing in customers, inside the caps and rules you approve.
  8. **Drafts new creative.** Writes headlines, ad copy and landing page variants in your brand voice, for your approval.
  9. **Reports in plain English.** A short weekly note on what changed, what we tested, what we learned and what's next, plus a monthly view of cost per lead, cost per acquisition and return on ad spend.
- **CTAs:** None.
- **Microcopy:** None.

### 5.4 Demo

- **id:** `demo`
- **Eyebrow:** See it work
- **Headline:** Watch an ad audit turn into a test plan.
- **Subhead:** The agent connects to the accounts, finds the waste, launches tests and moves budget, then reports what changed.
- **Body:** None.
- **Cards:** **[Demo player: `marketing-director`, script in 8.6.]**
- **CTAs:** "See all six demos" → `/demos/`
- **Microcopy:** Simulated demo. Fictional business and illustrative figures.

### 5.5 How it works

- **id:** `how-it-works`
- **Eyebrow:** How it works
- **Headline:** Audit, fix, test, repeat.
- **Subhead:** A steady weekly rhythm, with every change logged and every big decision left to you.
- **Body:** None.
- **Cards (5 steps):**
  1. **Connect, read-only.** We connect your ad accounts, analytics and CRM with read-only access first. *Typically week 1.*
  2. **Audit and baseline.** A full audit with each finding sized in dollars, plus the baseline we'll measure against: cost per lead, cost per acquisition and return on ad spend. *Typically weeks 1 to 2.*
  3. **Fix the obvious.** With your approval, we fix tracking, cut clear waste and tighten targeting. *Typically weeks 2 to 3.*
  4. **Test and learn.** A running test plan. Each experiment has a hypothesis, a budget and a stopping rule. *Ongoing, in weekly cycles.*
  5. **Report and reallocate.** Weekly plain-English notes and a monthly review. Budget moves toward what works, inside your caps. *Ongoing.*
- **CTAs:** None.
- **Microcopy:** How fast tests produce answers depends on your spend and traffic. We'd rather wait than call a winner on noise.

### 5.6 Guardrails

- **id:** `guardrails`
- **Eyebrow:** Guardrails
- **Headline:** Your budget, your brand, your rules.
- **Subhead:** The agent works inside limits you set, and the big decisions stay with you.
- **Body:** None.
- **Cards (6):**
  1. **Spending caps.** Caps are set inside the ad platforms wherever they support it. The agent can't raise them without your approval.
  2. **Approval for big moves.** New campaigns, new offers, budget increases and new messaging all wait for your OK.
  3. **Brand-safe copy.** Every ad follows your brand voice and a list of approved claims. No invented promises, discounts or guarantees.
  4. **Change log and rollback.** Every change is logged with the reason and the result, and any change can be rolled back.
  5. **Platform and industry rules.** If you advertise in a special ad category (such as housing or employment) or a regulated field like healthcare or legal services, the agent works within those platform policies and your compliance review.
  6. **Early warnings.** If results dip or something looks off, the agent flags it right away and holds risky changes until you've seen it.
- **CTAs:** None.
- **Microcopy:** None.

### 5.7 What it's worth

- **id:** `worth`
- **Eyebrow:** What it's worth
- **Headline:** Fewer wasted dollars, more customers per dollar.
- **Subhead:** A worked example from our illustrative scenarios, with every assumption shown.
- **Body:** Ad improvements show up in two places: money you stop wasting, and more customers from the same budget. The example below models both, conservatively.
- **Cards:** **[Scenario embed: SCENARIOS.md, AI Marketing Director example.]**
- **Bullets ("What moves the number"):**
  - Your monthly ad spend and how it's split across platforms
  - Your current cost per lead or per customer
  - How much spend goes to searches, places or audiences that never convert
  - How quickly tests can reach a reliable answer at your spend
- **CTAs:**
  - "Run your own numbers" → `/results/#calculator`
  - "See the full example" → `/results/#examples`
- **Microcopy:** Illustrative example. Modeled estimate, not a client result or a guarantee. "How we estimate" → `/results/#methodology`

### 5.8 FAQ

- **id:** `faq`
- **Eyebrow:** FAQ
- **Headline:** Questions about the Marketing Director.
- **Subhead:** None.
- **Body:** None.
- **Bullets (5 Q&As):**
  1. **Does this replace my agency or marketer?**
     It doesn't have to. The Marketing Director can run your accounts end to end, or work alongside your agency or in-house marketer as the analyst and tester they rarely have time to be. Either way, you get the same plain-English reports.
  2. **Can it spend more than my budget?**
     Not without your approval. We set spending caps inside the ad platforms wherever they support it, and only you can approve an increase.
  3. **How soon will we see results?**
     Audit findings and quick fixes typically arrive in the first two weeks. Tests take longer. How long depends on your spend and traffic, and we won't call a winner before the data supports it.
  4. **Which platforms do you work with?**
     We start with Google Ads and Meta Ads (Facebook and Instagram), and also work with Microsoft Ads and LinkedIn. We connect your website analytics and CRM too, so results tie to real customers.
  5. **Is there a minimum ad spend?**
     There's no fixed minimum. At smaller budgets the biggest gains usually come from fixing tracking, cutting waste and tightening targeting, rather than from running lots of tests. We'll tell you on the assessment call which applies to you.
- **CTAs:** None.
- **Microcopy:** None.

### 5.9 Final CTA

- **id:** `cta`
- **Eyebrow:** Free AI assessment
- **Headline:** Find out where your ad budget is leaking.
- **Subhead:** On a free 30-minute call we'll talk through your accounts and tell you what we'd check first. Share read-only access beforehand and we'll come with specifics.
- **Body:** None.
- **Bullets:** None.
- **CTAs:**
  - Primary: "Book a free AI assessment" → `/contact/`
  - Secondary: "Estimate your savings" → `/results/#calculator`
- **Microcopy:** Read-only access is optional, and you can remove it at any time.

---

## 6. AI Sales Agent `/services/sales/`

**Page job:** make quality over volume unmistakable. The visitor should leave convinced this is the opposite of AI spam, and that deliverability and compliance are handled.

### 6.1 Hero

- **id:** `hero`
- **Eyebrow:** AI Sales Agent
- **Headline (H1):** Every prospect researched. Every email written for one person.
- **Subhead:** The AI Sales Agent finds businesses that fit your ideal customer, studies each one and writes a short, specific email a thoughtful salesperson would be proud to send. Then it sends on your rules, follows up and logs everything in your CRM.
- **Body:** None.
- **Bullets (chips):** Research on every prospect · A quality check before every send · Small, capped daily volumes · Opt-outs honored automatically
- **CTAs:**
  - Primary: "Book a free AI assessment" → `/contact/`
  - Secondary: "Compare the emails" → `#comparison`
- **Microcopy:** Quality over volume, always. If the agent can't find a real reason to write, it doesn't write.

### 6.2 The problem

- **id:** `problem`
- **Eyebrow:** The problem
- **Headline:** Too much AI outreach is spam with better grammar.
- **Subhead:** Tools that send thousands of lightly personalized emails teach buyers to ignore you, and they can damage your domain's reputation along the way.
- **Body:** You've seen them: an opener that praises your "commitment to excellence", a paragraph about "solutions" and a request for 15 minutes from someone who knows nothing about you. They get deleted. We built the Sales Agent to do the opposite: fewer emails, each one worth reading.
- **Cards:** None.
- **CTAs:** "See the difference" → `#comparison`
- **Microcopy:** None.

### 6.3 Generic AI email vs. ours

- **id:** `comparison`
- **Eyebrow:** The difference
- **Headline:** Generic AI email vs. ours.
- **Subhead:** Same sender, same prospect. One came from a generic AI writing tool. The other came out of the Sales Agent's research.
- **Body (setup line above the two emails):** The sender: Parkline IT, a managed IT provider for small offices. The prospect: Dana Whitaker, managing partner at Hollis & Grant, a 22-person law firm. Both businesses and both people are fictional.
- **Cards:** two email mockups side by side (stacked on mobile), each with numbered annotations, then a summary table. All three follow.

**Email A, label "Generic AI email":**

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

**Annotations on Email A (red markers, numbered on the mockup):**
1. **"Partnership opportunity."** The subject line announces a pitch before the email is opened.
2. **"I hope this email finds you well!"** Filler every reader skips.
3. **"Impressed by your commitment to excellence."** Flattery that fits any firm on earth, and proof that no research happened.
4. **"Innovative, end-to-end... streamline... drive growth."** Buzzwords about the sender. Not one line about the reader.
5. **"A quick 15-minute call."** Asks a stranger for their time before offering anything.
6. **The whole email.** It could go to 5,000 firms with only the name changed, and it reads that way. No postal address and no way to opt out.

**Email B, label "Written by the Sales Agent":**

```text
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

**Annotations on Email B (green markers, numbered on the mockup):**
1. **Subject line.** Names something real and specific to them.
2. **"Opening the Riverside office last month."** A recent, verifiable trigger. Source in the dossier: the firm's news page.
3. **"Handling IT and vendor relationships."** Quoted from their careers page. This is what real homework looks like.
4. **"Password resets, laptop setups... backup."** A likely pain, framed as a common pattern rather than a guess about them.
5. **"11 law and accounting offices."** A proof point from the sender's approved claims list. The agent never invents credentials.
6. **"One-page checklist. No call needed."** Offers something useful first. An easy yes.
7. **Signature.** A postal address and a plain opt-out line. Plain text, under 100 words before the signature, no images, no links.

**Summary table under the emails:**

| | Generic AI email | Written by the Sales Agent |
|---|---|---|
| Research | None | A 10-point dossier |
| Facts about the prospect | None | Two, each linked to its source |
| Reason to write now | None | A new office and a telling job post |
| The ask | 15 minutes from a stranger | A useful checklist, no call |
| Claims about the sender | Buzzwords | One specific, approved proof point |
| Postal address and opt-out | Missing | Included |
| Volume | As many as the tool allows | Small batches, capped per inbox |

- **CTAs:** "See how the research works" → `#research`
- **Microcopy:** Fictional businesses and people, for illustration. Email B is the standard every send is held to.

### 6.4 Research checklist

- **id:** `research`
- **Eyebrow:** Research checklist
- **Headline:** What the agent checks before it writes a word.
- **Subhead:** Every prospect gets a short dossier. If the research doesn't turn up a real reason to reach out, the prospect is skipped. No reason, no email.
- **Body:** None.
- **Bullets (10-point checklist):**
  1. **Fit.** Matches your ideal customer profile: industry, size, location and the signals you care about.
  2. **Not already in your world.** Not a current customer, an open deal, a past opt-out or on your do-not-contact list.
  3. **Their website.** What they sell, who they serve, where they operate and what's new.
  4. **Recent news.** Openings, expansions, new services, leadership changes and announcements.
  5. **Hiring.** Open roles that reveal priorities or strain, like a first operations hire or one role covering three jobs.
  6. **The person.** Their role, responsibilities and tenure, plus any public, work-related posts.
  7. **Customer reviews.** Recurring themes in public reviews, good and bad.
  8. **Tools they use.** What their website and job posts reveal about the systems they run on.
  9. **A reason to write now.** One specific, verifiable trigger tied to your offer.
  10. **A verified address.** The email address is validated before anything is sent.
- **CTAs:** None.
- **Microcopy:** Every fact in an email links back to its source in the dossier, so you can check it in one click. Research covers business context only, never personal details.

### 6.5 Capabilities

- **id:** `capabilities`
- **Eyebrow:** What it does
- **Headline:** A researcher, writer and sales assistant in one.
- **Subhead:** It does the slow, careful parts of prospecting that busy teams skip, and it does them for every prospect.
- **Body:** None.
- **Cards (9):**
  1. **Builds your list.** Finds businesses that match your ideal customer profile, using reputable business data sources and public information.
  2. **Researches every prospect.** Builds a short dossier from their website, news, job posts, reviews and the person's role.
  3. **Finds the reason to write.** Looks for a real, recent trigger that connects to what you sell, and skips the prospect if there isn't one.
  4. **Writes one email for one person.** Short, specific and in your voice, with one clear, easy ask.
  5. **Checks quality before sending.** Verifies facts against sources and checks tone, length, claims and spam-trigger phrasing.
  6. **Sends on your rules.** Approve every email, approve a sample, or let it send anything above the quality bar. Daily limits per inbox, always.
  7. **Follows up like a person.** A small number of follow-ups, each adding something new. It stops the moment someone replies or opts out.
  8. **Handles replies.** Sorts interested, not now, wrong person and unsubscribe. Drafts responses, books meetings on your calendar and alerts you to hot replies.
  9. **Logs everything in your CRM.** Contacts, research notes, emails, replies and next steps in HubSpot, Salesforce, Pipedrive or a spreadsheet.
- **CTAs:** None.
- **Microcopy:** None.

### 6.6 Quality bar

- **id:** `quality`
- **Eyebrow:** Our quality bar
- **Headline:** Every email has to earn its send.
- **Subhead:** Before anything goes out, the draft is checked against these standards. Anything that falls short goes to a person or doesn't go at all.
- **Body:** None.
- **Bullets (8 standards):**
  1. **True.** Every fact is checked against its source. Nothing invented, nothing exaggerated.
  2. **Specific.** At least one observation the reader would recognize as accurate about their business.
  3. **Relevant.** Tied to an offer you've approved and a problem they plausibly have.
  4. **Short.** Under 120 words before the signature. Plain text. No images or attachments.
  5. **One clear ask.** Easy to say yes to. Usually something useful, not a meeting.
  6. **Your voice.** Matches your tone and style guide. No filler openers and no fake familiarity.
  7. **Honest.** No fake "Re:" subject lines, no false urgency and no misleading claims.
  8. **Respectful.** Business context only. Nothing about anyone's personal life, family or sensitive traits.
- **CTAs:** None.
- **Microcopy:** The review queue shows the result of every check for every email.

### 6.7 How it works

- **id:** `how-it-works`
- **Eyebrow:** How it works
- **Headline:** Careful setup, then steady outreach every week.
- **Subhead:** The first weeks go into targeting, voice and sending setup, so every email after that is one you'd be glad to have sent.
- **Body:** None.
- **Cards (6 steps):**
  1. **Define your ideal customer.** We study your best current customers and agree on who to target, what to offer and what never to say. *Typically week 1.*
  2. **Set up sending the right way.** A separate sending domain, authenticated email and a gradual warm-up that protects your main domain. *Typically weeks 1 to 4, in parallel.*
  3. **Research the first list.** The agent builds and researches a first batch of prospects. You see every dossier. *Typically week 2.*
  4. **Calibrate together.** You review the first drafts. We tune voice, offers and rules until they sound like your best salesperson. *Typically weeks 2 to 3.*
  5. **Send and follow up.** Steady daily sends within limits, follow-ups that add something, and replies routed to you. *Typically from week 3 or 4.*
  6. **Review and improve.** A weekly look at replies, meetings and what's landing. Targeting and messages get sharper over time. *Ongoing.*
- **CTAs:** None.
- **Microcopy:** New sending domains need a few weeks of warm-up before full volume. We use that time to research and calibrate.

### 6.8 Demo

- **id:** `demo`
- **Eyebrow:** See it work
- **Headline:** Watch one prospect go from profile to personal email.
- **Subhead:** See the research, the draft, the quality check and the send, side by side with what a generic AI tool would have written.
- **Body:** None.
- **Cards:** **[Demo player: `sales-agent`, script in 8.7.]**
- **CTAs:** "See all six demos" → `/demos/`
- **Microcopy:** Simulated demo. Fictional businesses, people and figures.

### 6.9 Deliverability and compliance

- **id:** `deliverability`
- **Eyebrow:** Deliverability and compliance
- **Headline:** Built to reach the inbox and respect the rules.
- **Subhead:** A great email is wasted in a spam folder, and no result is worth your reputation. Both are handled from day one.
- **Body:** None.
- **Bullets, group 1, "Deliverability":**
  1. **A separate sending domain.** Outreach goes from a dedicated domain or subdomain, so your main domain's reputation stays protected.
  2. **Authenticated email.** SPF, DKIM and DMARC are set up and tested before the first send, meeting the authentication standards Gmail and Yahoo require of bulk senders.
  3. **Gradual warm-up.** New inboxes ramp up slowly over several weeks.
  4. **Low daily limits.** Sends are capped per inbox and spread through the business day.
  5. **Verified addresses only.** Every address is checked before sending, and bounces are removed automatically.
  6. **Plain, human formatting.** Plain text, no images and few or no links.
  7. **Daily health checks.** Bounce, complaint and reply rates are watched every day. Sending pauses automatically if something looks off.
- **Bullets, group 2, "Compliance":**
  1. **CAN-SPAM basics, every time.** Accurate sender details, honest subject lines, your physical mailing address and a clear way to opt out.
  2. **Opt-outs honored automatically.** A "no thanks" or an unsubscribe stops all future emails to that person, across every inbox, right away.
  3. **Your do-not-contact list respected.** Synced with your CRM, so customers, open deals and past opt-outs never get cold outreach.
  4. **Business context only.** Research uses public, work-related information. Nothing personal or sensitive.
  5. **Stricter regions scoped first.** Canada (CASL), the UK and the EU (GDPR) have stricter rules. We scope those markets with you and your counsel, or leave them out.
  6. **Records kept.** Every send, reply and opt-out is logged.
- **CTAs:** None.
- **Microcopy:** CAN-SPAM makes no exception for business-to-business email (source: FTC, "CAN-SPAM Act: A Compliance Guide for Business"). This section describes how we set things up. It isn't legal advice, and your counsel has the final say.

### 6.10 What it's worth

- **id:** `worth`
- **Eyebrow:** What it's worth
- **Headline:** The math of fewer, better emails.
- **Subhead:** A worked example from our illustrative scenarios, with every assumption shown.
- **Body:** Good outreach is measured in conversations and new business, not emails sent. The example below starts from modest reply and meeting rates and follows them through to new customers, including the prospecting hours your team gets back.
- **Cards:** **[Scenario embed: SCENARIOS.md, AI Sales Agent example.]**
- **Bullets ("What moves the number"):**
  - How clearly defined your ideal customer is
  - What a new customer is worth to you in the first year
  - How often a first meeting turns into a sale for you today
  - The hours your team spends prospecting now
- **CTAs:**
  - "Run your own numbers" → `/results/#calculator`
  - "See the full example" → `/results/#examples`
- **Microcopy:** Illustrative example. Modeled estimate, not a client result or a guarantee. "How we estimate" → `/results/#methodology`

### 6.11 FAQ

- **id:** `faq`
- **Eyebrow:** FAQ
- **Headline:** Questions about the Sales Agent.
- **Subhead:** None.
- **Body:** None.
- **Bullets (5 Q&As):**
  1. **Isn't cold email just spam?**
     Spam is irrelevant, deceptive and sent in bulk. Our outreach is researched, relevant to the reader, honest about who's writing, easy to opt out of and sent in small numbers. If the agent can't find a genuine reason to contact someone, it doesn't.
  2. **Will it send from my main email address?**
     No. We set up a separate sending domain or subdomain, so outreach stays apart from your main domain's reputation. Replies come straight to you or your sales team.
  3. **How many emails does it send?**
     Deliberately few. Sends are capped per inbox per day and ramped up slowly. We'd rather send fewer emails that get read than many that get deleted.
  4. **Can I approve emails before they go out?**
     Yes. You can approve every email, approve a sample, or let the agent send anything that passes the quality bar. A good way to start is approving every email, then relaxing that once you trust the drafts.
  5. **Where do the prospects come from? Do you buy lists?**
     We don't blast purchased lists. The agent builds each list for you from reputable business data sources and public information, checks every prospect against your criteria and your do-not-contact list, and verifies every address.
- **CTAs:** None.
- **Microcopy:** None.

### 6.12 Final CTA

- **id:** `cta`
- **Eyebrow:** Free AI assessment
- **Headline:** See what researched outreach would look like for you.
- **Subhead:** On a free 30-minute call we'll sketch your ideal customer together and show you what the agent would look for.
- **Body:** None.
- **Bullets:** None.
- **CTAs:**
  - Primary: "Book a free AI assessment" → `/contact/`
  - Secondary: "Watch the Sales Agent demo" → `/demos/#sales-agent`
- **Microcopy:** No cost, no obligation.

---

## 7. AI Consulting `/services/consulting/`

**Page job:** show a cost-conscious owner a credible, checkable way to find savings and margin, with clear deliverables and no consultant theater.

### 7.1 Hero

- **id:** `hero`
- **Eyebrow:** AI Consulting
- **Headline (H1):** A ranked plan to cut costs and grow your margin.
- **Subhead:** An AI-powered review of your financials and operations finds savings, pricing gaps and process waste, then ranks every opportunity by value, effort and payback. The same core deliverable as a traditional consulting engagement, at a fraction of the cost and typically in 3 to 5 weeks.
- **Body:** None.
- **Bullets (chips):** Every number traceable · Opportunities ranked by payback · A 90-day plan · AI strategy included
- **CTAs:**
  - Primary: "Book a free AI assessment" → `/contact/`
  - Secondary: "Watch the demo" → `#demo`
- **Microcopy:** Every number traces back to your data. A person reviews every recommendation.

### 7.2 What we look at

- **id:** `what-we-look-at`
- **Eyebrow:** What we look at
- **Headline:** Five places we look for margin.
- **Subhead:** Margin often leaks out in small places nobody has had time to check.
- **Body:** None.
- **Cards (5):**
  1. **Costs and vendors.** Every expense line, trended over time. Vendor price creep, overlapping subscriptions and contracts worth renegotiating.
  2. **Pricing and margin.** Margin by job, product, service line and customer, and where prices have fallen behind costs.
  3. **Time and process.** Where your team's hours go, where work gets redone and where handoffs stall.
  4. **Cash.** Receivables, payment terms, inventory and the cash they tie up.
  5. **Growth economics.** What each marketing channel and customer type really costs, and what it returns.
- **CTAs:** None.
- **Microcopy:** None.

### 7.3 Capabilities

- **id:** `capabilities`
- **Eyebrow:** What it does
- **Headline:** The scope a consulting review covers, in weeks.
- **Subhead:** AI reads every transaction and builds the models. A person checks the findings and makes the recommendations.
- **Body:** None.
- **Cards (9):**
  1. **Cost review.** Categorizes and trends every expense, and flags price creep, duplicate tools and spending that has grown faster than revenue.
  2. **Margin by job, product and customer.** Shows which work makes money and which quietly loses it, down to the line item.
  3. **Pricing analysis.** Finds discounting patterns, underpriced services and places where costs have outrun prices, with scenarios for adjusting.
  4. **Process mapping.** Uses system data and short staff interviews to show where time goes and where work stalls.
  5. **Automation sizing.** Estimates hours per task, cost per hour and what an agent could take on, ranked by value.
  6. **Cash and working capital.** Looks at receivables aging, payment terms and inventory turns, and what tightening them would free up.
  7. **Scenario modeling.** Tests "what if" questions, like a price change, a new hire or a lost customer, with the assumptions visible.
  8. **Prioritized roadmap.** Every opportunity ranked by expected savings, effort and payback, with an owner and a first step.
  9. **AI strategy and readiness.** Where AI fits your business and where it doesn't, what data and policies you need, and a practical AI use policy for your staff.
- **CTAs:** None.
- **Microcopy:** None.

### 7.4 Deliverables

- **id:** `deliverables`
- **Eyebrow:** What you get
- **Headline:** Clear deliverables you can act on.
- **Subhead:** No 80-page binder. Just what you need to decide and act.
- **Body:** None.
- **Bullets (6):**
  1. **Executive summary.** Two pages: what we found, what it's worth and what to do first.
  2. **Opportunity register.** A spreadsheet of every opportunity with estimated value, effort, payback and owner.
  3. **Margin waterfall.** A chart that walks from today's margin to your potential margin, one opportunity at a time.
  4. **90-day action plan.** The first moves, in order, with owners and dates.
  5. **12-month roadmap.** What to automate, fix or renegotiate next, and when.
  6. **The model.** The working spreadsheet behind every number.
- **CTAs:** None.
- **Microcopy:** The model and the opportunity register are yours to keep and update.

### 7.5 How it works

- **id:** `how-it-works`
- **Eyebrow:** How it works
- **Headline:** From your data to a roadmap, in weeks.
- **Subhead:** A short, focused engagement with clear checkpoints, typically 3 to 5 weeks from kickoff to readout.
- **Body:** None.
- **Cards (6 steps):**
  1. **Kickoff.** We agree on goals, constraints and the questions that matter most, and send a short data request. *Typically week 1.*
  2. **Data in.** You share 12 to 24 months of financial and operational data, read-only or as exports. We handle the cleanup. *Typically weeks 1 to 2.*
  3. **Interviews.** Short conversations with the people who run the work, typically 30 minutes each. *Typically week 2.*
  4. **Analysis and review.** AI does the heavy lifting across every transaction. A person checks every finding before it reaches you. *Typically weeks 2 to 4.*
  5. **Readout and roadmap.** We walk you through the findings and the plan, and answer every question. *Typically weeks 3 to 5.*
  6. **Optional: we implement.** Hand the roadmap to your team, or have us build the agents that deliver it. *Your call.*
- **CTAs:** None.
- **Microcopy:** Timing depends mostly on how quickly data can be shared.

### 7.6 Cost and time comparison

- **id:** `comparison`
- **Eyebrow:** Compare the options
- **Headline:** The same core deliverable. A fraction of the cost and time.
- **Subhead:** A diagnostic plus a prioritized roadmap is the standard first deliverable of a consulting engagement. Here's what traditional providers charge for that scope and how long they take, next to ours.
- **Body:** In a traditional engagement you pay for consultant hours. We model a review for a 20 to 100 person business at about 180 hours (120 to 300, depending on scope), so even an independent consultant or regional firm comes to about $15,600 or more, and recommendations commonly take 8 weeks or longer. In ours, AI does the reading, categorizing and modeling across every transaction, and people spend their hours checking the findings and making the recommendations. That's why it costs a fraction as much and typically takes 3 to 5 weeks.
- **Table:** {table} (figures from `src/data/consulting.ts`; caption: "Same scope of work: a diagnostic plus a prioritized roadmap")
  - Column labels:
    1. Provider
    2. Typical cost for this scope
    3. How it's billed
    4. Time to recommendations
    5. Typical minimum commitment
    6. Who does the analysis hours
  - Row labels (traditional providers, by category):
    1. Global strategy firm
    2. Big Four / large advisory firm
    3. Regional boutique firm
    4. Independent consultant or fractional executive
    5. Contingency expense-reduction firm
  - Our row label: Halyard AI Consulting
  - Our row cells while `site.consultingPrice` is `null`: Typical cost: "Fixed fee, scoped after a free assessment" · How it's billed: "One fixed fee, agreed before work starts" · Time to recommendations: "Typically 3 to 5 weeks" · Minimum commitment: "One fixed-scope review. No retainer." · Who does the analysis hours: "AI reads every transaction and runs the models. A person checks every finding."
  - Once `site.consultingPrice` is set: Typical cost: "{price_range}" · Line under the table: "That's {difference} less than the lowest modeled traditional cost for the same scope." (The component computes {difference} against the lowest traditional figure shown.)
  - Reference line (only if the table shows GSA figures): "GSA schedule hourly ceiling rates (federal contracts)"
- **Footnote:** Modeled estimate. Traditional costs are modeled as hourly or weekly rates × the time this scope takes, from public rate cards, government contract records and vendor benchmarks dated 2021 to 2026. Strategy-firm figures are 2021 list prices. Contingency firms charge a share of verified savings, typically equal to about 18 months of those savings. GSA schedule hourly ceiling rates (federal contracts) are federal not-to-exceed ceilings, not what firms charge small businesses. We compare scope, price and time, not results: no public source measures consulting outcomes. Provider categories, not named firms. Sources: cons-11, cons-14, cons-15, cons-16, cons-25, cons-26, cons-27, cons-31, cons-32, cons-33, cons-34, cons-36, cons-37, cons-38, lab-22.
- **CTAs:**
  - Primary: "Get a fixed-fee quote" → `/contact/`
  - Secondary: "See how the review works" → `#how-it-works`
- **Microcopy:** The free assessment comes first. You see the scope and the fixed fee in writing before any work starts.

### 7.7 Demo

- **id:** `demo`
- **Eyebrow:** See it work
- **Headline:** Watch a P&L turn into a ranked plan.
- **Subhead:** The agent reads the numbers, finds the opportunities, sizes them, builds the margin waterfall and lays out the roadmap.
- **Body:** None.
- **Cards:** **[Demo player: `consulting`, script in 8.8.]**
- **CTAs:** "See all six demos" → `/demos/`
- **Microcopy:** Simulated demo. Fictional business and modeled figures.

### 7.8 How we keep it honest

- **id:** `guardrails`
- **Eyebrow:** How we keep it honest
- **Headline:** Analysis you can check.
- **Subhead:** A roadmap is only useful if you trust the numbers behind it.
- **Body:** None.
- **Cards (6):**
  1. **Traceable numbers.** Every figure links back to the source data it came from.
  2. **Conservative assumptions.** When an estimate could go either way, we use the lower number and say so.
  3. **Ranges, not false precision.** Where the data is uncertain, savings are shown as a range.
  4. **A person checks every finding.** AI does the reading and the math. A person reviews every recommendation before it reaches you.
  5. **Thin data flagged.** Where data is missing or messy, we tell you how that limits the conclusion.
  6. **Confidential by default.** Your financials are used only for your analysis, accessed read-only and deleted on request when the engagement ends.
- **CTAs:** None.
- **Microcopy:** None.

### 7.9 What it's worth

- **id:** `worth`
- **Eyebrow:** What it's worth
- **Headline:** See how small fixes add up.
- **Subhead:** A worked example from our illustrative scenarios: a fictional business, a ranked list of opportunities and the margin math behind each one.
- **Body:** Consulting value usually comes from several modest fixes rather than one big one: a renegotiated contract, a price that caught up with costs, a process that stopped eating hours. The example below shows how we size each one and how they stack.
- **Cards:** **[Scenario embed: SCENARIOS.md, AI Consulting example, ideally shown with its margin waterfall.]**
- **Bullets ("What moves the number"):**
  - Your revenue and current margin
  - How long since prices and vendor contracts were last reviewed
  - How much of your team's time goes to manual, repeatable work
  - How quickly you act on the plan
- **CTAs:**
  - "Run your own numbers" → `/results/#calculator`
  - "See the full example" → `/results/#examples`
- **Microcopy:** Illustrative example. Modeled estimate, not a client result or a guarantee. "How we estimate" → `/results/#methodology`

### 7.10 FAQ

- **id:** `faq`
- **Eyebrow:** FAQ
- **Headline:** Questions about AI Consulting.
- **Subhead:** None.
- **Body:** None.
- **Bullets (5 Q&As):**
  1. **How is this different from what my accountant does?**
     Your accountant keeps the books accurate, compliant and filed. We use those books, plus your operational data, to look forward: where you're losing margin, what to fix first and what it's worth. We're happy to work alongside your accountant.
  2. **What data do you need?**
     Typically 12 to 24 months of profit and loss and balance sheet, a general ledger or transaction export, payroll summaries, vendor and customer lists, and any job, order or time data you have. Read-only access or exports both work. We send a checklist.
  3. **How long does it take?**
     Typically 3 to 5 weeks from kickoff to readout. The biggest factor is how quickly data can be shared.
  4. **Do we have to use you to implement the roadmap?**
     No. The roadmap and the model are yours. Some recommendations need agents we can build. Others are a phone call to a vendor. You choose who does what.
  5. **Is AI really doing the analysis?**
     AI does the heavy lifting: reading every transaction, categorizing spend, spotting patterns and running the models. A person checks every finding, adds business judgment and makes the recommendations. You get the speed of one and the judgment of the other.
- **CTAs:** None.
- **Microcopy:** None.

### 7.11 Final CTA

- **id:** `cta`
- **Eyebrow:** Free AI assessment
- **Headline:** Find out where your margin is going.
- **Subhead:** On a free 30-minute call we'll talk through your business and tell you where a review would likely find the most.
- **Body:** None.
- **Bullets:** None.
- **CTAs:**
  - Primary: "Book a free AI assessment" → `/contact/`
  - Secondary: "Estimate your savings" → `/results/#calculator`
- **Microcopy:** No cost, no obligation.

---

## 8. Demos `/demos/`

**Page job:** "See it work." All six simulations in one place, each with captions, a result card and an honest label.

**Business names** in the scripts below are suggestions. If the demo scripts or `SCENARIOS.md` use other fictional names, keep theirs and update the captions to match.

### 8.1 Hero

- **id:** `hero`
- **Eyebrow:** See it work
- **Headline (H1):** Watch AI agents do real work.
- **Subhead:** Six short simulations, one per job. Each follows an agent from the first message to the finished result, including the checks and handoffs we build in. Press play.
- **Body:** None.
- **Bullets:** None.
- **CTAs:**
  - Primary: "Start with the Customer Agent" → `#customer-agent`
  - Secondary: "Book a free AI assessment" → `/contact/`
- **Microcopy:** Simulated demos with fictional businesses and illustrative figures.

### 8.2 Demo index

- **id:** `index`
- **Eyebrow:** Six demos
- **Headline:** Pick a job.
- **Subhead:** Each demo runs on its own. Watch one, or watch them all.
- **Body:** None.
- **Cards (6; label, one line, service tag):**
  1. **Customer Agent.** A late-night chat becomes a booked job. *AI Agents* → `#customer-agent`
  2. **Analyst Agent.** A messy export becomes a clear answer. *AI Agents* → `#analyst-agent`
  3. **Executive Assistant.** An overflowing inbox becomes a short list. *AI Agents* → `#executive-assistant`
  4. **Marketing Director.** An ad audit becomes a running test plan. *AI Marketing Director* → `#marketing-director`
  5. **Sales Agent.** One prospect, researched and written to properly. *AI Sales Agent* → `#sales-agent`
  6. **Consulting.** A P&L becomes a ranked plan. *AI Consulting* → `#consulting`
- **CTAs:** None.
- **Microcopy:** None.

### 8.3 Demo: Customer Agent

- **id:** `customer-agent`
- **Eyebrow:** AI Agents · Customer Agent
- **Headline:** A late-night chat becomes a booked job.
- **Subhead:** 9:47 p.m. A homeowner messages Cedar Ridge Heating & Air about a noisy furnace. The office closed hours ago.
- **Body ("Watch for"):**
  - Questions from the company's own intake script
  - A safety check before anything else
  - A clean handoff for the question it shouldn't answer
- **Cards:**
  - Window title: Cedar Ridge Heating & Air · Website chat
  - Caption beats:
    1. 9:47 PM. A homeowner opens the website chat: the furnace bangs every time it starts.
    2. Safety first. The agent asks about any gas smell or a carbon monoxide alarm. A yes to either would trigger safety steps and a page to the on-call technician.
    3. No emergency. It asks two questions from the company's intake script: the system's age and when it was last serviced.
    4. It quotes the diagnostic visit from the price book and explains that the fee is credited toward the repair.
    5. It checks the dispatch calendar and offers two slots. The customer picks Thursday, 8 to 10 AM.
    6. Booked. The job lands in the scheduling system with notes for the technician, and a confirmation goes out by text.
    7. The customer asks about financing a new system. That's outside the agent's rules, so it flags a morning callback from the sales team, with the full transcript attached.
  - Result card ("Result", badge "Illustrative"): Booked at 9:52 PM, with the office closed · First reply: {seconds} seconds · Staff time used: 0 minutes · Estimated job value: {job_value} · Link: "See the math" → `/results/#examples`
- **CTAs:**
  - "Explore AI Agents" → `/services/ai-agents/#customer-agent`
  - "Book a free AI assessment" → `/contact/`
- **Microcopy:** Simulated demo. Cedar Ridge Heating & Air is a fictional business. Figures are illustrative.

### 8.4 Demo: Analyst Agent

- **id:** `analyst-agent`
- **Eyebrow:** AI Agents · Analyst Agent
- **Headline:** A messy export becomes a clear answer.
- **Subhead:** Monday morning at Hartwell Supply Co., a regional distributor. The sales export is a mess, and the owner wants to know why margin slipped.
- **Body ("Watch for"):**
  - Every cleanup step logged
  - Real formulas your team can follow
  - A plain-English answer with the numbers behind it
- **Cards:**
  - Window title: Hartwell Supply Co. · Q3 sales export.xlsx
  - Caption beats:
    1. The export lands: duplicate rows, three date formats and one customer spelled four different ways.
    2. Cleanup: duplicates merged, dates standardized and names matched. Every change goes into a log.
    3. The workbook takes shape: cost lookups, a margin column and a pivot table by product line and customer.
    4. A chart shows margin by product line over the last six months.
    5. A flag: margin on one product line fell after freight costs rose in July, while prices stayed the same.
    6. The agent writes the summary in plain English: what changed, why, and two options to consider.
    7. Delivered: the workbook to the shared drive and the summary to the owner's inbox.
  - Result card ("Result", badge "Illustrative"): Report time: {manual_hours} hours by hand, {agent_minutes} minutes with the agent · Issues flagged: {n} · Estimated value: {value} · Link: "See the math" → `/results/#examples`
- **CTAs:**
  - "Explore AI Agents" → `/services/ai-agents/#analyst-agent`
  - "Book a free AI assessment" → `/contact/`
- **Microcopy:** Simulated demo. Hartwell Supply Co. is a fictional business. Figures are illustrative.

### 8.5 Demo: Executive Assistant

- **id:** `executive-assistant`
- **Eyebrow:** AI Agents · Executive Assistant Agent
- **Headline:** An overflowing inbox becomes a short list.
- **Subhead:** 7:30 a.m. The operations manager at Linden Property Services has {n} unread emails and a review meeting at 10.
- **Body ("Watch for"):**
  - Clear triage buckets
  - Tasks assigned to the right person
  - A deck built on the company template
- **Cards:**
  - Window title: Linden Property Services · Inbox
  - Caption beats:
    1. 7:30 AM. {n} unread emails, two calendar conflicts and a review meeting at 10.
    2. Triage: needs you, delegated, waiting on others, FYI and junk. Only {needs_you} need her today.
    3. Replies drafted in her voice for the routine messages, waiting for her approval.
    4. Action items pulled out and assigned: a vendor quote to Marcus and a tenant request to Priya, each with a due date.
    5. A meeting booked with the HVAC vendor: time found, invite sent, agenda attached.
    6. The 10 a.m. deck: 8 slides on the company template, with charts from last month's numbers.
    7. The morning brief: one page with what's due, who's waiting and what changed overnight.
  - Result card ("Result", badge "Illustrative"): Inbox: {n} unread down to {needs_you} that need her · Tasks assigned: {tasks} · Time saved this morning: {minutes} minutes · Link: "See the math" → `/results/#examples`
- **CTAs:**
  - "Explore AI Agents" → `/services/ai-agents/#executive-assistant`
  - "Book a free AI assessment" → `/contact/`
- **Microcopy:** Simulated demo. Linden Property Services and its staff are fictional. Figures are illustrative.

### 8.6 Demo: Marketing Director

- **id:** `marketing-director`
- **Eyebrow:** AI Marketing Director
- **Headline:** An ad audit becomes a running test plan.
- **Subhead:** Oakline Roofing spends on Google and Meta ads but can't say which dollars bring in booked inspections.
- **Body ("Watch for"):**
  - Waste sized in dollars
  - Every change approved and logged
  - Budget moving only within the cap
- **Cards:**
  - Window title: Oakline Roofing · Ads overview
  - Caption beats:
    1. Connect: Google Ads, Meta Ads and the CRM where inspections get booked, all read-only.
    2. Audit: clicks from job seekers and DIY searches, ads showing three counties outside the service area, and two campaigns bidding on the same searches.
    3. Waste sized: {wasted_spend} a month in spend that never led to a booked inspection.
    4. Fixes proposed and approved: negative keywords, location settings and two campaigns merged into one.
    5. Experiments launched: three ad headlines, two landing page offers and one budget split, each with a stopping rule.
    6. Weeks later: cost per booked inspection is trending down. Budget shifts to the winners, inside the monthly cap.
    7. The weekly report: what changed, what we learned and what's next, in plain English.
  - Result card ("Result", badge "Illustrative"): Wasted spend found: {wasted_spend} a month · Cost per booked inspection: {before} to {after} · Spend kept within the cap every week · Link: "See the math" → `/results/#examples`
- **CTAs:**
  - "Explore the Marketing Director" → `/services/marketing/`
  - "Book a free AI assessment" → `/contact/`
- **Microcopy:** Simulated demo. Oakline Roofing is a fictional business. Figures are illustrative.

### 8.7 Demo: Sales Agent

- **id:** `sales-agent`
- **Eyebrow:** AI Sales Agent
- **Headline:** One prospect, researched and written to properly.
- **Subhead:** Parkline IT wants more law and accounting firms as clients. The agent finds one, does its homework and writes to the managing partner.
- **Body ("Watch for"):**
  - Prospects skipped when there's no real reason to write
  - Every fact linked to a source
  - The quality check before the send
- **Cards:**
  - Window title: Parkline IT · Prospect dossier: Hollis & Grant
  - Caption beats:
    1. The profile: law and accounting firms with 10 to 50 staff, within 40 miles, recently expanded or hiring for operations roles.
    2. The list: matching firms found and checked against the CRM. Three skipped: no clear reason to reach out.
    3. The dossier: Hollis & Grant opened a second office last month and posted an office manager role that includes IT.
    4. The draft: under 100 words, one specific observation, one useful offer and no meeting request.
    5. The quality check: facts verified against sources, tone matched, length OK, no spam phrasing, address and opt-out included.
    6. The contrast: the generic AI email for the same prospect, with its problems marked.
    7. Sent within today's limit and logged in the CRM. A follow-up is scheduled only if there's no reply.
  - Emails shown: the two emails from 6.3, word for word.
  - Result card ("Result", badge "Illustrative"): Research time per prospect: {manual_minutes} minutes by hand, {agent_minutes} with the agent · Emails sent today: {n}, every one quality-checked · Prospects skipped for lack of a reason: {skipped} · Link: "See the math" → `/results/#examples`
- **CTAs:**
  - "Explore the Sales Agent" → `/services/sales/`
  - "Book a free AI assessment" → `/contact/`
- **Microcopy:** Simulated demo. Parkline IT, Hollis & Grant and the people named are fictional. Figures are illustrative.

### 8.8 Demo: Consulting

- **id:** `consulting`
- **Eyebrow:** AI Consulting
- **Headline:** A P&L becomes a ranked plan.
- **Subhead:** Harbor Table Restaurant Group runs three restaurants and wants to know why margin keeps slipping.
- **Body ("Watch for"):**
  - Opportunities ranked by value and effort
  - The margin waterfall
  - A roadmap with owners and dates
- **Cards:**
  - Window title: Harbor Table Restaurant Group · Margin review
  - Caption beats:
    1. Data in: 24 months of P&L, payroll summaries, vendor invoices and sales by menu item.
    2. Spend trended: food costs rising faster than menu prices, two overlapping software subscriptions and overtime clustered on two weekdays.
    3. Menu margin: three popular dishes are underpriced for what their ingredients cost today.
    4. Opportunities ranked by annual impact, effort and payback.
    5. The margin waterfall: today's margin, plus each fix, up to the potential margin.
    6. The roadmap: a 90-day plan with owners, first steps and expected savings.
  - Result card ("Result", badge "Modeled estimate"): Opportunities found: {n} · Modeled annual impact: {range} · Payback on the first three: {payback} · Link: "See the math" → `/results/#examples`
- **CTAs:**
  - "Explore AI Consulting" → `/services/consulting/`
  - "Book a free AI assessment" → `/contact/`
- **Microcopy:** Simulated demo. Harbor Table Restaurant Group is a fictional business. Figures are modeled estimates.

### 8.9 Player microcopy (shared by all demo players)

- **id:** None (component copy).
- **Section fields:** Not applicable. Eyebrow, headline, subhead, body, cards, CTAs and microcopy for each demo live in 8.3 to 8.8. This is the copy inside the player component they all share.
- **Buttons:** "Play demo" · "Pause" · "Resume" · "Replay" · "Skip to result"
- **Progress:** "Step {n} of {total}"
- **Paused state:** "Paused"
- **Transcript toggle:** "Read the step-by-step" / "Hide the step-by-step"
- **Captions region label (screen readers):** "Demo captions"
- **Badge on every player:** "Simulated demo"
- **Result card heading:** "Result", with the link "See the math"
- **Reduced motion and no-JavaScript lines:** see 1.6.

### 8.10 What's real here

- **id:** `whats-real`
- **Eyebrow:** What's real here
- **Headline:** Simulated, but not made up.
- **Subhead:** These demos are scripted simulations, not recordings of client work.
- **Body:** The workflows, checks, approvals and handoffs are the ones we build. The businesses, people, messages and numbers are invented to show how the work flows.
- **Bullets (3):**
  1. **Real:** the steps, the guardrails and the handoff rules.
  2. **Fictional:** the businesses, people and conversations.
  3. **Illustrative:** every figure and every result card.
- **CTAs:** "How we estimate" → `/results/#methodology`
- **Microcopy:** None.

### 8.11 Final CTA

- **id:** `cta`
- **Eyebrow:** Free AI assessment
- **Headline:** Want to see it on your own work?
- **Subhead:** On the free assessment we'll walk through what an agent would do with a real example from your business.
- **Body:** None.
- **Bullets:** None.
- **CTAs:**
  - Primary: "Book a free AI assessment" → `/contact/`
  - Secondary: "Estimate your savings" → `/results/#calculator`
- **Microcopy:** No cost, no obligation.

---

## 9. Results `/results/`

**Page job:** let a skeptical, ROI-driven buyer check the value for themselves, and show exactly how every number is built.

### 9.1 Hero

- **id:** `hero`
- **Eyebrow:** Savings and examples
- **Headline (H1):** Check the math before you commit.
- **Subhead:** Estimate what AI agents could save your business, then walk through four worked examples with every assumption on the page.
- **Body:** None.
- **Bullets:** None.
- **CTAs:**
  - Primary: "Estimate your savings" → `#calculator`
  - Secondary: "See the examples" → `#examples`
- **Microcopy:** Every number here is a modeled estimate or an illustrative example. None are client results.

### 9.2 Savings calculator

- **id:** `calculator`
- **Eyebrow:** Savings calculator
- **Headline:** Estimate your monthly savings.
- **Subhead:** Four inputs and conservative defaults. Change anything and the estimate updates.
- **Body:** None.
- **Bullets, inputs (label, then helper text):**
  1. **People who'd work with agents.** Count the people whose repetitive work you'd want help with, not your whole company.
  2. **Hours per person per week on repetitive work.** Email, data entry, scheduling, reporting and follow-ups. A rough guess is fine.
  3. **Average hourly cost.** Wages plus payroll taxes and benefits. If you only know the wage, use that. The estimate will just be more conservative.
  4. **Share an agent could take on.** Starts low on purpose. On the assessment we size it task by task.
- **Bullets, outputs (label, then helper text):**
  1. **Hours back per month.** The repetitive hours agents could take on each month.
  2. **Estimated monthly value.** Hours back multiplied by your hourly cost.
  3. **Estimated yearly value.** Monthly value multiplied by 12.
  4. **Capacity freed.** The same hours, expressed as full-time people.
- **"How this is calculated" (disclosure panel):**
  - Hours back per month = people × weekly hours on repetitive work × share an agent takes on × 50 weeks ÷ 12 months.
  - Monthly value = hours back per month × hourly cost.
  - Capacity freed = hours back per month ÷ 157, the hours a full-time person actually works in a month.
  - 50 weeks, not 52, because routine tasks pause for holidays and leave. 157 is 1,880 hours actually worked a year ÷ 12 months, rounded. The default hourly cost is $29: the national median wage for routine office work, plus taxes and benefits at a small business (BLS; lab-01, lab-06). If the calculator config uses other constants or defaults, update this text to match it.
- **Dynamic microcopy:**
  - Empty state: "Enter your numbers to see an estimate."
  - Result sentence: "That's about {fte} full-time people's worth of repetitive work each month."
  - Validation: "Enter a number between {min} and {max}."
  - Capacity note (always visible under the result): "Hours saved are capacity. They turn into dollars when they cut overtime or temp help, avoid a hire, or go into work that earns revenue."
- **CTAs:** "Get a tailored estimate" → `/contact/`
- **Microcopy:** Modeled estimate, before our fees. Not a quote, a guarantee or a client result.

### 9.3 How we estimate

- **id:** `methodology`
- **Eyebrow:** How we estimate
- **Headline:** Our rules for numbers.
- **Subhead:** Every figure on this site follows the same rules. If a number can't meet them, it doesn't appear.
- **Body:** None.
- **Cards (7):**
  1. **Conservative by default.** When an assumption could go either way, we choose the one that makes the savings smaller.
  2. **Hours aren't dollars until they are.** Time saved is capacity. We count it as money only when it cuts overtime or temp help, avoids a hire, or goes into work that earns revenue, and we say which.
  3. **Fully loaded cost.** In our examples, staff time is valued at wages plus taxes and benefits, not the wage alone.
  4. **Partial automation.** Agents rarely take over a whole job. Our examples assume they handle part of the work and that people review the rest.
  5. **Before our fees.** Estimates don't subtract our fees, because fees depend on scope. Your proposal shows net savings and payback.
  6. **Labeled everywhere.** Every figure is marked as an illustrative example or a modeled estimate, with its assumptions nearby.
  7. **Sourced or left out.** We use outside statistics only when we can cite the source. Otherwise we leave them out.
- **CTAs:** None.
- **Microcopy:** Questions about a number? Ask us and we'll walk you through it. → `/contact/`
- **Sources line (under the cards):** Our defaults come from public data: BLS wages and employer costs (lab-01, lab-06), a randomized trial of AI email assistance (ai-15) and published consulting rates and contracts (cons-11, cons-25, cons-33). Full list on request.

### 9.4 Illustrative examples

- **id:** `examples`
- **Eyebrow:** Illustrative examples
- **Headline:** Four worked examples, math included.
- **Subhead:** Each uses a fictional business, conservative assumptions and arithmetic you can check line by line.
- **Body:** None.
- **Cards:** **[Scenario embed: SCENARIOS.md, all four examples, shown as tabs: AI Agents · Marketing Director · Sales Agent · Consulting.]** Each example uses these labels, filled from `SCENARIOS.md`:
  - Badge: "Illustrative example"
  - "The business"
  - "The situation today"
  - "What the agent does"
  - "The math" (table columns: "Line item", "Value", "Where the number comes from")
  - "Modeled result"
  - "Assumptions"
  - "What could make it lower"
  - "What isn't counted"
  - Link: "Watch the matching demo" → `/demos/#{demo-id}`
- **CTAs:** "Run your own numbers" → `#calculator`
- **Microcopy:** Fictional businesses. Modeled estimates, not client results.

### 9.5 Our approach to proof

- **id:** `proof`
- **Eyebrow:** Our approach to proof
- **Headline:** No invented proof.
- **Subhead:** Halyard is a young firm. Instead of borrowed credibility, we give you things you can check.
- **Body:** You won't find testimonials, client logos, star ratings or unsourced statistics on this site. You'll find demos you can watch, math you can check and a pilot with a success measure agreed in writing before we start.
- **Bullets, column "You won't see":** Testimonials or reviews · Client logos or names · Guaranteed ROI · Statistics without a source
- **Bullets, column "You will see":** Working demos · Assumptions next to every number · A written success measure for your pilot · Straight answers, including "AI isn't the fix here"
- **CTAs:** "See how a pilot works" → `/approach/#engagements`
- **Microcopy:** None.

### 9.6 Final CTA

- **id:** `cta`
- **Eyebrow:** Free AI assessment
- **Headline:** Get an estimate built on your numbers.
- **Subhead:** On a free 30-minute call we'll size the opportunities task by task, then send a written summary with every assumption shown.
- **Body:** None.
- **Bullets:** None.
- **CTAs:** Primary: "Book a free AI assessment" → `/contact/`
- **Microcopy:** No cost, no obligation.

---

## 10. Approach `/approach/`

**Page job:** answer "how does this actually work, who does what, and how do I stay in control?" in enough detail to remove risk.

### 10.1 Hero

- **id:** `hero`
- **Eyebrow:** How we work
- **Headline (H1):** Prove it on one job. Then scale what works.
- **Subhead:** We start with the work that costs you the most, prove the agent on your real tasks with your people in control, and expand only when the numbers say so.
- **Body:** None.
- **Bullets:** None.
- **CTAs:**
  - Primary: "Book a free AI assessment" → `/contact/`
  - Secondary: "See engagement models" → `#engagements`
- **Microcopy:** None.

### 10.2 Principles

- **id:** `principles`
- **Eyebrow:** Principles
- **Headline:** Five rules we work by.
- **Subhead:** None.
- **Body:** None.
- **Cards (5):**
  1. **Start with the work, not the technology.** We look at where your time and money go before we talk about tools.
  2. **Prove it small.** One job, one agent, one success measure. Then expand.
  3. **People stay in control.** Approvals, limits and handoffs are designed in from day one.
  4. **Measure in hours and dollars.** A baseline before we start, and a report against it every month.
  5. **No black boxes.** Every agent is documented: what it does, what it can access and the rules it follows.
- **CTAs:** None.
- **Microcopy:** None.

### 10.3 The process in detail

- **id:** `process`
- **Eyebrow:** The process
- **Headline:** What happens, step by step.
- **Subhead:** Each phase has a clear output and a clear decision point, so you always know what's next and why.
- **Body:** None.
- **Cards (5 phases):**
  1. **Free assessment**
     - What happens: A 30-minute call about how your business runs, where the hours go and which tools you use.
     - What you get: A written summary with your top opportunities ranked by value, a rough savings estimate and a suggested first project.
     - What we need from you: Thirty minutes and a rough sense of where time goes.
     - Timing: Typically scheduled within a week, with the summary in about 3 business days.
  2. **Discovery and design**
     - What happens: We map the workflow with the people who do it today, gather the knowledge the agent needs and agree on its rules and limits.
     - What you get: A one-page agent spec covering what it does, what it can access, what always goes to a person, the baseline and the success measure.
     - What we need from you: A decision-maker for a few short sessions, plus examples, FAQs, price lists and templates.
     - Timing: Typically 1 to 2 weeks.
  3. **Build and test**
     - What happens: We connect your tools with least-privilege access, build the agent and test it against your past work.
     - What you get: A test report comparing the agent's work with your team's on real past cases.
     - What we need from you: Access to the tools in scope and someone to answer questions.
     - Timing: Typically 1 to 2 weeks.
  4. **Pilot**
     - What happens: The agent works live with approvals switched on. We review its work daily at first, then weekly.
     - What you get: A pilot report against the success measure, with a clear go, adjust or stop recommendation.
     - What we need from you: Quick reviews of the agent's work, especially in the first two weeks.
     - Timing: Typically 2 to 4 weeks.
  5. **Run and improve**
     - What happens: We monitor, tune and maintain the agent, expand what it can do when you approve, and plan what's next.
     - What you get: A monthly report in hours and dollars, and a quarterly roadmap review.
     - What we need from you: About 30 minutes a month for the review.
     - Timing: Ongoing.
- **CTAs:** None.
- **Microcopy:** Timelines depend on scope and access. You get a dated plan before work starts.

### 10.4 Engagement models

- **id:** `engagements`
- **Eyebrow:** Engagement models
- **Headline:** Three ways to work together.
- **Subhead:** Every engagement is scoped and priced in writing after the free assessment.
- **Body:** None.
- **Cards (3):**
  1. **Pilot.** *Prove it on one job.*
     - Best for: your first project, or trying a new service.
     - Includes: discovery and design for one agent or one focused project · integration with the tools in scope · testing on your past work · a live pilot with approvals on · daily, then weekly, quality reviews · a results report against the success measure · a go, adjust or stop recommendation
     - Length: typically 4 to 8 weeks.
     - CTA: "Start with a pilot" → `/contact/`
  2. **Managed.** *We run it. You get the results.*
     - Best for: businesses that want agents working every day without managing them.
     - Includes: everything from the pilot, carried into daily operation · monitoring, maintenance and tuning · new skills and rules within the agreed scope · updates when your tools, prices or policies change · a monthly report in hours and dollars · a named lead and a direct line · a quarterly roadmap review
     - Length: ongoing.
     - CTA: "Talk about managed agents" → `/contact/`
  3. **Partner.** *Your AI team, across the business.*
     - Best for: mid-size companies putting AI to work across several teams.
     - Includes: several agents and services under one plan · quarterly AI Consulting reviews of cost and margin · priority builds for new agents · executive reporting across every agent · staff training and an AI use policy · planning sessions with your leadership team · coordination with your IT provider and other vendors
     - Length: ongoing, with quarterly planning.
     - CTA: "Talk about a partnership" → `/contact/`
- **CTAs:** Each card has its own.
- **Microcopy:** AI Consulting can also be booked as a standalone project. Scope, price and terms are always agreed in writing before work starts.

### 10.5 Security and data handling

- **id:** `security`
- **Eyebrow:** Security and data handling
- **Headline:** How we handle access to your business.
- **Subhead:** These are the practices we follow on every engagement. We describe what we do rather than pointing to badges, and we'll answer your security questionnaire in writing.
- **Body:** None.
- **Cards (8):**
  1. **Least-privilege access.** Each agent gets only the access its job needs, read-only wherever possible, with its own credentials. We review access regularly and remove it when it's no longer needed.
  2. **Business-grade AI providers.** We build on business-grade AI services whose terms exclude training on your data. Your information is used to do your work.
  3. **Only the data a job needs.** We connect the minimum a workflow requires, avoid copying data out of your systems and don't keep what we don't need.
  4. **Rules for sensitive data.** Payment details, health information and personal records get explicit rules: masked, excluded or kept in the systems built for them. We agree these with you, and your compliance lead if you have one, before anything connects.
  5. **Secure credentials.** Passwords and keys are kept in a secure vault and never shared over email or chat.
  6. **Audit logs.** Every agent action is logged with what happened, when and why, and the logs are available to you.
  7. **Incident response.** If something goes wrong, we pause the affected agent, tell you promptly, fix the cause and write up what happened.
  8. **A clean exit.** When an engagement ends, we remove our access, hand over documentation and delete working copies of your data on request.
- **CTAs:** "Send us your security questionnaire" → `/contact/`
- **Microcopy:** These are our practices, not certifications or guarantees. If you work in a regulated field, we scope data handling with your compliance lead before anything connects.

### 10.6 Human in the loop and controls

- **id:** `controls`
- **Eyebrow:** Human in the loop
- **Headline:** Agents earn autonomy. You decide how much.
- **Subhead:** Every agent starts with people approving its work. It takes on more only when its track record supports it, and only when you say so.
- **Body:** None.
- **Cards, group 1, "Four levels of autonomy":**
  1. **Level 1: Draft.** The agent prepares the work. A person does the sending, booking or changing.
  2. **Level 2: Approve.** The agent acts once a person approves each item.
  3. **Level 3: Spot-check.** The agent handles routine work on its own. People review a sample and every exception.
  4. **Level 4: Within limits.** The agent handles routine work end to end, inside hard limits. Anything outside them goes to a person.
- **Cards, group 2, "Controls you keep":**
  1. **Approval rules.** Choose what needs a yes: by category, dollar amount, customer type or anything else.
  2. **Hard limits.** Spending caps, send limits, discount and refund ceilings, and hours of operation the agent can't exceed.
  3. **Escalation rules.** Complaints, legal or medical questions, safety issues, VIP customers and large orders always go to a person.
  4. **Clear handoffs.** When an agent passes something to a person, it includes the full context and a summary.
  5. **Quality reviews.** We review samples of agent work weekly at first and monthly once things are stable, and we track accuracy over time.
  6. **An off switch.** Pause any agent at any time, and your team picks up where it left off.
- **CTAs:** None.
- **Microcopy:** You can move any agent down a level, or pause it, at any time.

### 10.7 What we need from you

- **id:** `what-we-need`
- **Eyebrow:** What we need from you
- **Headline:** A little of your time, at the right moments.
- **Subhead:** Done for you doesn't mean done without you. Here's what makes an engagement go well.
- **Body:** None.
- **Bullets (6):**
  1. **One decision-maker.** Someone who can approve rules and make calls: typically a couple of hours in the first week, then about 30 minutes a week during the pilot.
  2. **Access to your tools.** Admin or delegated access to the systems in scope. We send a checklist and set up least-privilege accounts with you.
  3. **Your know-how.** FAQs, price lists, policies, templates and examples of work you're proud of. Rough is fine.
  4. **A rough baseline.** Today's numbers, like response times, hours spent or cost per lead, so we can measure the change. We'll help you pull them.
  5. **Quick feedback early on.** Fast reviews of the agent's work in the first two weeks make the biggest difference to quality.
  6. **A word to your team.** People do better with change they understand. We'll help you explain what's changing and why.
- **CTAs:** None.
- **Microcopy:** None.

### 10.8 FAQ

- **id:** `faq`
- **Eyebrow:** FAQ
- **Headline:** Questions about working with us.
- **Subhead:** None.
- **Body:** None.
- **Bullets (6 Q&As):**
  1. **Do we have to sign a long-term contract?**
     No long-term commitment is needed to start. A Pilot has a fixed scope and ends with a results report and a go, adjust or stop recommendation. If you continue, we agree the terms in writing.
  2. **Who will we work with?**
     The people who design and build your agents. You get one named lead who knows your business and answers your questions directly. There's no handoff from a sales team to a support queue.
  3. **What if the pilot misses its target?**
     We tell you plainly, explain why and recommend whether to adjust the approach, try a different job or stop. You decide, and you're under no obligation to continue.
  4. **Who owns what you build?**
     Your data and accounts stay yours, and so does the business knowledge we organize for your agents, like FAQs, price lists and rules. We set things up in accounts you own wherever possible and document how everything works. Ownership terms are spelled out in your agreement.
  5. **Can you work with our IT provider or marketing agency?**
     Yes. We coordinate access with your IT provider and keep them informed about what we connect. The Marketing Director can run alongside your agency, sharing findings and test results.
  6. **Do you train our team?**
     Yes. Short, practical sessions on reviewing agent work, changing rules and handling handoffs, plus a one-page guide for each agent.
- **CTAs:** None.
- **Microcopy:** None.

### 10.9 Final CTA

- **id:** `cta`
- **Eyebrow:** Free AI assessment
- **Headline:** Start with a conversation, not a contract.
- **Subhead:** Thirty minutes, no cost. You get a written summary of where AI would pay off first, and what it would take.
- **Body:** None.
- **Bullets:** None.
- **CTAs:**
  - Primary: "Book a free AI assessment" → `/contact/`
  - Secondary: "Estimate your savings" → `/results/#calculator`
- **Microcopy:** None.

---

## 11. Contact `/contact/`

**Page job:** make booking the free assessment easy and low-risk, and set clear expectations for what happens next.

### 11.1 Hero

- **id:** `hero`
- **Eyebrow:** Free AI assessment
- **Headline (H1):** Book your free AI assessment.
- **Subhead:** Tell us a little about your business. We'll come prepared, and you'll leave with a written plan, whether or not you work with us.
- **Body:** None.
- **Bullets:** None.
- **CTAs:** None. The form is the action.
- **Microcopy:** Takes about 2 minutes.

### 11.2 Form

- **id:** `form`
- **Eyebrow:** None.
- **Headline:** Tell us about your business.
- **Subhead:** Five required fields. The rest helps us prepare.
- **Body:** None.
- **Bullets (fields, in order):**

| # | Field | Required | Type | Label | Placeholder | Helper text |
|---|---|---|---|---|---|---|
| 1 | name | Yes | text | Full name | Jordan Lee | None |
| 2 | email | Yes | email | Work email | jordan@yourcompany.com | We'll send your assessment summary here. No newsletters. |
| 3 | company | Yes | text | Company | Company name | None |
| 4 | website | Optional | url | Website | yourcompany.com | Helps us prepare. We'll take a look before the call. |
| 5 | role | Optional | select | Your role | Choose one | Options: Owner or founder · CEO or president · COO or operations · General manager · Office or operations manager · Marketing · Sales · Finance · Other |
| 6 | team_size | Yes | select | Team size | Choose one | Options: 1-4 · 5-19 · 20-49 · 50-199 · 200-500 · More than 500 |
| 7 | industry | Optional | select | Industry | Choose one | Options: Home services · Dental, medical or vet · Law or accounting · Real estate · Restaurants and hospitality · Retail and e-commerce · Distribution or manufacturing · Agency or professional services · Fitness and wellness · Multi-location services · Other |
| 8 | interests | Yes | checkboxes | What would you like help with? | None | Pick any that apply. Options: Answering customers (Customer Agent) · Spreadsheets, reports and numbers (Analyst Agent) · Email, scheduling and admin (Executive Assistant) · Ads and marketing (Marketing Director) · Finding new customers (Sales Agent) · Costs, pricing and margin (Consulting) · Not sure yet |
| 9 | time_sink | Optional | textarea | Where does your team lose the most time? | For example: we answer the same questions by phone all day, or month-end reporting takes a week. | A sentence or two is plenty. |
| 10 | tools | Optional | text | Tools you use | QuickBooks, Outlook, Excel, HubSpot, Google Ads | Helps us come with specific ideas. |
| 11 | ad_spend | Optional (shown only when "Ads and marketing" is checked) | select | Monthly ad spend | Choose one | Rough is fine. Options: Under $2,000 · $2,000 to $10,000 · $10,000 to $50,000 · More than $50,000 · Not sure |
| 12 | phone | Optional | tel | Phone | (555) 555-0100 | Only if you'd rather we call. |
| 13 | source | Optional | text | How did you hear about us? | None | None |

- **CTAs:** Submit button: "Request my free assessment"
- **Microcopy:**
  - Optional fields carry the word "Optional" next to the label.
  - Submitting state: "Sending..."
  - Success (replaces the form): **"Thanks, {first_name}. We've got it."** We'll reply within one business day to find a time for your call. Look for an email from {contact.email}.
  - Error: "Something went wrong on our end. Please try again, or email us at {contact.email}."
  - Validation: Name: "Please enter your name." · Email: "Please enter a valid email, like name@company.com." · Company: "Please enter your company name." · Team size: "Please choose a team size." · Help with: "Pick at least one, or choose 'Not sure yet'."
  - Privacy note (under the button): We use your details only to respond to your request and prepare for the call. We don't sell or share them.

### 11.3 What happens next

- **id:** `what-happens-next`
- **Eyebrow:** What happens next
- **Headline:** Three steps, no pressure.
- **Subhead:** None.
- **Body:** None.
- **Cards (3 steps):**
  1. **We reply within one business day.** We'll find a 30-minute slot that suits you. Video or phone, your choice.
  2. **We talk through your business.** How work flows, where the hours go and which tools you use. No preparation needed, though one painful example helps.
  3. **You get a written summary.** Typically within 3 business days: your top opportunities ranked by value, a rough savings estimate with the assumptions shown, and a suggested first step. Yours to keep.
- **CTAs:** None.
- **Microcopy:** None.

### 11.4 The free assessment

- **id:** `assessment`
- **Eyebrow:** The free assessment
- **Headline:** What's included.
- **Subhead:** A practical conversation with the people who would build your agents. Not a sales pitch.
- **Body ("What it isn't"):** It isn't a hard sell. If AI isn't the right fix for your business right now, we'll say so and tell you what we'd do instead.
- **Bullets ("You get"):**
  1. A 30-minute call focused on your business, not our slides
  2. A look at where your team's time and money go
  3. Your top three AI opportunities, ranked by estimated value and effort
  4. A rough savings estimate, labeled as a modeled estimate, with the assumptions shown
  5. A suggested first project and what it would take
- **CTAs:** None. The form sits beside this panel.
- **Microcopy:** Free, with no obligation. We'll never ask for passwords or system access on the call.

### 11.5 Other ways to reach us

- **id:** `contact-details`
- **Eyebrow:** None.
- **Headline:** Other ways to reach us.
- **Subhead:** None.
- **Body:** None.
- **Bullets:**
  - **Prefer email?** {contact.email}
  - **Security questionnaire or RFP?** Send it to {contact.email} and we'll reply in writing.
  - **Response time.** Within one business day.
- **CTAs:** None.
- **Microcopy:** None.

### 11.6 FAQ

- **id:** `faq`
- **Eyebrow:** FAQ
- **Headline:** Before you book.
- **Subhead:** None.
- **Body:** None.
- **Bullets (4 Q&As):**
  1. **Is it really free?**
     Yes. No cost and no obligation. The written summary is yours either way.
  2. **Who will I talk to?**
     The people who would design and build your agents, not a sales rep.
  3. **Do I need to prepare anything?**
     No. If you can, bring one example of work that eats your team's time: a report, a common customer question or an inbox you dread.
  4. **What if we're not ready for AI?**
     Then we'll tell you, and share what would get you ready. That's a useful outcome too.
- **CTAs:** None.
- **Microcopy:** None.

---

## 12. 404

### 12.1 Not found

- **id:** `not-found`
- **Eyebrow:** Error 404
- **Headline (H1):** We couldn't find that page.
- **Subhead:** The link may be old, or the page may have moved. Here are some good places to pick up.
- **Body:** None.
- **Cards (4 links):**
  1. **Home.** The whole story on one page. → `/`
  2. **Services.** What we build and run. → `/services/`
  3. **Demos.** Watch agents do real work. → `/demos/`
  4. **Free assessment.** 30 minutes, no cost. → `/contact/`
- **CTAs:** "Back to home" → `/`
- **Microcopy:** Followed a link on our site? Tell us at {contact.email} and we'll fix it.

---

## Appendix A. Claims for founder review

The copy above is written as if each of these is confirmed. Change the copy wherever one isn't.

| # | Claim or commitment | Where it appears | What to confirm |
|---|---|---|---|
| 1 | The free assessment is a 30-minute call | Home hero, process, CTA; Contact; Approach; service CTAs | Call length |
| 2 | Written summary in about 3 business days | Home process; Approach 10.3; Contact 11.3 | Turnaround you can keep |
| 3 | Reply within one business day | Contact 11.2, 11.3, 11.5 | Response time |
| 4 | Assessment typically scheduled within a week | Approach 10.3 | Calendar capacity |
| 5 | "The people who would build your agents" take the call; one named lead; no sales-to-support handoff | Home CTA; Contact; Approach FAQ; Services 3.5 | Staffing model |
| 6 | Durations: Design 1 to 2 weeks, Build 1 to 2, Pilot 2 to 4, Pilot model 4 to 8, first agent live 2 to 4 weeks after kickoff, Consulting 3 to 5, marketing audit in the first 2 weeks, first sales sends from week 3 or 4 | Home; services pages; Approach | Realistic for your delivery capacity |
| 7 | Client time: a couple of hours in week one, about 30 minutes a week in the pilot, about 30 minutes a month after | Home FAQ 3; Approach 10.3, 10.7; Pillar 1 | Time ask |
| 8 | No long-term commitment needed to start | Approach FAQ 1 | Contract terms |
| 9 | Ownership and exit: client keeps data, accounts and organized knowledge; documentation; access removed; working copies deleted on request | Home FAQ 10; Approach 10.5, FAQ 4; Consulting 7.8 | Agreement template |
| 10 | Security practices: per-agent credentials, secure vault, audit logs available to the client, incident write-ups, read-only by default, regular access reviews | Home 2.10; Approach 10.5; AI Agents 4.8 | Tooling supports each one |
| 11 | Business-grade AI providers whose terms exclude training on client data | Home; Approach; Pillar 3 | Current terms of every provider used |
| 12 | Compliance practices: CAN-SPAM setup, immediate opt-outs, CASL/GDPR scoping, call-recording notice, text and call consent, AI disclosure | Sales 6.9; AI Agents 4.8, 4.10 | Processes in place; counsel review. The site already says this isn't legal advice. |
| 13 | Spending caps set inside the ad platforms; agent can't raise them | Marketing 5.6, FAQ 2 | Account permissions set up this way |
| 14 | "At a fraction of the cost" of a traditional consulting engagement; "One fixed-scope review. No retainer." | Consulting 7.1, 7.6; Services 3.3; Home 2.9 teaser | Pricing supports it once `site.consultingPrice` is set. Until then no percentage or dollar saving for our side is stated (DECISIONS 2026-10-12) |
| 15 | "Halyard is a young firm" | Home FAQ 9; Results 9.5 | Keep, soften or remove |
| 16 | Written answers to security questionnaires | Home 2.10; Approach 10.5; Contact 11.5 | Capacity to do it |
| 17 | Customer Agent replies in Spanish | AI Agents 4.3 | Language support you'll stand behind |
| 18 | Integrations named in the strip and on service pages | Home 2.2; service pages | Each can be connected for a typical client (API access, plan tier) |
| 19 | Sourced statistic (HBR, 2011) | AI Agents 4.3 (optional) | Check the exact wording against the full article; show only with the source line |
| 20 | Form privacy note: details used only to respond, never sold or shared | Contact 11.2 | Matches the form provider's data handling |

## Appendix B. Sources

1. James B. Oldroyd, Kristina McElheran and David Elkington, "The Short Life of Online Sales Leads," *Harvard Business Review*, March 2011. https://hbr.org/2011/03/the-short-life-of-online-sales-leads. Used for the optional speed-to-lead statistic in 4.3.
2. Federal Trade Commission, "CAN-SPAM Act: A Compliance Guide for Business." https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business. Used for 6.9: the law makes no exception for business-to-business email, and its opt-out and postal-address requirements.
3. Google, "Email sender guidelines" (Gmail Help). https://support.google.com/a/answer/81126. Used for 6.9: authentication requirements (SPF, DKIM, DMARC) for bulk senders, enforced from February 2024 and matched by Yahoo.

## Appendix C. Embed and token index

**Scenario embeds (numbers from `content/SCENARIOS.md`):**

| Slot | Section | What it shows |
|---|---|---|
| Home examples | 2.7 | One summary card per service (4) |
| AI Agents worth | 4.9 | AI Agents example (tabs per agent if SCENARIOS.md has three) |
| Marketing worth | 5.7 | AI Marketing Director example |
| Sales worth | 6.10 | AI Sales Agent example |
| Consulting worth | 7.9 | AI Consulting example, with margin waterfall |
| Results examples | 9.4 | All four examples, full math |

**Demo result tokens (from the demo scripts):** `{seconds}`, `{job_value}` (8.3) · `{manual_hours}`, `{agent_minutes}`, `{n}`, `{value}` (8.4) · `{n}`, `{needs_you}`, `{tasks}`, `{minutes}` (8.5) · `{wasted_spend}`, `{before}`, `{after}` (8.6) · `{manual_minutes}`, `{agent_minutes}`, `{n}`, `{skipped}` (8.7) · `{n}`, `{range}`, `{payback}` (8.8)

**Config tokens:** `{contact.email}`, `{year}`, `{first_name}` (from the form), plus `brand.name` behind every "Halyard".

**Calculator tokens:** `{fte}`, `{min}`, `{max}` (9.2)

**Fictional names used in this deck (all invented):** Cedar Ridge Heating & Air · Hartwell Supply Co. · Linden Property Services (staff: Marcus, Priya) · Oakline Roofing · Parkline IT (Sam Ortiz) · Hollis & Grant (Dana Whitaker) · Harbor Table Restaurant Group · form placeholder name Jordan Lee

## Calibration changelog

2026-10-13, numbers and claims pass against `content/BENCHMARKS.md` (base values; conservative in headlines):

- Voice guide (0.5) example: "6 hours a week × $38 an hour × 4.33 weeks = $987 a month" replaced with "1.2 hours a week of email time × $29 an hour × 50 weeks = $1,740 a year" (base email hours returned, routine office loaded cost, weeks per year; ai-15, lab-01, lab-06). The old hours and rate had no source.
- Calculator (9.2): 4.33 weeks a month changed to 50 weeks ÷ 12. Capacity divisor 173 changed to 157 (1,880 hours worked a year ÷ 12). Default hourly cost stated as $29, with sources.
- Methodology (9.3): added a sources line with BENCHMARKS ids.
- Home outcomes (2.3): "books the job" now "books routine jobs and passes the rest" (AI resolves a routine subset, base 55%, not every conversation). "The pipeline fills" now "Prospecting keeps moving" (base is about 0.7 held meetings per 1,000 prospects).
- Home FAQ 4: "Will AI replace my employees?" now answers "No" and frames agents as task-level, not whole-job.
- Consulting (3.3, 7.1, 7.3): "the depth of a consulting engagement" and "the analysis a good consultant would do" replaced with "the same core deliverable" and "the scope a consulting review covers" (DECISIONS: compare scope, not outcomes).
- Added Consulting 7.6 `comparison` (old 7.6 to 7.10 renumbered 7.7 to 7.11; references updated), plus consulting teasers on Home 2.9 and Services 3.3. Headline figures use conservative values: $15,600 for an independent or regional review (cons-11, cons-33, cons-34) and 8 weeks to recommendations (cons-26). 180 hours is the base hours figure.
- Checked and unchanged: HBR 2011 "nearly seven times" (cx-18), delivery timings (Appendix A, 6), scenario-embed slots (numbers live in SCENARIOS.md).
- Flag for the BENCHMARKS owner: the strategy-firm optimistic row says Team B × 8 weeks = $1,632,000, but the optimistic weekly fee listed is $265,200 (× 8 = $2,121,600). Not used in this copy.
