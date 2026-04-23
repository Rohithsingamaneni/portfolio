# Portfolio Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the portfolio into a dual-theme, premium one-page experience with a signal-grid identity, selective glass surfaces, and polished futuristic motion.

**Architecture:** Replace the current section-by-section styling with a shared theme token system, reusable section shell patterns, centralized portfolio content data, and modular components for navigation, theme control, and contact links. Add a small test harness for core interactive behavior, then implement the redesign component by component.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Vitest, React Testing Library, jsdom

---

### Task 1: Set Up Test Infrastructure

**Files:**
- Modify: `rohith-portfolio/package.json`
- Create: `rohith-portfolio/vitest.config.ts`
- Create: `rohith-portfolio/vitest.setup.ts`
- Create: `rohith-portfolio/tsconfig.vitest.json`

**Step 1: Add the failing test dependencies and scripts**

Add `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event`, plus `test` and `test:watch` scripts.

**Step 2: Run the test command to verify the setup fails before config exists**

Run: `npm test`
Expected: FAIL because Vitest is not configured yet

**Step 3: Add the minimal Vitest config**

Create a jsdom test environment and a setup file that loads `@testing-library/jest-dom`.

**Step 4: Run the test command again**

Run: `npm test`
Expected: PASS with zero tests or fail only because the first real test file is missing

### Task 2: Write Behavioral Tests for the New Interactive Surface

**Files:**
- Create: `rohith-portfolio/components/__tests__/theme-and-contact.test.tsx`
- Create: `rohith-portfolio/components/__tests__/navigation.test.tsx`

**Step 1: Write a failing test for theme switching**

Cover:
- Theme toggle renders
- User can toggle between light and dark
- Preference is stored locally

**Step 2: Run the targeted test to verify it fails**

Run: `npm test -- theme-and-contact`
Expected: FAIL because the theme provider and toggle do not exist yet

**Step 3: Write a failing test for navigation and contact links**

Cover:
- Primary navigation items render
- Contact section renders LinkedIn and GitHub links
- No form submit button is required for the links-only contact design

**Step 4: Run the targeted test to verify it fails**

Run: `npm test -- navigation`
Expected: FAIL because the new page structure does not exist yet

### Task 3: Centralize Portfolio Content and Theme Tokens

**Files:**
- Create: `rohith-portfolio/lib/portfolio-data.ts`
- Modify: `rohith-portfolio/app/globals.css`
- Modify: `rohith-portfolio/app/layout.tsx`

**Step 1: Create a single source of truth for portfolio content**

Move navigation labels, social links, capabilities, experience timeline entries, featured project data, and hero copy into a shared data module.

**Step 2: Add the new global token system**

Define dark and light theme variables for:
- background layers
- foreground colors
- panel borders
- glass backgrounds
- glow colors
- shadows
- mono labels

**Step 3: Add font and base-app updates**

Move from the current default stack to a more intentional display/sans/mono pairing suitable for the redesign.

**Step 4: Re-run the existing failing tests**

Run: `npm test -- theme-and-contact navigation`
Expected: Still FAIL because the new components are not implemented yet

### Task 4: Build Theme Infrastructure and Sticky Navigation

**Files:**
- Create: `rohith-portfolio/components/ThemeProvider.tsx`
- Create: `rohith-portfolio/components/ThemeToggle.tsx`
- Create: `rohith-portfolio/components/TopNav.tsx`
- Modify: `rohith-portfolio/app/page.tsx`

**Step 1: Implement the minimal theme provider to satisfy the tests**

Support:
- initial theme resolution
- localStorage persistence
- root dataset/class sync
- reduced-motion-safe transitions

**Step 2: Build the sticky nav**

Add:
- brand mark
- anchor links
- theme toggle
- glass treatment
- mobile-safe wrapping/layout

**Step 3: Run the theme and navigation tests**

Run: `npm test -- theme-and-contact navigation`
Expected: PASS for the newly covered interactions

### Task 5: Rebuild the Hero and Atmospheric Background

**Files:**
- Create: `rohith-portfolio/components/SectionEyebrow.tsx`
- Modify: `rohith-portfolio/components/Hero.tsx`
- Modify: `rohith-portfolio/components/ParticleBackground.tsx`
- Modify: `rohith-portfolio/components/Marquee.tsx`
- Modify: `rohith-portfolio/app/page.tsx`

**Step 1: Rebuild the hero around the new design system**

Add:
- editorial name lockup
- status pill
- stronger CTA cluster
- deployment zone block
- controlled layout for mobile

**Step 2: Upgrade the background system**

Add:
- theme-aware network mesh
- radial atmosphere
- subtle surreal motion
- reduced-motion fallback

**Step 3: Refresh the marquee**

Bring the marquee in line with the new type scale, spacing, and theme tokens.

**Step 4: Run lint and tests**

Run: `npm test`
Expected: PASS

### Task 6: Rebuild Capabilities, Experience, and Featured Project

**Files:**
- Modify: `rohith-portfolio/components/Capabilities.tsx`
- Modify: `rohith-portfolio/components/Experience.tsx`
- Modify: `rohith-portfolio/components/Projects.tsx`

**Step 1: Rebuild the capabilities section**

Use:
- glass-accent icon tiles
- consistent card rhythm
- theme-aware copy hierarchy

**Step 2: Rebuild the experience timeline**

Fix:
- current empty vertical feeling
- inconsistent reveal behavior
- weak active-state emphasis

Use a stronger line, node, and card layout with more stable spacing on mobile and desktop.

**Step 3: Rebuild the featured project**

Add:
- premium content layout
- technical system diagram
- gradient/glow treatments
- better tag styling

**Step 4: Run lint and tests**

Run: `npm test`
Expected: PASS

### Task 7: Rebuild About, Contact, and Footer

**Files:**
- Create: `rohith-portfolio/components/Contact.tsx`
- Modify: `rohith-portfolio/components/About.tsx`
- Modify: `rohith-portfolio/components/Footer.tsx`
- Modify: `rohith-portfolio/app/page.tsx`

**Step 1: Rebuild the about section**

Keep the current message but improve presentation, contrast, and line length.

**Step 2: Add the links-based contact section**

Include:
- strong CTA headline
- supporting copy
- premium LinkedIn and GitHub cards
- optional email-ready layout structure without exposing an unfinished form

**Step 3: Tighten the footer**

Align branding, social links, and theme with the rebuilt page.

**Step 4: Run lint and tests**

Run: `npm test`
Expected: PASS

### Task 8: Verify the Full Experience

**Files:**
- Verify: `rohith-portfolio/app/page.tsx`
- Verify: `rohith-portfolio/components/*.tsx`
- Verify: `rohith-portfolio/app/globals.css`

**Step 1: Install dependencies**

Run: `npm install`

**Step 2: Run the test suite**

Run: `npm test`
Expected: PASS

**Step 3: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 4: Run build**

Run: `npm run build`
Expected: PASS

**Step 5: Run the app locally and capture desktop and mobile screenshots**

Run:
- `npm run dev`
- capture `/portfolio` on desktop
- capture `/portfolio` on mobile

Expected: successful local preview with both themes working

**Step 6: Commit**

```bash
git add docs/plans rohith-portfolio
git commit -m "feat: redesign portfolio experience"
```
