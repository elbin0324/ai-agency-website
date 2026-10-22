# Handoff: Halyard website

Updated 2026-10-22, when Jay moved to a new laptop. Read this together with `CLAUDE.md`, which covers setup, commands and rules.

## Where things stand

- **Live:** https://halyard.solutions. HTTPS is enforced, and www and http redirect to it.
- **Code:**
  - All work is committed and pushed to `main`. Nothing is uncommitted, half-built or running in the background.
  - The deployed build is `da99346`. The two commits after it only touched docs (`CLAUDE.md`, `README.md`, this file).
- **Last checks (2026-10-21):**
  - All 11 pages show 0 problems in Chrome, WebKit (as an iPhone 15) and Firefox, and on the live domain after deploying. Problems means console errors, failed requests, sideways scrolling and accessibility issues.
  - The link check passed: 1,238 links.
  - Lighthouse:
    - accessibility, best practices and SEO: 100
    - performance on desktop: 97
    - performance on mobile: 79

## What has been built

1. **Round one** (published 2026-10-14):
   - 11 pages in the Navy & Brass design.
   - Six scripted agent demos on a shared demo engine: Customer, Analyst, Executive Assistant, Marketing, Sales and Consulting.
   - A savings calculator.
   - Worked examples and a sourced methodology.
   - A consulting comparison against traditional firm types, on price, scope and time.
   - Apple-style scroll animation.
2. **Round two** (deployed 2026-10-15):
   - A real 5-step assessment intake with a live estimate.
   - A five-lever calculator: team time, inquiries, ads, sales and consulting.
   - Bigger examples.
   - An easier demo picker and a faster Sales demo.
   - A scroll-scrubbed "A day with your AI workforce".
   - Fixes from a three-critic review.
3. **Domain** (2026-10-21):
   - halyard.solutions on GitHub Pages, with DNS at GoDaddy.
   - halyar.co was bought by mistake: its auto-renew is off, so it lapses on Oct 22, 2027.
4. **Landing page v3** (deployed 2026-10-21):
   - **Hero:** the dark "Night shift" hero ("Wake up to finished work."). It was picked by two judge agents over two other concepts.
   - **Hero cards:** three result cards whose figures come from the demo data.
   - **Phone:** a phone approval that flips only when you press Approve.
   - **Trust lines and agent row:** trust lines in the first screen, and a six-agent row that opens each demo.
   - **Brand line:** "hal·yard (n.) The line that raises the sail."
   - **Control room:** the interactive dashboard moved out of the hero into its own section after the demos.
   - **Wording:** the landing page says "for business" instead of "for small and mid-size businesses".

## Waiting on Jay

**Decisions:**
1. **Auto-renew on halyard.solutions:** currently on. The recommendation is to keep it on.
2. **halyar.co DNS:** its records still point at GitHub but aren't connected to anything. The recommendation is to reset them to GoDaddy parking so nobody else can attach a GitHub site to the domain.
3. **`/services/` page title:** it still says "AI services for small and mid-size businesses". Change it to "business" like the landing page?

**Needed before the site can turn visitors into calls.** All of these are set in `src/config/site.ts`, and the site adapts when they're filled in:
- **Contact:** a business email (`email`) or a form endpoint (`formEndpoint`, for example Formspree). Today the form shows a "not connected yet" note.
- **Founder details:** name, photo and city (`founderName`, plus a founder block that still needs building).
- **Booking:** a link (`bookingUrl`).
- **Price signal:** for consulting (`consultingPrice`), or a starting price.
- **Claims to confirm:** fixed-price pilot, flat monthly fee, response times, process durations and the security wording (no SOC 2).

## Suggested next steps

1. **Wire up contact:** as soon as Jay gives an email or form endpoint, set it, test the contact form and assessment intake end to end, and deploy. This is the biggest remaining gap.
2. **Add the founder block and booking link.** The critics agreed these matter most for trust.
3. **Mobile speed (optional):** 79 on mobile, down from 83. The new hero added about 37% more page elements, and the heading text animation takes about 140 ms. Possible fixes:
   - render the hero card detail drawers only on hover or focus
   - simplify the rope SVG
   - make the heading animation CSS-only

   Don't inline all the CSS: it was tried and didn't help.
4. **Tidy (optional):** `AGENTS.md` is still the default Astro boilerplate.

## Lessons from this build

- **Workflows and subagents need the user's request quoted word for word.** One build agent refused the landing redesign because it saw only Jay's latest message, which was about GoDaddy.
- **The HTTPS certificate didn't issue on its own** for the brand-new domain, because GitHub's first DNS check hit a cached "doesn't exist" answer. Re-saving the custom domain fixed it in seconds (see `CLAUDE.md`, Hosting).
- **Don't over-research numbers.** Jay said a benchmark pass should take about 10 minutes, and that writing DESIGN.md should not take two hours. He cares about design and content first.
- **Status updates:** short text, no screenshots.
- **Shared Chrome:** other Claude sessions use the same Chrome. Stay in your own tabs, and never click "Cancel domain" or delete links at GoDaddy.

## Resuming on the new laptop

1. Follow "Setting up a new machine" in `CLAUDE.md` (clone, `npm install`, `gh auth login`).
2. Start Claude Code in the repo folder and say, for example: "Read HANDOFF.md, then help me wire up the contact form."
3. Update this file when a session ends with work in progress.
