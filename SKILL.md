---
name: nihongo-landing-page
description: Create consistent responsive marketing pages for NihonGO using the official Momo logo, brand tokens, reusable sections, accessible motion, and a clear conversion goal.
---

# NihonGO Landing Page Skill

## Workflow
1. Inspect the repo, framework, routing, package scripts, and current design patterns.
2. Read `AGENTS.md` and `DESIGN.md`.
3. Confirm target audience, primary CTA, real demo URL, and which features are actually available.
4. Use the official Momo logo asset; never replace it with a generic mascot.
5. Build semantic, reusable sections. Reuse existing UI components and dependencies first.
6. Use the centralized design tokens; do not invent one-off colors or spacing without reason.
7. Implement responsive behavior for mobile, tablet, and desktop.
8. Add subtle motion only where it supports hierarchy; respect `prefers-reduced-motion` and disable pointer parallax on touch devices.
9. Check every link and button. No placeholder URLs in production.
10. Run available lint, test, and build commands; report only checks actually run.

## Default landing-page architecture
- Header / navigation / primary CTA
- Hero with value proposition and product/mascot visual
- Product proof only if verified
- Learner problem and product solution
- Main features (Listening, Speaking, Reading, Writing)
- How it works
- FAQ
- Final CTA
- Footer

## Copy rules
- Default language: Vietnamese.
- Explain the value before listing technology.
- No fabricated stats, ratings, reviews, or outcomes.
- Mention AI only for capabilities implemented or clearly marked as planned.
- Make the primary CTA explicit and point it to a real destination.

## Accessibility and motion
- Semantic headings and landmarks.
- Keyboard-operable mobile menu with accessible state.
- Visible focus styles and useful alt text.
- Respect reduced-motion preferences.
- Avoid motion on touch-first devices where it adds no value.

## Definition of done
- [ ] Logo is the official Momo/NihonGO asset.
- [ ] Main value proposition and CTA are clear.
- [ ] All product claims are accurate.
- [ ] Layout works on mobile and desktop without horizontal overflow.
- [ ] Menu, FAQ, and CTAs work.
- [ ] Reduced motion is respected.
- [ ] Metadata is present.
- [ ] Real demo URL is configured.
- [ ] Tests/build are run and honestly reported.

## Optional conversion sections
When requested, add a listening demo, interactive quiz, testimonials, pricing, expanded FAQ, and complete footer without rewriting the existing core brand narrative. Use source-provided copy faithfully. Mark commercial or social-proof claims as needing verification before production.
