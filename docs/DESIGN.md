# Gaussia Landing — Design System

Calm, editorial, Anthropic-flavored. Think "utopic society at peace," not "futuristic dashboard." Warm naturals, hairline dividers, a single breathing bell-curve animation, and Instrument Serif italic headlines. This system deliberately pivoted *away* from a Space Grotesk/Manrope/dashboard first version — do not revert it.

---

## Color tokens

All tokens are defined in `app/globals.css` (`@theme inline`). Never use literal hex in components. Never use `text-white` or `bg-black` — go through tokens.

| Tailwind class | Hex | Use |
| --- | --- | --- |
| `bg-surface` / `text-surface` | `#f1ede4` | Default page background (cream). Also used as text on dark sections. |
| `bg-surface-lowest` | `#faf7f0` | Near-white card surface (module cards). |
| `bg-surface-sand` | `#e7ddcb` | Kraft/sand — section alternate 1 (manifesto, footer). |
| `bg-surface-clay` | `#d9c7ac` | Warm beige — section alternate 2 (contract). |
| `bg-surface-mist` | `#ece6db` | Between cream and sand — modules section bg. |
| `bg-surface-strip-1` | `#faf2ec` | Why Gaussia card 1 |
| `bg-surface-strip-2` | `#f4ece6` | Why Gaussia card 2 |
| `bg-surface-strip-3` | `#efe7e0` | Why Gaussia card 3 |
| `bg-surface-strip-4` | `#e9e1db` | Why Gaussia card 4 |
| `bg-ink` / `text-ink` | `#221f1a` | Near-black warm. Primary text AND the Contribute section background. |
| `text-ink-soft` | `#3a342d` | Body text. |
| `text-ink-muted` | `#6b6158` | Secondary / label text, nav links (inactive). |
| `bg-terracotta` / `text-terracotta` | `#ab412d` | Primary accent. CTAs, peak glow, eyebrow dots. |
| `text-terracotta-soft` | `#c86a52` | Italic emphasis in dark (ink) sections. |
| `bg-terracotta-pale` | `#efd6cc` | Highlighted flow node bg (How it works, F node). |
| `border-hair` | `rgba(34,31,26,0.08)` | Hairline divider. |
| `border-hair-strong` | `rgba(34,31,26,0.14)` | Slightly stronger hairline. |

No purple, violet, or cool hues. Ever.

---

## Section background rhythm

The page alternates backgrounds in a deliberate warm rhythm. Do not change the order without a reason.

| Section | Component | Background |
| --- | --- | --- |
| Nav | `site-nav.tsx` | Transparent → `bg-surface/85 backdrop-blur-md` on scroll |
| Hero | `hero.tsx` | `bg-surface` (canvas lives behind as ambient texture) |
| Manifesto | `manifesto.tsx` | `bg-surface-sand` |
| Why Gaussia | `why-gaussia.tsx` | `bg-surface` (individual cards use `bg-surface-strip-1..4`) |
| Contract | `contract.tsx` | `bg-surface-clay` |
| How it works | `how-it-works.tsx` | `bg-surface` |
| Modules | `modules.tsx` | `bg-surface-mist` (cards use `bg-surface-lowest`) |
| Get started | `get-started.tsx` | `bg-surface` |
| Contribute | `contribute.tsx` | `bg-ink` ← the only dark moment |
| Footer | `site-footer.tsx` | `bg-surface-sand` |

---

## Typography

### Fonts (declared in `app/layout.tsx` via `next/font/google`)

| Variable | Family | Use |
| --- | --- | --- |
| `font-serif` | Instrument Serif (weight 400, normal + italic) | All section headlines and the manifesto pull-quote |
| `font-sans` | Inter | Body copy, eyebrows, UI labels, the "Gaussia" wordmark |
| `font-mono` | JetBrains Mono | Code blocks and inline metric names only |

### Type scale

| Role | Classes |
| --- | --- |
| Hero display | `font-serif text-[clamp(3rem,7.2vw,5.75rem)] tracking-tightest leading-[1.02] text-ink` |
| Section headline | `font-serif text-[clamp(2.2rem,5vw,3.75rem)] tracking-tightest leading-[1.05] text-ink` |
| Manifesto pull-quote | `font-serif text-2xl sm:text-3xl leading-snug text-ink` |
| Body paragraph | `font-sans text-base leading-relaxed text-ink-soft` |
| Eyebrow | `font-sans text-xs text-ink-muted` + `·` separator + `pulse-soft` terracotta dot |
| Section number label | `font-sans text-xs text-ink-muted` (e.g. "01") |
| Code | `font-mono text-sm leading-relaxed` inside dark `bg-ink` block |

### The signature move

Every section headline has **one italic word** — the emotional pivot of the line — marked with `<em>` or `<span className="italic text-terracotta">`. Examples: "*science*", "*evidence-backed*", "*we close*", "*Community-first.*", "*Many implementations.*", "*One scientific contract.*", "*Run anywhere.*", "*shaping the library.*"

- One per headline, maximum.
- In dark (ink) sections: use `text-terracotta-soft` for the italic span, not `text-terracotta`.
- The "Gaussia" wordmark in nav and footer is `font-sans font-medium` — **never serif**. Do not revert.

---

## Spacing and shapes

- **Spacing:** Tailwind scale only (`p-6`, `gap-8`, etc.). No arbitrary `[16px]` values.
- **Radii:** `rounded-2xl` (1rem) and `rounded-3xl` for cards; `rounded-full` for buttons. No sharp corners.
- **Layout:** flexbox-first; grid only when 2D layout is genuinely needed.
- **Dividers:** hairlines (`border border-hair`) instead of heavy outlines.

---

## Buttons

| Role | Classes |
| --- | --- |
| Primary (light sections) | `bg-terracotta text-surface hover:bg-ink transition-colors rounded-full` |
| Secondary / ghost (light) | `border border-hair-strong bg-surface/70 text-ink rounded-full` |
| Primary (dark / ink section) | `bg-surface text-ink hover:bg-terracotta hover:text-surface transition-colors rounded-full` |
| Secondary (dark / ink section) | `border border-surface/20 text-surface rounded-full` |

Terracotta-first, ink-on-hover is the convention for light sections. Do not flip it back.

---

## Animation system

### Scroll reveals (`components/reveal.tsx`)

IntersectionObserver wrapper. Apply to sections and cards.

| Variant | Transform | Typical use |
| --- | --- | --- |
| `up` (default) | `translateY(14px)` + fade | Most sections, principle cards |
| `left` | `translateX(-22px)` + fade | Contract timeline items |
| `right` | `translateX(22px)` + fade | Alternating card columns |
| `scale` | `scale(0.96)` + fade | Module cards, how-it-works strip |
| `blur` | `blur(8px)` + `translateY(8px)` + fade | Manifesto pull-quote |
| `rise` | `translateY(28px)` + fade | Contribute cards (dark section) |

Duration: 1100ms, `cubic-bezier(0.22, 0.61, 0.36, 1)`. All snap to identity on `prefers-reduced-motion`.

### CSS helpers (defined in `app/globals.css`)

| Class | Behavior | Use |
| --- | --- | --- |
| `.lift` | Hover: `translateY(-3px)` + shadow, 600ms | Featured cards (Why Gaussia, Modules). Not every card. |
| `.pulse-soft` | 3.2s breathing: opacity 0.55→1 + scale 1→1.25 | Terracotta eyebrow dot |
| `.marquee` | 50s linear infinite `translateX(0 → -50%)` | Metric name strip in Modules section |
| `.float-soft` | 6s ease-in-out ±4px vertical | (available; not currently active) |

### Hero canvas (`components/gauss-canvas.tsx`)

The only signature animation on the page. Key behavior:

- Single Gaussian bell across the full hero width, brown→terracotta→brown gradient, soft fill wash.
- Terracotta "sun" glow at the peak.
- Particles rain from above, settle into the bell PDF shape (jittered y), then wander in 2D via two independent slow sine waves per particle.
- Re-rains on a 9–11s cycle so it never looks static.
- DPR-aware, resize-aware, pauses off-screen (IntersectionObserver), static frame on `prefers-reduced-motion`.

**Invariants — never break these:**

1. Single curve only (not multiple overlapping bells).
2. Subdued alpha — line never above ~0.5.
3. 2D wander frequencies: ~0.0004–0.001. Amplitudes: ~10–30px x, ~6–20px y. These were tuned **up** intentionally.
4. Alpha is set inside the canvas constants — never add a wrapper `opacity` class.
5. Reduced-motion fallback must remain.

---

## Icons

`lucide-react` only, sized 16 / 18 / 20px. Never emojis.

---

## Anti-patterns

These are all things the page has been through and deliberately moved away from. Do not reintroduce:

- `text-white` / `bg-black` — always use `text-surface` / `bg-ink`
- Literal hex or rgb values in any component file
- Purple, violet, or any cool hue
- Space Grotesk, Manrope, or any font not in the declared stack
- Uppercase eyebrow text with tracking (old dashboard aesthetic)
- Multiple overlapping Gaussian curves in the hero
- `framer-motion`, `three.js`, `p5.js` — animations are hand-written
- Reducing canvas particle frequencies (they were tuned up from a too-static earlier version)
- Wrapping the canvas in an `opacity-*` class (soften inside the constants)
- Paraphrasing copy — use exact strings from `docs/COPY.md`
