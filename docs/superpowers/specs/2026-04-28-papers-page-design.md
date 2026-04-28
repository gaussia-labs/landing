# Papers Page — Design Spec
_Date: 2026-04-28_

## Context

Gaussia is paper-first: every metric traces back to a peer-reviewed publication. The papers currently live as `.tex` files in `docs/papers/` but are invisible to site visitors. This feature makes them a first-class part of the site — a browsable research index (`/papers`) and individual readable article pages (`/papers/[slug]`) — reinforcing the brand promise that evaluation must be scientifically grounded and traceable.

The entry points are the main nav and the Modules section CTA, placing the research at the heart of the product story.

---

## Architecture

### Data layer — `lib/papers.ts` (server-only)

Two functions, called exclusively from server components:

**`getAllPapers(): PaperMeta[]`**
- Walks `docs/papers/` with Node.js `fs`
- For each subdirectory, reads the `.tex` file and parses the preamble
- Returns sorted array (newest first, by directory name which encodes `YYYY-MM`)
- Used by `/papers` listing page and `generateStaticParams`

**`getPaper(slug: string): Paper`**
- Reads and fully parses `docs/papers/[slug]/*.tex`
- Returns `PaperMeta` + `sections[]`
- Used by `/papers/[slug]` detail page

**Types:**
```ts
type PaperMeta = {
  slug: string           // directory name, e.g. "2026-04-agentic"
  title: string          // from \title{}
  authors: string[]      // parsed from \author{}
  date: string           // from \date{}
  abstract: string       // from \begin{abstract}...\end{abstract}
  keywords: string[]     // from \keywords{} if present
  module: "Evaluate" | "Protect" | "Improve" | null  // inferred by keyword matching (see below)
}

// Module inference — keyword matching against abstract + keywords[]:
// "Evaluate" if any of: agentic, pass@k, judge, tool correctness, faithfulness, conversational
// "Protect"  if any of: regulatory, compliance, bias, safety, toxicity, red team
// "Improve"  if any of: generator, synthetic, prompt optim*, optimization
// null if no match

type PaperSection = {
  heading: string
  level: 1 | 2           // \section vs \subsection
  content: string        // raw LaTeX content string
}

type BibEntry = {
  key: string       // cite key, e.g. "brown2020"
  text: string      // formatted reference string
  url?: string      // DOI or arXiv URL if present
}

type Paper = PaperMeta & { sections: PaperSection[]; references: BibEntry[] }
// getPaper() reads both the .tex and the .bib file to populate references[]
```

**Slug:** directory name used as-is. Encodes date + topic naturally. No slugification needed.

### Figure assets

Each paper's `docs/papers/[slug]/figures/` images are copied to `public/papers/[slug]/figures/` at build time via a `prebuild` script (`scripts/copy-figures.js`) wired into `package.json` as `"prebuild": "node scripts/copy-figures.js"`. The script also runs in `predev` so figures are available in development. The article renderer references them as `/papers/[slug]/figures/filename.png`.

### LaTeX parser (inside `lib/papers.ts`)

Custom regex-based. Handles the consistent package stack used by all Gaussia papers:

| LaTeX construct | Rendered as |
|---|---|
| `$...$` | KaTeX inline |
| `$$...$$` / `\begin{equation}` | KaTeX block |
| `\textbf{x}` | `<strong>` |
| `\textit{x}` / `\emph{x}` | `<em>` |
| `\section{x}` | `PaperSection` level 1 |
| `\subsection{x}` | `PaperSection` level 2 |
| `\begin{itemize}` | `<ul>` |
| `\begin{enumerate}` | `<ol>` |
| `\begin{tabular}` | HTML table (no vertical lines, hairline horizontals) |
| `\includegraphics{x}` + `\caption{x}` | `<figure><img /><figcaption /></figure>` |
| `\begin{algorithm}` | dark code block (JetBrains Mono, `bg-ink text-surface`) |
| `\cite{x}` / `\citet{x}` | inline superscript `[n]` linked to bibliography |
| `\bibliography` / `.bib` entries | numbered list at page bottom |

The parser does **not** attempt to handle arbitrary LaTeX — only the constructs present in the Gaussia paper template. Faithful to the paper, not a full LaTeX engine.

---

## `/papers` — Listing page

**File:** `app/papers/page.tsx` (server component)

**Background:** `bg-surface`

**Structure:**

1. **Editorial header**
   - Terracotta eyebrow dot + `"research"` label (`text-xs text-ink-muted lowercase`)
   - Instrument Serif headline: _Papers grounded in science._ (italic on "science")
   - Inter subtitle: "Every Gaussia metric traces back to a peer-reviewed publication."
   - Hairline divider below (`border-hair`)

2. **Card grid**
   - 2 columns desktop / 1 column mobile
   - Cards: `bg-surface-lowest rounded-2xl border border-hair .lift`
   - Wrapped in `<Reveal>` with staggered delay, alternating `left`/`right` variants

**Each card:**
| Element | Style |
|---|---|
| Module badge | `bg-terracotta-pale text-terracotta rounded-full text-xs px-2 py-0.5` |
| Date | `text-ink-muted text-xs` |
| Title | Instrument Serif `text-xl`, no italic treatment (academic titles are formal; italic is not applied algorithmically) |
| Authors | Inter `text-ink-muted text-sm`, comma-separated |
| Abstract excerpt | First 2 sentences, `text-ink-soft text-sm leading-relaxed`, 3-line clamp |
| CTA | `"Read paper →"` — `text-terracotta text-sm`, text link (no button) |

---

## `/papers/[slug]` — Article page

**Files:**
- `app/papers/[slug]/page.tsx` (server component, uses `generateStaticParams`)
- `components/paper-article.tsx` — article renderer (client component for TOC scroll tracking)
- `components/paper-toc.tsx` — sticky sidebar TOC
- `components/latex-renderer.tsx` — converts parsed LaTeX content string → React nodes (KaTeX, tables, figures, etc.)

**Background:** `bg-surface`

**Layout:** Two-column on desktop (TOC left, narrow; article right, `max-w-2xl`). Single column on mobile (TOC hidden).

### Article header (above columns)

| Element | Style |
|---|---|
| Eyebrow | `"research paper"` — `text-xs text-ink-muted` |
| Title | Instrument Serif, large, no algorithmic italic (formal academic titles rendered as-is) |
| Authors + emails | `text-ink-muted text-sm`, one per line |
| Date | `text-xs text-ink-muted` |
| Keywords | `bg-surface-sand rounded-full px-2 py-0.5 text-xs` pills |
| Abstract | `bg-surface-sand rounded-2xl p-6`, `text-ink-soft leading-relaxed` callout block |

### TOC sidebar (`paper-toc.tsx`)

- Lists `\section` headings only (not subsections)
- `"← Back to papers"` link at top
- Active section: `text-terracotta font-medium` (IntersectionObserver scroll tracking)
- Inactive: `text-ink-muted text-xs`
- Sticky position on desktop

### Article body rendering

| Element | Style |
|---|---|
| `\section` | `<h2>` Instrument Serif `text-2xl mt-12 mb-4`, hairline above |
| `\subsection` | `<h3>` Inter `font-medium text-lg mt-8 mb-3` |
| Paragraphs | Inter `text-ink-soft leading-relaxed text-base` |
| Inline math | KaTeX inline |
| Display math | KaTeX block, centered, `my-6` |
| Tables | HTML table, `border-hair` horizontal rules, `font-mono text-sm`, caption below `text-xs text-ink-muted italic` |
| Figures | `<img>` `rounded-xl` full column width, caption below `text-xs text-ink-muted italic` |
| Lists | `<ul>/<ol>` `text-ink-soft leading-relaxed` left-padded |
| Algorithm blocks | `bg-ink text-surface rounded-xl p-6 font-mono text-sm my-6` |
| Citations | Inline superscript `[n]` linked to bibliography at page bottom |
| Bibliography | Numbered list, `text-sm text-ink-muted`, JetBrains Mono for DOI/arXiv |

---

## Nav & Modules integration

**`components/site-nav.tsx`**
- Add `"Papers"` link pointing to `/papers`
- Style: Inter `text-sm text-ink-muted hover:text-ink` — matches existing nav items

**`components/modules.tsx`**
- Add `"Read the papers →"` CTA below the module cards
- Style: ghost secondary button — `border border-hair-strong bg-surface/70 text-ink rounded-full`
- Links to `/papers`

---

## New files

| File | Purpose |
|---|---|
| `lib/papers.ts` | Data layer: `getAllPapers()`, `getPaper()`, parser, types |
| `app/papers/page.tsx` | Listing page (server component) |
| `app/papers/[slug]/page.tsx` | Detail page (server component, `generateStaticParams`) |
| `components/paper-card.tsx` | Single card for listing page |
| `components/paper-article.tsx` | Article layout + renderer orchestrator |
| `components/paper-toc.tsx` | Sticky TOC sidebar (client component) |
| `components/latex-renderer.tsx` | LaTeX string → React nodes |
| `scripts/copy-figures.js` | Copies `docs/papers/*/figures/` → `public/papers/*/figures/` at build time |

## Modified files

| File | Change |
|---|---|
| `components/site-nav.tsx` | Add "Papers" nav link |
| `components/modules.tsx` | Add "Read the papers →" CTA |
| `package.json` | Add `prebuild` script to run `copy-figures.js`; add `katex` dependency |

---

## Verification

1. `pnpm dev` — visit `/papers`, confirm all 4 papers appear as cards with correct metadata
2. Click a card — confirm article page renders at `/papers/2026-04-agentic` (or any slug)
3. Check math renders correctly (prompt-optimization and agentic papers are math-heavy)
4. Check figures appear (agentic and prompt-optimization have figures)
5. Check tables render (booktabs style, no vertical lines)
6. Check algorithm blocks render as dark code blocks
7. Check TOC highlights active section on scroll
8. Check "← Back to papers" link works
9. Confirm "Papers" appears in nav and links to `/papers`
10. Confirm "Read the papers →" CTA appears in Modules section
11. Run `pnpm build` — confirm `generateStaticParams` produces 4 static routes with no errors
12. Test `prefers-reduced-motion` — reveals should snap to identity
