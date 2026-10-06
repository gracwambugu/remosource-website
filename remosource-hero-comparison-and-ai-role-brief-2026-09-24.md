# RemoSource hero comparison and AI role brief

## What will change

### 1. Three switchable homepage visuals
- Keep the existing hero copy, calls to action, palette, grid texture, and two-column composition unchanged.
- Add a compact, keyboard-accessible selector for three visual treatments:
  1. **Phone** — the existing upright phone and matching-flow carousel.
  2. **Dashboard** — a grounded browser window aligned to the text, reusing the current Matches, Vetting, and Introductions content in a wider layout.
  3. **Talent profiles** — a restrained stack of privacy-conscious candidate cards using the same roles, locations, match scores, skills, and verified status.
- Make **Dashboard** the initial treatment so the requested replacement is visible first, while still allowing direct comparison with Phone and Profiles.
- Preserve a stable visual area at every breakpoint to prevent page movement when switching. On mobile, use a compact segmented selector and scale each treatment without horizontal overflow.
- Track treatment changes through the existing analytics-ready event layer.

### 2. AI hiring brief builder
- Add a focused “Draft with AI” step to the existing `/hire` journey, before the full contact/company form.
- Collect only role requirements needed for generation: role/title, core responsibilities, must-have skills, seniority, working hours/time-zone overlap, engagement model, and any constraints.
- Validate input in the browser and again on the server.
- Use a TanStack server function and Lovable AI Gateway with `openai/gpt-6-astra`; keep credentials, prompt, and model call server-side.
- Generate and validate a structured result containing:
  - role title and concise role summary
  - key outcomes/responsibilities
  - required and preferred capabilities
  - recommended screening questions
  - practical assessment criteria and scoring signals
  - interview focus areas and risk flags
- Present the result as an editable, copyable brief. Users can apply generated fields to the existing hiring form, then review and submit through the current flow.
- Do not persist generated briefs yet; the feature remains privacy-conscious and stateless. Existing form submission behavior stays unchanged.

### 3. Reliability and verification
- Show the AI Gateway’s safe error message in the page, preserve user input, and only retry transient rate/server failures with bounded delay.
- Add loading, empty, success, and failure states; prevent duplicate submissions.
- Add analytics-ready events for brief generation started/completed/failed and generated brief applied.
- Verify keyboard navigation, labels, focus visibility, responsive layouts at 1440, 1280, 1024, and mobile widths, no overflow/layout shift, and no browser errors.
- Make one real AI request through the finished feature and inspect its structured response before calling it complete.
- Recheck homepage and `/hire` metadata after implementation.

## Technical details
- Extract the hero visuals into focused reusable components and reuse the current mockup’s data rather than duplicating visible content.
- Use the existing design tokens and Button/Tabs components; no new colors or visual language.
- Add AI SDK packages required for Responses API structured streaming and a server-only gateway helper with run-ID propagation.
- Use a strict-compatible Zod output schema with required fields only, with requested list limits expressed in the prompt and normalized after generation.
- Lovable Cloud is enabled for secure server-side execution. Database, storage, authentication, emails, and payments are available later, but this feature will not create tables or require user accounts.
