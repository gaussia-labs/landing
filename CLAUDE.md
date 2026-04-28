# CLAUDE.md — Gaussia Landing Page

Onboarding doc for an AI agent picking up this project. Read this first before
making changes.

---

## 1. What this project is

A **landing page for Gaussia**, an open-source, paper-first, community-maintained
**scientific AI metrics** project. The page is a single Next.js (App Router)
route that tells the Gaussia story: manifesto → why Gaussia exists → the
contract it makes with users → how it works → modules (Evaluate / Protect /
Improve) → install / get started → how to contribute → footer.

Tone: **calm, editorial, Anthropic-flavored**. Think "utopic society at peace,"
not "futuristic dashboard." We trade chrome and code-y dashboards for
serif headlines, alternating warm naturals, hairline dividers, and a single
ambient bell-curve animation.

The copy is **fixed and provided by the user**. Do not paraphrase it. Layout
and visual treatment are creative, copy is not.

---

## 2. Stack

- **Next.js 16** App Router, React 19.
- **TypeScript**, strict.
- **Tailwind CSS v4** (`@import "tailwindcss"` + `@theme inline` block in
  `app/globals.css`, no `tailwind.config.js`).
- **shadcn/ui** primitives are available but the page is mostly hand-rolled
  with semantic Tailwind classes — keep it that way unless a primitive is
  clearly the right call.
- **lucide-react** for icons.
- **Plain HTML5 Canvas 2D** for the hero animation. No p5, no three.js, no
  framer-motion. Animation primitives are written by hand (see §6).
- **Fonts** via `next/font/google`:
  - `Instrument_Serif` — display / italic headlines (`font-serif`)
  - `Inter` — body / UI (`font-sans`)
  - `JetBrains_Mono` — code blocks only (`font-mono`)

---

## 3. Project structure

```
app/
  layout.tsx          # root layout, fonts, <html> bg, metadata
  globals.css         # design tokens, reveal animations, helpers
  page.tsx            # composes all sections in order

components/
  site-nav.tsx        # sticky top nav, terracotta CTA
  hero.tsx            # serif headline + ambient bell background
  gauss-canvas.tsx    # the bell-curve canvas animation (peaceful, breathing)
  manifesto.tsx       # 2-col: pull-quote + 3 principles
  why-gaussia.tsx     # 4 alternating "ecosystem today vs Gaussia" cards
  contract.tsx        # 5-step vertical timeline (the Gaussia Contract)
  how-it-works.tsx    # 5-node spec → implementations strip
  modules.tsx         # Evaluate / Protect / Improve cards + metric marquee
  get-started.tsx     # tabbed terminal: pip / extras / npm
  contribute.tsx      # 5-step dark-ink contribute guide
  site-footer.tsx     # links + tiny copyright row
  reveal.tsx          # IntersectionObserver scroll-reveal wrapper
  gaussia-logo.tsx    # SVG of the brackets-+-bell mark

docs/
  DESIGN.md           # style guide
  COPY.md             # section-by-section copy reference

CLAUDE.md             # agent onboarding (repo root, not inside docs/)
```

Page composition lives in `app/page.tsx` and follows that exact section order.
Don't reorder without a reason.

---

## 4. Design system

### Colors (defined in `app/globals.css` `@theme inline`)

Strictly **warm naturals + one terracotta accent**. No purple/violet. Always
pair backgrounds with their corresponding text token.

| Token | Tailwind class | Use |
| --- | --- | --- |
| `--surface` | `bg-surface` / `text-surface` | Default page bg (cream `#f1ede4`). Text on dark sections. |
| `--surface-lowest` | `bg-surface-lowest` | Near-white card surface (`#faf7f0`) |
| `--surface-sand` | `bg-surface-sand` | Kraft/sand — manifesto, footer (`#e7ddcb`) |
| `--surface-clay` | `bg-surface-clay` | Warm beige — contract section (`#d9c7ac`) |
| `--surface-mist` | `bg-surface-mist` | Between cream and sand — modules bg (`#ece6db`) |
| `--surface-strip-1..4` | `bg-surface-strip-[n]` | Progressive card backgrounds — Why Gaussia cards |
| `--ink` | `bg-ink` / `text-ink` | Near-black warm `#221f1a`. Primary text + Contribute bg. |
| `--ink-soft` | `text-ink-soft` | Body text `#3a342d` |
| `--ink-muted` | `text-ink-muted` | Secondary/label text `#6b6158` |
| `--terracotta` | `bg-terracotta` / `text-terracotta` | Primary accent `#ab412d` — CTAs, dots, peak glow |
| `--terracotta-soft` | `text-terracotta-soft` | Italic emphasis in dark sections `#c86a52` |
| `--terracotta-pale` | `bg-terracotta-pale` | Highlighted flow node `#efd6cc` |
| `--hair` | `border-hair` | Hairline divider |
| `--hair-strong` | `border-hair-strong` | Slightly stronger hairline |

**Section background rotation** (this is the rhythm of the page):

```
hero            bg-surface
manifesto       bg-surface-sand      ← (was surface-low — that token does not exist)
why-gaussia     bg-surface           (cards use bg-surface-strip-1..4)
contract        bg-surface-clay      ← (was surface-lower — that token does not exist)
how-it-works    bg-surface
modules         bg-surface-mist      ← (was surface-lowest — that's for cards, not the section bg)
get-started     bg-surface
contribute      bg-ink               <- the one dark moment
footer          bg-surface-sand
```

Use the `bg-*` Tailwind utilities mapped to those tokens. Never use literal
hex/rgb in components. Never use `text-white`/`bg-black` — go through tokens.

### Typography

- Headlines: `font-serif` (Instrument Serif) — most are italic on a key word
  (e.g. "*science*", "*shape*", "*reproducible*"). This italic treatment is the
  signature move. Use it sparingly — once per headline.
- Body: `font-sans` (Inter), `leading-relaxed` for paragraphs.
- Code: `font-mono` (JetBrains Mono), only inside `<pre>` blocks and inline
  metric names.
- The wordmark "Gaussia" in nav and footer is **`font-sans font-medium`**, not
  serif. (We changed this — don't revert.)
- No mono-uppercase eyebrow chatter. Eyebrows are lowercase Inter at `text-xs`
  with a small terracotta dot.

### Spacing & shape

- Tailwind spacing scale only (`p-6`, `gap-8`, etc). No arbitrary `[16px]`.
- **Mid radii**: `rounded-2xl` (1rem) and `rounded-3xl` for cards, full pill
  for buttons. No sharp corners.
- Layouts are **flexbox first**, grid only when 2D is genuinely needed.
- Hairlines (`border border-hair`) instead of heavy outlines. Quiet cards.

### Buttons

The convention across the page:

```
bg-terracotta text-surface hover:bg-ink transition-colors
```

Terracotta first, ink on hover. (We swapped this — don't flip back.) Used in
the nav CTA, hero CTA, and Python quickstart button.

Secondary buttons are ghost: `border border-hair-strong` with subtle hover.

### Icons

`lucide-react`, sized 16/18/20px. Never emojis.

---

## 5. Animations & motion

### Scroll reveals

`components/reveal.tsx` is an `IntersectionObserver` wrapper supporting these
variants:

- `up` (default) — fade + translate-y
- `left` / `right` — fade + translate-x (used for alternating cards / timelines)
- `scale` — fade + scale-up (used for module cards, how-it-works strip)
- `blur` — fade + blur-out (used for manifesto pull-quote and contract closing)
- `rise` — bigger upward translate (used for dark contribute cards)

Usage:

```tsx
<Reveal as="article" delay={i * 110} variant={i % 2 ? "right" : "left"}>
  ...
</Reveal>
```

The keyframes and `[data-reveal]` selectors live in `app/globals.css`. They
**respect `prefers-reduced-motion`** (everything snaps to identity). When
adding a new section, vary the variant from the section above so the page
keeps rhythm.

### Helpers in globals.css

- `.lift` — soft hover lift on cards (translateY + shadow). Use for featured
  cards (Why Gaussia, Modules), not every card.
- `.pulse-soft` — gentle breathing on small terracotta dots (hero eyebrow).

### The hero canvas (`gauss-canvas.tsx`)

This is the **only signature animation** on the page. Behavior:

- Single Gaussian bell drawn across the full hero, with the brown→terracotta
  →brown line gradient and a soft fill wash underneath.
- A small terracotta "sun" glows at the peak.
- Particles rain gently from above the canvas, fall on a slight curved drift,
  and **settle into the bell shape** (their resting positions are sampled from
  the Gaussian PDF + jittered y).
- After settling, particles **wander in 2D** using two independent slow sine
  waves per particle (different frequencies, phases, amplitudes for x and y),
  plus a shared shimmer term so the cluster breathes together.
- Re-rains on a 9–11s cycle (configurable in the `cycle` constant) so the
  shape never looks static.
- DPR-aware, resize-aware, paused when off-screen via IntersectionObserver,
  pauses on `prefers-reduced-motion` (renders a single static frame instead).

All visual constants (line alpha, particle alpha, fill wash, peak glow) were
**deliberately tuned soft** — quiet enough that the headline reads cleanly
over it. The hero wraps the canvas in a `pointer-events-none absolute inset-0
-z-10` div with three gradient overlays (top fade, bottom fade, horizontal
wash) so it lives behind the copy as ambient texture, not as a chart.

If you change the canvas, keep:

1. Single curve (not multiple overlapping bells).
2. Subdued alpha range — never punch up the line above ~0.5.
3. 2D wander on settled particles (frequencies ~0.0004–0.001, amplitudes
   ~10–30px in x, ~6–20px in y).
4. Reduced-motion fallback.

---

## 6. Copy rules

The following copy was provided by the user and **must not be paraphrased**:

- The manifesto quote: *"An evaluation metric is only as useful as the
  evidence behind it."*
- Hero headline: *Metrics grounded in science, built by the community.*
- The 4 "Why Gaussia" gaps and their before/after pairs.
- The 5 Gaussia Contract clauses and the closing italic line.
- The 5-node How it works flow.
- The 3 Modules (Evaluate / Protect / Improve) and their example metric
  bullets including paper citations.
- The pip/npm/extras command examples.
- The 5 Contribute steps.

The footer **does not** include the "If you can't trace it to a paper, it
isn't a metric" pull-quote and **does not** include an oversized wordmark
block. Both were intentionally removed.

---

## 7. Logo

`components/gaussia-logo.tsx` reproduces the user-provided mark in pure SVG:
two stylised brackets (filled charcoal glyphs) enclosing a Gaussian bell whose
stroke is a horizontal gradient (charcoal #323030 → terracotta #B85535/#C15A35
→ charcoal #323030). The viewBox is `0 0 920 641` with no background fill so
it composites transparently. It scales cleanly via the `size` prop (used at 18
in the nav, ~22 in the footer). Uses `useId()` for unique gradient IDs since
the component renders in both nav and footer. Don't replace it with a raster
image.

---

## 8. Conventions / things to keep

- All file paths in tools are absolute (`/vercel/share/v0-project/...`).
- Default package manager is `pnpm`. Dependencies are auto-detected from
  imports — don't hand-edit `package.json` to add packages.
- `<html className="bg-surface">` lives in `app/layout.tsx` — don't remove.
- `app/globals.css` is the single source of truth for tokens and reveal
  keyframes. Add new tokens there if needed; don't introduce theme variables
  inside components.
- Never use `localStorage` for persistence. (Currently the page has no
  persistence — if data is added later, use a real integration.)
- Never hardcode colors in components. Always use the tokens via Tailwind
  classes (`bg-terracotta`, `text-ink`, etc).
- Respect `prefers-reduced-motion` in any new animation.

---

## 9. Common requests & where to make them

| Request                          | Files to touch                                   |
| -------------------------------- | ------------------------------------------------ |
| Tweak section background        | `components/<section>.tsx` `bg-*` class          |
| Add a new section               | new component + import in `app/page.tsx`         |
| Change a token                  | `app/globals.css` `@theme inline` block          |
| Add a reveal variant            | `components/reveal.tsx` + keyframes in `globals.css` |
| Soften / strengthen hero anim   | `components/gauss-canvas.tsx` alpha + amp constants |
| Swap nav / hero / CTA color     | search `bg-terracotta text-surface hover:bg-ink` |
| Add an icon                     | import from `lucide-react`, size 16/18/20        |
| Edit copy                       | only with user's explicit text — don't paraphrase |

---

## 10. History of design pivots (so you don't undo them)

1. **First version** was futuristic / dashboard-y with Space Grotesk + Manrope
   + JetBrains Mono, multiple overlapping bell curves, mono uppercase
   eyebrows, heavy outlined cards. → Rejected as "too futuristic / over the
   place."
2. **Current version** pivoted to Anthropic-flavored calm: Instrument Serif
   italic headlines + Inter body, a single breathing bell, alternating warm
   surface tones per section, hairline dividers.
3. The hero canvas was originally framed inside a card; it is now a true
   ambient background behind the copy.
4. Particle motion was tuned **up** (not down) — frequencies ~2.5× and
   amplitudes ~2.5× the original — because the previous values were too
   static. Don't reduce them.
5. The graphic was softened **inside the canvas** (alpha values), not via a
   wrapper `opacity` class. The wrapper has no opacity.
6. Buttons swapped to terracotta-default / ink-on-hover (was the inverse).
7. Nav was shortened (`py-3`, smaller logo, sans wordmark).
8. Footer lost its oversized wordmark block and the "If you can't trace it…"
   pull-quote.

When in doubt, prefer the **calmer** option.
