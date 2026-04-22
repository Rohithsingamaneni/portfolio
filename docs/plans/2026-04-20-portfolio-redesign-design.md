# Portfolio Redesign Design

## Goal

Rebuild the portfolio into a premium one-page experience that combines the cinematic structure of a signal-grid interface with selective glass-system surfaces. The site should feel futuristic and surreal, but still credible for a senior engineer profile.

## Approved Direction

The visual system is a hybrid:

- `Signal Grid` for the overall identity, layout rhythm, background atmosphere, typography hierarchy, and section structure.
- `Glass Systems` for selected UI surfaces such as the sticky navigation, featured project card, contact cards, and elevated call-to-action areas.

This keeps the portfolio technical and memorable without drifting into a generic SaaS aesthetic.

## Product Shape

The rebuilt page will include:

- Sticky top navigation with section anchors
- Theme toggle with dark and light modes
- Hero section with oversized editorial name treatment
- Tech marquee
- Capabilities section
- Experience timeline
- Featured project section
- About section
- Links-based contact section
- Footer

The contact section will focus on LinkedIn and GitHub rather than a live backend-powered form.

## Visual Language

### Dark Mode

- Near-black background
- Warm copper highlight system
- Smoked-glass panels with subtle blur
- White display typography with cool gray body copy
- Ambient network mesh and radial glow fields

### Light Mode

- Warm ivory background
- Cool blue highlight system
- Frosted white panels with soft, lifted shadows
- Charcoal display typography with muted slate body copy
- Faint network mesh and diffused blue atmosphere

### Shared Identity

- Editorial, oversized surname lockup in the hero
- Mono navigation and section labels
- Rounded panels with thin borders
- Premium, restrained animation language

## Motion System

The motion system will feel futuristic and surreal, but remain controlled and readable.

Primary motion patterns:

- Subtle background drift and glow breathing
- Scroll-based section reveals and divider activation
- Card hover lift and light sweep
- Theme transition polish
- Featured project diagram pulse/orbit accents
- Timeline emphasis as cards enter view

Animation implementation should favor `transform` and `opacity` for performance, use blur and blend effects sparingly, and support `prefers-reduced-motion`.

## Technical Notes

- The redesign remains a single-page Next.js app under `rohith-portfolio/`.
- The page should support both `/portfolio` base-path previews and local development.
- New shared data/constants should centralize navigation, social links, capabilities, experience entries, and featured project content.
- The theme system should persist user preference locally and avoid layout flash on first render.

## Animation References

The redesign direction is informed by current official guidance and CSS capabilities:

- Scroll-driven animations for section progress and reveal patterns
- `backdrop-filter` for premium glass surfaces
- `conic-gradient()` and `repeating-conic-gradient()` for orbital accents and glow halos
- `mix-blend-mode` for restrained atmospheric overlays
- `mask-image` for edge fades and glow shaping
- `prefers-reduced-motion` for accessibility

## Success Criteria

- The page looks premium and intentional in both dark and light modes
- Mobile layout feels designed, not compressed
- Navigation, section flow, and hierarchy feel cohesive
- The experience section no longer creates awkward empty space
- The contact area feels polished even without a backend form
- Animations support the design instead of distracting from it
