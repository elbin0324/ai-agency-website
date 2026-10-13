# Project brief: AI integration & consulting firm website

This is the master brief. Every page, section, demo and line of copy follows it.

## The business

A done-for-you AI integration, agent and consulting firm for small local businesses up to mid-size companies. We design, build, integrate and operate AI agents inside a client's business, connected to the tools they already use (email, spreadsheets, accounting, CRM, ad accounts, website, phone/SMS), and we advise them on where AI cuts cost and lifts margin. Clients get outcomes, not another software login to figure out.

**Working brand name: Halyard.** It is a placeholder: the founder has not chosen the final name, so in the build the name must come from one config value and be swappable in one place. Brand idea: a halyard is the line that raises the sail. We are the line that raises what a business can do.

## Who it's for

- **Small local businesses (5-50 staff):** home services (HVAC, plumbing, roofing, electrical), dental/medical/vet practices, law and accounting firms, real estate teams, restaurants and hospitality groups, independent retail and e-commerce brands, fitness studios, agencies.
- **Mid-size companies (50-500 staff):** distributors and light manufacturers, multi-location service businesses, professional-services firms, regional retailers.
- **Buyers:** owners/founders, CEOs/COOs, GMs, office and operations managers, marketing and sales leads. Busy, practical, ROI-driven, skeptical of AI hype, often non-technical, worried about data security, cost, disruption and "will this actually work in my business?"

## Services (four lines)

1. **AI Agents**: an AI workforce for your team and your customers. Three core agent roles:
   - **Customer Agent** talks to customers 24/7 across website chat, SMS, email and phone/voice. It answers questions from the business's own knowledge, quotes from the price book, books appointments, takes orders, qualifies leads, follows up, and hands off to a human with full context.
   - **Analyst Agent** works the numbers. It reads the books (QuickBooks/Xero exports), messy Excel/CSV files and reports; cleans data; builds and maintains the spreadsheets ("does all the Excel"): formulas, pivot tables, forecasts, graphs and dashboards; and explains what changed and why in plain English.
   - **Executive Assistant Agent** goes through the inbox, triages and drafts replies, pulls out action items and assigns tasks to the right employee, tracks follow-ups, schedules meetings, prepares briefings, and builds PowerPoint decks, charts and documents on request.
2. **AI Marketing Director** analyzes every ad the business is running (Google, Meta, etc.) alongside website and CRM results. It finds waste, designs and runs its own experiments (creative, audience, offer, landing page, budget split), reallocates spend to what works within guardrails the client sets, and reports in plain language. Goal: lower cost per lead/acquisition, higher return on ad spend.
3. **AI Sales Agent** finds potential customers that fit the client's ideal-customer profile and researches each one's real context (company news, website, role, recent activity, likely pain points). It drafts a genuinely personalized email for each prospect and sends it, with approval rules, sending limits, follow-ups and CRM logging. **The emphasis is quality:** unlike generic AI spam, every email reads like a thoughtful person wrote it after doing their homework. Deliverability and compliance (CAN-SPAM, opt-out) are built in.
4. **AI Consulting**: an AI-powered consultant for the business. It analyzes operations and financials to find cost savings, process waste, and pricing and margin opportunities, then delivers a prioritized roadmap (what to automate first, expected savings, payback) at a fraction of the cost of a traditional consulting engagement. Also covers AI strategy and readiness.

The through-line: more output per employee, lower operating cost, higher margin, measured in hours and dollars.

## Site map (multi-page)

| Route | Purpose |
|---|---|
| `/` | Home, the whole story: hero, integrations, outcomes, services, live demos, savings calculator, illustrative examples, process, differentiators, security and trust, industries, FAQ, final CTA |
| `/services/` | Services overview |
| `/services/ai-agents/` | AI Agents: Customer, Analyst and Executive Assistant agents (3 demos) |
| `/services/marketing/` | AI Marketing Director (demo) |
| `/services/sales/` | AI Sales Agent (demo; quality emphasis; generic-vs-ours comparison) |
| `/services/consulting/` | AI Consulting (demo) |
| `/demos/` | "See it work": all six demos in one place |
| `/results/` | Savings and examples: full ROI calculator plus illustrative scenarios with the math shown |
| `/approach/` | How we work: process, engagement models, security and data, human-in-the-loop, FAQ |
| `/contact/` | Book a free AI assessment: form plus what happens next |
| `404` | Not found |

## The six demos ("AI in use")

Video-like, auto-playing animated product simulations built in HTML/CSS/JS (no video files). Each runs a scripted scenario inside a realistic app window with captions, progress and play/replay controls, and ends with a result card showing time and money saved.

1. **Customer Agent:** website chat to booked job, with handoff rules.
2. **Analyst Agent:** messy spreadsheet or books export to cleaned data, formulas, a chart and a plain-English insight report.
3. **Executive Assistant:** overflowing inbox to triaged mail, drafted replies, tasks assigned to employees, a booked meeting and a generated PowerPoint deck.
4. **Marketing Director:** ad accounts audited, waste found, experiments launched, budget reallocated, CPA/ROAS improving over time.
5. **Sales Agent:** ideal customer profile to a researched prospect (dossier), a personalized email, a quality check and a send, contrasted with a generic AI email.
6. **Consulting:** P&L and operations analyzed, savings opportunities ranked, margin impact (waterfall), roadmap.

## Honesty rules (non-negotiable)

- The firm is new. **No** fake testimonials, client names, client logos, review stars, "trusted by N businesses", awards, certifications (e.g. SOC 2, HIPAA-certified) or press mentions.
- Every outcome number is an **illustrative example or modeled estimate** and is labeled as such where it appears ("Illustrative example", "Modeled estimate"), with a short methodology/assumptions note nearby or linked. The math must be correct and conservative.
- Industry statistics only with a real, citable source; otherwise leave them out.
- Third-party tools (Gmail, Outlook, Excel, QuickBooks, Shopify, HubSpot, Meta Ads, Google Ads, etc.) may be named as integrations in plain text. Do not use their logos.
- Fictional businesses in demos and scenarios use clearly generic invented names, never real companies.
- Security language describes practices (least-privilege access, human approval for sensitive actions, audit logs, business-grade AI providers whose terms exclude training on your data), not certifications or guarantees. The founder will review all claims.
- No prices. Engagements are scoped; the free assessment is the primary call to action.

## Numbers policy (founder requirement)

Every number a visitor sees (dollars saved, hours returned, response times, reply rates, cost per lead, margins, productivity gains) must be **realistic and grounded in researched, real-world benchmarks**, not invented to sound impressive.

- The evidence base is `content/BENCHMARKS.md`: verified figures from government statistics (e.g. BLS wages and benefit costs), peer-reviewed or working-paper studies of AI productivity, and large-sample industry benchmark reports, each with its source and URL.
- Model inputs (loaded hourly costs, share of a task AI can take on, ad cost per lead, cold-email reply rates, industry margins, etc.) use the **conservative-to-base** values recommended there. When in doubt, pick the smaller number.
- Savings come from specific, task-level workflows (e.g. "drafting replies to routine emails"), never from whole-job replacement or blanket "10x productivity" claims.
- A calibration pass aligns all content numbers with `content/BENCHMARKS.md` before the site is built. The results page's methodology section lists the sources.

## Brand feel

Very professional, high-level, premium and promising: a firm a business owner would trust with their operations. Modern, confident and precise; never gimmicky, never generic "AI purple hype", never cluttered. Copy is plain-spoken, specific and outcome-first, without jargon.

## Tech constraints

- Astro 7 + Tailwind CSS 4 (CSS-first config with `@theme` tokens), static output, hosted on GitHub Pages at `https://elbin0324.github.io/ai-agency-website/`. The base path is `/ai-agency-website/`, so every internal link and asset must be base-aware.
- Minimal JS: vanilla, small `<script>` islands, no heavy frameworks. Self-hosted fonts. No stock photos: visuals are product UI mockups, diagrams, data viz and abstract art in SVG/CSS.
- Accessible (WCAG AA contrast, keyboard operable, visible focus, semantic landmarks, `prefers-reduced-motion` honored) and fast.
- Visual QA: `node scripts/shot.mjs <url|file> [--mobile] [--selector css] [--click css] [--reduced-motion] [--out dir] [--name prefix]` captures screenshots with the local Chrome; open them with the Read tool and actually look.
