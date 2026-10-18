# DESIGN.md — NihonGO Visual System

## Brand personality
Friendly, optimistic, Japanese-learning companion; polished EdTech product rather than a generic cute blog.

## Core palette
| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFF9F1` | Warm page background |
| `--surface` | `#FFFDF9` | Cards and content |
| `--ink` | `#20283D` | Headings and primary text |
| `--muted` | `#6E7076` | Supporting text |
| `--orange` | `#FF7417` | Primary CTA and emphasis |
| `--orange-dark` | `#E95D0B` | Hover and stronger emphasis |
| `--peach` | `#FFE4C9` | Soft highlight |
| `--blue` | `#DFF1FF` | Listening/speaking accent |
| `--green` | `#E3F6DF` | Reading accent |
| `--pink` | `#FFF0F1` | Listening accent |
| `--border` | `#F1E4D5` | Borders and separators |

## Typography
- Display: Nunito, 800–1000.
- Body/UI: Nunito Sans, 400–900.
- Use responsive `clamp()` for large headings.
- Maintain readable line height and avoid overly long text blocks.

## Layout
- Max content width: 1380px.
- Desktop section spacing: 78px; mobile section spacing: 55px.
- Use consistent 12–24px card gaps and generous whitespace.
- Breakpoint: 1100px and 760px.

## Components
- Header: sticky, translucent, logo on left, clear links, one primary CTA.
- Primary button: orange gradient, white bold text, pill shape.
- Secondary button: warm white fill and peach border.
- Cards: rounded 18–24px, subtle border, restrained shadow.
- Skill colors: Listening pink, Speaking blue, Reading green, Writing peach.
- Hero: value proposition on left, mascot + app preview on right.
- CTA: one clear action; must point to the real demo URL before launch.

## Mascot motion
- Use the official logo asset.
- Keep float/tilt motion gentle and slow.
- Pointer-based 3D tilt only on fine-pointer devices.
- Disable nonessential motion under `prefers-reduced-motion`.
- Do not imply a true 3D model if the asset is a 2D logo.

## Accessibility
- Semantic headings, keyboard-operable nav and FAQ, visible focus.
- Meaningful alt text.
- Respect reduced-motion preferences.
- Keep text readable over image/background and don't rely on color alone.

## Content integrity
- Never fabricate user counts, reviews, ratings, or performance claims.
- Mark planned capabilities as planned.
- Confirm every feature and link before public deployment.

## Extended sections
- Listening demo: dialogue card, furigana toggle, speech synthesis control.
- Quiz: clear answer states, accessible feedback, reset action.
- Pricing: three plan cards; use orange highlight only for the featured plan.
- Testimonials: cards with visible attribution and verification reminder before launch.
- Avoid floral/cherry-blossom decoration; use semantic learning icons.
