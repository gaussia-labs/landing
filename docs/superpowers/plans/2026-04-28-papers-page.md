# Papers Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/papers` listing page and `/papers/[slug]` article pages that auto-render all `.tex` papers from `docs/papers/` in the Gaussia design system.

**Architecture:** `lib/papers.ts` reads `docs/papers/` with Node.js `fs` at build time, parses `.tex` preamble + body sections + `.bib` references; `generateStaticParams` pre-renders all paper routes as static HTML; `components/latex-renderer.tsx` converts raw LaTeX section content to React nodes with KaTeX for math — all server-side.

**Tech Stack:** Next.js 16 App Router (server components, `generateStaticParams`), `katex`, Node.js `fs` (server-only), Tailwind CSS v4, TypeScript strict.

---

## File Map

| File | Status | Responsibility |
|---|---|---|
| `scripts/copy-figures.js` | Create | Copies `docs/papers/*/figures/` → `public/papers/*/figures/` |
| `lib/papers.ts` | Create | Types, `getAllPapers()`, `getPaper()`, LaTeX metadata parser, bib parser |
| `app/papers/layout.tsx` | Create | Imports KaTeX CSS for paper pages only |
| `app/papers/page.tsx` | Create | `/papers` listing page (server component) |
| `app/papers/[slug]/page.tsx` | Create | `/papers/[slug]` detail page (server + `generateStaticParams`) |
| `components/paper-card.tsx` | Create | Card shown on listing page |
| `components/paper-toc.tsx` | Create | Sticky TOC sidebar with IntersectionObserver (client) |
| `components/paper-article.tsx` | Create | Full article layout: header + two-col + body (server) |
| `components/latex-renderer.tsx` | Create | LaTeX content string → React nodes (server) |
| `components/site-nav.tsx` | Modify | Add "Papers" nav link |
| `components/modules.tsx` | Modify | Add "Read the papers →" CTA |
| `package.json` | Modify | Add `predev`/`prebuild` scripts; `katex` dependency |

---

## Task 1 — Install katex + copy-figures script

**Files:**
- Create: `scripts/copy-figures.js`
- Modify: `package.json`

- [ ] **Step 1: Install katex**

```bash
pnpm add katex
pnpm add -D @types/katex
```

Expected: katex added to `dependencies`, `@types/katex` to `devDependencies`.

- [ ] **Step 2: Create the copy-figures script**

Create `scripts/copy-figures.js`:

```js
const fs = require("fs")
const path = require("path")

const PAPERS_DIR = path.join(__dirname, "../docs/papers")
const PUBLIC_DIR = path.join(__dirname, "../public/papers")

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

if (!fs.existsSync(PAPERS_DIR)) process.exit(0)

for (const slug of fs.readdirSync(PAPERS_DIR)) {
  const figDir = path.join(PAPERS_DIR, slug, "figures")
  if (!fs.existsSync(figDir)) continue
  copyDir(figDir, path.join(PUBLIC_DIR, slug, "figures"))
  console.log(`Copied figures for ${slug}`)
}
```

- [ ] **Step 3: Wire scripts into package.json**

Open `package.json`. Replace the `"scripts"` block with:

```json
"scripts": {
  "predev": "node scripts/copy-figures.js",
  "dev": "next dev",
  "prebuild": "node scripts/copy-figures.js",
  "build": "next build",
  "start": "next start",
  "lint": "eslint ."
},
```

- [ ] **Step 4: Verify figures copy**

```bash
node scripts/copy-figures.js
ls public/papers/
```

Expected: directories like `2026-04-agentic/figures/` appear in `public/papers/`.

- [ ] **Step 5: Commit**

```bash
git add scripts/copy-figures.js package.json pnpm-lock.yaml
git commit -m "feat: add katex and copy-figures prebuild script"
```

---

## Task 2 — lib/papers.ts: types + getAllPapers

**Files:**
- Create: `lib/papers.ts`

- [ ] **Step 1: Create lib/papers.ts with types and getAllPapers**

Create `lib/papers.ts`:

```ts
import fs from "fs"
import path from "path"

const PAPERS_DIR = path.join(process.cwd(), "docs/papers")

// ── Types ──────────────────────────────────────────────────────────────────

export type Author = {
  name: string
  email: string
  affiliation: string
}

export type PaperMeta = {
  slug: string
  title: string
  authors: Author[]
  date: string
  abstract: string
  keywords: string[]
  module: "Evaluate" | "Protect" | "Improve" | null
}

export type PaperSection = {
  heading: string
  level: 1 | 2
  content: string
}

export type BibEntry = {
  key: string
  text: string
  url?: string
}

export type Paper = PaperMeta & {
  sections: PaperSection[]
  references: BibEntry[]
}

// ── Brace-aware extractor ──────────────────────────────────────────────────

function extractBraced(tex: string, command: string): string {
  const idx = tex.indexOf(command + "{")
  if (idx === -1) return ""
  let depth = 0
  let result = ""
  let i = idx + command.length
  while (i < tex.length) {
    if (tex[i] === "{") {
      depth++
      if (depth === 1) { i++; continue }
    }
    if (tex[i] === "}") {
      depth--
      if (depth === 0) break
    }
    result += tex[i]
    i++
  }
  return result.trim()
}

// ── Preamble parsers ───────────────────────────────────────────────────────

function parseTitle(tex: string): string {
  const raw = extractBraced(tex, "\\title")
  return raw
    .replace(/\\textbf\{([^}]+)\}/g, "$1")
    .replace(/\\textit\{([^}]+)\}/g, "$1")
    .replace(/\\\\/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function parseAuthors(tex: string): Author[] {
  const raw = extractBraced(tex, "\\author")
  return raw.split(/\\and/).map((block) => {
    const lines = block
      .split(/\\\\/)
      .map((l) => l.replace(/\s+/g, " ").trim())
      .filter(Boolean)
    const name = lines[0] ?? ""
    const emailLine = lines.find((l) => l.includes("\\texttt{")) ?? ""
    const email = emailLine.match(/\\texttt\{([^}]+)\}/)?.[1] ?? ""
    const affiliation = lines.find((l) => !l.includes("\\texttt{") && l !== name) ?? ""
    return { name, email, affiliation }
  })
}

function parseDate(tex: string): string {
  return extractBraced(tex, "\\date")
}

function parseAbstract(tex: string): string {
  const start = tex.indexOf("\\begin{abstract}")
  const end = tex.indexOf("\\end{abstract}")
  if (start === -1 || end === -1) return ""
  return tex
    .slice(start + "\\begin{abstract}".length, end)
    .replace(/\\emph\{([^}]+)\}/g, "$1")
    .replace(/\\textbf\{([^}]+)\}/g, "$1")
    .replace(/\$[^$]+\$/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function parseKeywords(tex: string): string[] {
  const raw = extractBraced(tex, "\\keywords")
  if (!raw) return []
  return raw.split(/[,;]/).map((k) => k.trim()).filter(Boolean)
}

function inferModule(abstract: string, keywords: string[]): "Evaluate" | "Protect" | "Improve" | null {
  const text = (abstract + " " + keywords.join(" ")).toLowerCase()
  if (/agentic|pass@k|tool correctness|faithfulness|conversational|judge/.test(text)) return "Evaluate"
  if (/regulatory|compliance|bias|safety|toxicity|red.?team/.test(text)) return "Protect"
  if (/generator|synthetic|prompt.optim|optimization/.test(text)) return "Improve"
  return null
}

// ── getAllPapers ────────────────────────────────────────────────────────────

export function getAllPapers(): PaperMeta[] {
  if (!fs.existsSync(PAPERS_DIR)) return []

  const slugs = fs
    .readdirSync(PAPERS_DIR)
    .filter((d) => fs.statSync(path.join(PAPERS_DIR, d)).isDirectory())
    .sort()
    .reverse()

  return slugs.flatMap((slug) => {
    const dir = path.join(PAPERS_DIR, slug)
    const texFile = fs.readdirSync(dir).find((f) => f.endsWith(".tex"))
    if (!texFile) return []
    const tex = fs.readFileSync(path.join(dir, texFile), "utf-8")
    const abstract = parseAbstract(tex)
    const keywords = parseKeywords(tex)
    return [{
      slug,
      title: parseTitle(tex),
      authors: parseAuthors(tex),
      date: parseDate(tex),
      abstract,
      keywords,
      module: inferModule(abstract, keywords),
    }]
  })
}
```

- [ ] **Step 2: Verify getAllPapers parses all 4 papers**

Create a temporary test script `scripts/test-papers.mjs`:

```js
import { getAllPapers } from "../lib/papers.js"
const papers = getAllPapers()
console.log(JSON.stringify(papers, null, 2))
```

Run with:
```bash
node --experimental-vm-modules scripts/test-papers.mjs 2>/dev/null || node -e "
const { getAllPapers } = require('./lib/papers')
console.log(JSON.stringify(getAllPapers(), null, 2))
"
```

Expected: Array of 4 papers with title, authors (array with name/email/affiliation), date, abstract, keywords, and module populated. Delete `scripts/test-papers.mjs` after verifying.

- [ ] **Step 3: Commit**

```bash
git add lib/papers.ts
git commit -m "feat: add papers data layer with getAllPapers metadata parser"
```

---

## Task 3 — lib/papers.ts: getPaper + bib parser

**Files:**
- Modify: `lib/papers.ts`

- [ ] **Step 1: Add section parser**

Append to `lib/papers.ts` (after `getAllPapers`):

```ts
// ── Section parser ─────────────────────────────────────────────────────────

function parseSections(body: string): PaperSection[] {
  const sectionRx = /\\(sub)?section\*?\{([^}]+)\}/g
  const sections: PaperSection[] = []
  let lastIndex = 0
  let current: PaperSection | null = null
  let m: RegExpExecArray | null

  while ((m = sectionRx.exec(body)) !== null) {
    if (current) {
      current.content = body.slice(lastIndex, m.index).trim()
      sections.push(current)
    }
    current = { heading: m[2], level: m[1] === "sub" ? 2 : 1, content: "" }
    lastIndex = m.index + m[0].length
  }

  if (current) {
    current.content = body.slice(lastIndex).trim()
    sections.push(current)
  }

  return sections
}
```

- [ ] **Step 2: Add bib parser**

Append to `lib/papers.ts`:

```ts
// ── Bib parser ─────────────────────────────────────────────────────────────

function parseBib(bibContent: string): BibEntry[] {
  const entries: BibEntry[] = []
  // Match @type{key, ...fields... } blocks
  const entryRx = /@\w+\{(\w+),([\s\S]*?)(?=\n@|\s*$)/g
  let m: RegExpExecArray | null

  while ((m = entryRx.exec(bibContent)) !== null) {
    const key = m[1]
    const fields = m[2]

    const getField = (name: string) => {
      const fm = fields.match(new RegExp(`\\b${name}\\s*=\\s*[{"](.*?)[}"]`, "is"))
      return fm ? fm[1].replace(/\s+/g, " ").trim() : ""
    }

    const title = getField("title").replace(/[{}]/g, "")
    const author = getField("author")
    const year = getField("year")
    const venue = getField("journal") || getField("booktitle") || ""

    const arxivMatch = venue.match(/arXiv[:\s]*([\d.]+)/i)
    const url = arxivMatch ? `https://arxiv.org/abs/${arxivMatch[1]}` : undefined

    const firstAuthor = author.split(/,|\band\b/)[0].trim().split(" ").pop() ?? author
    const text = `${firstAuthor}${author.includes(",") || author.includes(" and ") ? " et al." : ""} (${year}). ${title}.${venue ? ` ${venue}.` : ""}`

    entries.push({ key, text, url })
  }

  return entries
}
```

- [ ] **Step 3: Add getPaper**

Append to `lib/papers.ts`:

```ts
// ── getPaper ───────────────────────────────────────────────────────────────

export function getPaper(slug: string): Paper | null {
  const dir = path.join(PAPERS_DIR, slug)
  if (!fs.existsSync(dir)) return null

  const texFile = fs.readdirSync(dir).find((f) => f.endsWith(".tex"))
  if (!texFile) return null

  const tex = fs.readFileSync(path.join(dir, texFile), "utf-8")

  // Extract document body
  const bodyStart = tex.indexOf("\\begin{document}")
  const bodyEnd = tex.indexOf("\\end{document}")
  const fullBody = tex.slice(
    bodyStart !== -1 ? bodyStart + "\\begin{document}".length : 0,
    bodyEnd !== -1 ? bodyEnd : undefined,
  )

  // Strip preamble noise from body
  const body = fullBody
    .replace(/\\maketitle/, "")
    .replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/, "")
    .trim()

  const abstract = parseAbstract(tex)
  const keywords = parseKeywords(tex)

  // Parse bib
  const bibFile = fs.readdirSync(dir).find((f) => f.endsWith(".bib"))
  const references = bibFile
    ? parseBib(fs.readFileSync(path.join(dir, bibFile), "utf-8"))
    : []

  return {
    slug,
    title: parseTitle(tex),
    authors: parseAuthors(tex),
    date: parseDate(tex),
    abstract,
    keywords,
    module: inferModule(abstract, keywords),
    sections: parseSections(body),
    references,
  }
}
```

- [ ] **Step 4: Verify getPaper**

Run in terminal (quick node check):

```bash
node -e "
const path = require('path')
process.chdir('$(pwd)')
" 2>/dev/null
```

Start `pnpm dev` in a separate terminal and add a temporary log:

```bash
pnpm dev
```

Then open `http://localhost:3000` — the site should still load normally (no changes visible yet). Confirm no TypeScript errors:

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add lib/papers.ts
git commit -m "feat: add getPaper with section and bib parsers"
```

---

## Task 4 — components/latex-renderer.tsx

**Files:**
- Create: `components/latex-renderer.tsx`

This is the core rendering engine. It converts raw LaTeX content strings to React nodes server-side using KaTeX for math.

- [ ] **Step 1: Create components/latex-renderer.tsx**

```tsx
import katex from "katex"
import type { ReactNode } from "react"
import type { BibEntry } from "@/lib/papers"

// Renders a raw LaTeX section content string into React nodes.
// Server component — never import this from client components.

type Props = {
  latex: string
  references: BibEntry[]
  slug: string
}

export function LatexContent({ latex, references, slug }: Props): ReactNode {
  const refMap = new Map(references.map((r, i) => [r.key, i + 1]))
  return renderBlocks(stripComments(latex), refMap, slug)
}

// ── Helpers ────────────────────────────────────────────────────────────────

function stripComments(tex: string): string {
  return tex.replace(/(?<!\\)%[^\n]*/gm, "")
}

function renderMath(tex: string, display: boolean): string {
  return katex.renderToString(tex.trim(), { displayMode: display, throwOnError: false })
}

// ── Block-level renderer ───────────────────────────────────────────────────

function renderBlocks(tex: string, refMap: Map<string, number>, slug: string): ReactNode {
  const nodes: ReactNode[] = []
  let remaining = tex.trim()
  let idx = 0

  while (remaining.length > 0) {
    remaining = remaining.trimStart()
    if (!remaining) break

    // Display math: \[...\]
    if (remaining.startsWith("\\[")) {
      const end = remaining.indexOf("\\]", 2)
      if (end !== -1) {
        nodes.push(
          <div
            key={idx++}
            className="my-6 overflow-x-auto text-center"
            dangerouslySetInnerHTML={{ __html: renderMath(remaining.slice(2, end), true) }}
          />,
        )
        remaining = remaining.slice(end + 2)
        continue
      }
    }

    // Environment: \begin{name}...\end{name}
    const beginMatch = remaining.match(/^\\begin\{(\w+\*?)\}/)
    if (beginMatch) {
      const envName = beginMatch[1]
      const endTag = `\\end{${envName}}`
      const contentStart = beginMatch[0].length
      const endIdx = remaining.indexOf(endTag, contentStart)
      if (endIdx !== -1) {
        const content = remaining.slice(contentStart, endIdx)
        nodes.push(renderEnv(envName, content, refMap, slug, idx++))
        remaining = remaining.slice(endIdx + endTag.length)
        continue
      }
    }

    // Text block: consume until next block-level construct
    const nextBlock = findNextBlock(remaining)
    const chunk = nextBlock > 0 ? remaining.slice(0, nextBlock) : remaining
    if (chunk.trim()) {
      chunk
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .forEach((para) => {
          nodes.push(
            <p key={idx++} className="text-ink-soft leading-relaxed text-base my-4">
              {renderInline(para, refMap)}
            </p>,
          )
        })
    }
    if (nextBlock === 0) break
    remaining = remaining.slice(nextBlock)
  }

  return <>{nodes}</>
}

function findNextBlock(text: string): number {
  const candidates = [/\\begin\{/, /\\\[/]
  let earliest = text.length
  for (const rx of candidates) {
    const m = text.match(rx)
    if (m?.index !== undefined && m.index < earliest) earliest = m.index
  }
  return earliest < text.length ? earliest : 0
}

// ── Environment renderer ───────────────────────────────────────────────────

function renderEnv(
  name: string,
  content: string,
  refMap: Map<string, number>,
  slug: string,
  key: number,
): ReactNode {
  const bare = name.replace(/\*$/, "")

  switch (bare) {
    case "equation":
    case "align":
    case "equation*":
    case "align*":
      return (
        <div
          key={key}
          className="my-6 overflow-x-auto text-center"
          dangerouslySetInnerHTML={{ __html: renderMath(content, true) }}
        />
      )

    case "itemize":
      return (
        <ul key={key} className="my-4 pl-6 space-y-2 list-disc text-ink-soft leading-relaxed text-base">
          {content
            .split(/\\item/)
            .filter((s) => s.trim())
            .map((item, i) => (
              <li key={i}>{renderInline(item.trim(), refMap)}</li>
            ))}
        </ul>
      )

    case "enumerate":
      return (
        <ol key={key} className="my-4 pl-6 space-y-2 list-decimal text-ink-soft leading-relaxed text-base">
          {content
            .split(/\\item/)
            .filter((s) => s.trim())
            .map((item, i) => (
              <li key={i}>{renderInline(item.trim(), refMap)}</li>
            ))}
        </ol>
      )

    case "figure": {
      const imgMatch = content.match(/\\includegraphics(?:\[.*?\])?\{([^}]+)\}/)
      const captionMatch = content.match(/\\caption\{([^}]+)\}/)
      const src = imgMatch
        ? `/papers/${slug}/figures/${imgMatch[1].replace(/^.*[\\/]/, "")}`
        : null
      const caption = captionMatch?.[1] ?? null
      return (
        <figure key={key} className="my-8">
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={caption ?? "Figure"} className="rounded-xl w-full" />
          )}
          {caption && (
            <figcaption className="mt-2 text-xs text-ink-muted italic text-center">
              {caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case "tabular": {
      // Strip column spec from the start of content
      const tableBody = content.replace(/^\{[^}]+\}\s*/, "")
      const rows = tableBody
        .split(/\\\\/)
        .map((r) => r.trim())
        .filter(
          (r) =>
            r &&
            !/^\\(hline|toprule|midrule|bottomrule|cline)/.test(r),
        )
      if (!rows.length) return null
      const [header, ...body] = rows
      const headerCells = header.split("&").map((c) => c.trim())
      return (
        <div key={key} className="my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-hair-strong">
                {headerCells.map((c, i) => (
                  <th key={i} className="py-2 px-3 text-left font-medium text-ink font-mono">
                    {renderInline(c, refMap)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri} className="border-b border-hair">
                  {row.split("&").map((c, ci) => (
                    <td key={ci} className="py-2 px-3 text-ink-soft font-mono">
                      {renderInline(c.trim(), refMap)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    case "algorithm":
    case "algorithmic":
      return (
        <div
          key={key}
          className="my-6 bg-ink text-surface rounded-xl p-6 font-mono text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed"
        >
          {cleanAlgorithm(content)}
        </div>
      )

    default:
      // Unknown env — pass content through block renderer
      return (
        <div key={key}>
          {renderBlocks(content, refMap, slug)}
        </div>
      )
  }
}

function cleanAlgorithm(content: string): string {
  return content
    .replace(/\\Procedure\{([^}]+)\}\{([^}]*)\}/g, "procedure $1($2):")
    .replace(/\\EndProcedure/g, "end procedure")
    .replace(/\\State\s*/g, "  ")
    .replace(/\\If\{([^}]+)\}/g, "if $1:")
    .replace(/\\ElsIf\{([^}]+)\}/g, "else if $1:")
    .replace(/\\Else/g, "else:")
    .replace(/\\EndIf/g, "end if")
    .replace(/\\For\{([^}]+)\}/g, "for $1:")
    .replace(/\\ForAll\{([^}]+)\}/g, "for all $1:")
    .replace(/\\EndFor/g, "end for")
    .replace(/\\While\{([^}]+)\}/g, "while $1:")
    .replace(/\\EndWhile/g, "end while")
    .replace(/\\Return\s*/g, "return ")
    .replace(/\\Require\s*/g, "require: ")
    .replace(/\\Ensure\s*/g, "ensure: ")
    .replace(/\\Comment\{([^}]+)\}/g, "  // $1")
    .replace(/\\[a-zA-Z]+\{([^}]*)\}/g, "$1")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/[{}]/g, "")
    .trim()
}

// ── Inline renderer ────────────────────────────────────────────────────────

function renderInline(text: string, refMap: Map<string, number>): ReactNode {
  const parts: ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining) {
    // Find next inline math $...$
    const dollarIdx = remaining.indexOf("$")
    if (dollarIdx !== -1) {
      if (dollarIdx > 0) {
        parts.push(renderText(remaining.slice(0, dollarIdx), refMap, key++))
      }
      const closeIdx = remaining.indexOf("$", dollarIdx + 1)
      if (closeIdx !== -1) {
        const math = remaining.slice(dollarIdx + 1, closeIdx)
        parts.push(
          <span
            key={key++}
            dangerouslySetInnerHTML={{ __html: renderMath(math, false) }}
          />,
        )
        remaining = remaining.slice(closeIdx + 1)
        continue
      }
    }
    parts.push(renderText(remaining, refMap, key++))
    break
  }

  return <>{parts}</>
}

function renderText(text: string, refMap: Map<string, number>, key: number): ReactNode {
  const html = text
    .replace(/\\textbf\{([^}]+)\}/g, "<strong>$1</strong>")
    .replace(/\\textit\{([^}]+)\}/g, "<em>$1</em>")
    .replace(/\\emph\{([^}]+)\}/g, "<em>$1</em>")
    .replace(/\\texttt\{([^}]+)\}/g, '<code class="font-mono text-sm bg-surface-sand px-1 rounded">$1</code>')
    .replace(/\\url\{([^}]+)\}/g, '<a href="$1" class="text-terracotta underline" target="_blank" rel="noopener">$1</a>')
    .replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, '<a href="$1" class="text-terracotta underline" target="_blank" rel="noopener">$2</a>')
    .replace(/\\citet\{([^}]+)\}/g, (_, keys: string) => {
      const nums = keys.split(",").map((k) => refMap.get(k.trim()) ?? "?")
      return `<sup class="text-terracotta text-xs font-medium">[${nums.join(",")}]</sup>`
    })
    .replace(/\\citep?\{([^}]+)\}/g, (_, keys: string) => {
      const nums = keys.split(",").map((k) => refMap.get(k.trim()) ?? "?")
      return `<sup class="text-terracotta text-xs font-medium">[${nums.join(",")}]</sup>`
    })
    .replace(/~\\ref\{[^}]+\}/g, "")
    .replace(/\\ref\{[^}]+\}/g, "")
    .replace(/~(?=\S)/g, " ")
    .replace(/\\[a-zA-Z]+\{([^}]*)\}/g, "$1")
    .replace(/\\[a-zA-Z@]+/g, "")
    .replace(/[{}]/g, "")

  return <span key={key} dangerouslySetInnerHTML={{ __html: html }} />
}
```

- [ ] **Step 2: Check TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/latex-renderer.tsx
git commit -m "feat: add LaTeX content renderer with KaTeX and environment support"
```

---

## Task 5 — paper-card + papers listing page

**Files:**
- Create: `components/paper-card.tsx`
- Create: `app/papers/layout.tsx`
- Create: `app/papers/page.tsx`

- [ ] **Step 1: Create components/paper-card.tsx**

```tsx
import Link from "next/link"
import type { PaperMeta } from "@/lib/papers"

export function PaperCard({ paper }: { paper: PaperMeta }) {
  const excerpt = paper.abstract.split(/[.!?]/).slice(0, 2).join(". ") + "."

  return (
    <Link
      href={`/papers/${paper.slug}`}
      className="lift group block bg-surface-lowest rounded-2xl border border-hair p-8 flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        {paper.module && (
          <span className="bg-terracotta-pale text-terracotta rounded-full text-xs px-2.5 py-0.5 font-medium">
            {paper.module}
          </span>
        )}
        <span className="text-ink-muted text-xs">{paper.date}</span>
      </div>

      <div className="flex-1">
        <h2 className="font-serif text-xl text-ink leading-snug mb-2">
          {paper.title}
        </h2>
        <p className="text-ink-muted text-sm">
          {paper.authors.map((a) => a.name).join(", ")}
        </p>
      </div>

      <p className="text-ink-soft text-sm leading-relaxed line-clamp-3">
        {excerpt}
      </p>

      <span className="text-terracotta text-sm group-hover:underline">
        Read paper →
      </span>
    </Link>
  )
}
```

- [ ] **Step 2: Create app/papers/layout.tsx**

This file loads KaTeX CSS for all paper pages without affecting the rest of the site.

```tsx
import "katex/dist/katex.min.css"

export default function PapersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 3: Create app/papers/page.tsx**

```tsx
import { getAllPapers } from "@/lib/papers"
import { PaperCard } from "@/components/paper-card"
import { Reveal } from "@/components/reveal"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

export const metadata = {
  title: "Research Papers — Gaussia",
  description: "Every Gaussia metric traces back to a peer-reviewed publication.",
}

export default function PapersPage() {
  const papers = getAllPapers()

  return (
    <div className="min-h-screen bg-surface">
      <SiteNav />

      <main className="pt-24 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          {/* Editorial header */}
          <Reveal>
            <div className="flex items-center gap-2 mb-6">
              <span className="size-1.5 rounded-full bg-terracotta" />
              <span className="text-xs text-ink-muted">research</span>
            </div>
            <h1 className="font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[1.05] text-ink tracking-tightest text-balance mb-4">
              Papers grounded in <em>science.</em>
            </h1>
            <p className="text-ink-soft leading-relaxed max-w-xl mb-12">
              Every Gaussia metric traces back to a peer-reviewed publication.
            </p>
          </Reveal>

          <div className="border-t border-hair mb-12" />

          {/* Card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {papers.map((paper, i) => (
              <Reveal
                key={paper.slug}
                delay={i * 100}
                variant={i % 2 === 0 ? "left" : "right"}
              >
                <PaperCard paper={paper} />
              </Reveal>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
```

- [ ] **Step 4: Verify listing page in browser**

```bash
pnpm dev
```

Visit `http://localhost:3000/papers`. Confirm:
- All 4 paper cards render with correct title, authors, date, module badge, abstract excerpt
- Cards have `lift` hover effect
- "Read paper →" link appears on each card
- Layout is 2-column on desktop, 1-column on mobile

- [ ] **Step 5: Commit**

```bash
git add components/paper-card.tsx app/papers/layout.tsx app/papers/page.tsx
git commit -m "feat: add papers listing page with editorial header and card grid"
```

---

## Task 6 — components/paper-toc.tsx

**Files:**
- Create: `components/paper-toc.tsx`

- [ ] **Step 1: Create components/paper-toc.tsx**

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import type { PaperSection } from "@/lib/papers"
import { cn } from "@/lib/utils"

type Props = {
  sections: PaperSection[]
}

export function PaperToc({ sections }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const h2s = sections.filter((s) => s.level === 1)

  useEffect(() => {
    const headings = h2s.map((s) => {
      const id = slugifyHeading(s.heading)
      return document.getElementById(id)
    }).filter(Boolean) as HTMLElement[]

    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 },
    )

    for (const el of headings) observer.observe(el)
    return () => observer.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <nav className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-28 space-y-1">
        <Link
          href="/papers"
          className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors mb-4"
        >
          <span>←</span>
          <span>Back to papers</span>
        </Link>

        <p className="text-xs text-ink-muted uppercase tracking-wider mb-3">Contents</p>

        {h2s.map((s) => {
          const id = slugifyHeading(s.heading)
          const isActive = activeId === id
          return (
            <a
              key={id}
              href={`#${id}`}
              className={cn(
                "block text-xs py-1 transition-colors leading-snug",
                isActive
                  ? "text-terracotta font-medium"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {s.heading}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

export function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60)
}
```

- [ ] **Step 2: Check TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/paper-toc.tsx
git commit -m "feat: add sticky paper TOC with IntersectionObserver active tracking"
```

---

## Task 7 — components/paper-article.tsx

**Files:**
- Create: `components/paper-article.tsx`

- [ ] **Step 1: Create components/paper-article.tsx**

```tsx
import type { Paper } from "@/lib/papers"
import { PaperToc, slugifyHeading } from "@/components/paper-toc"
import { LatexContent } from "@/components/latex-renderer"

export function PaperArticle({ paper }: { paper: Paper }) {
  return (
    <article className="mx-auto max-w-6xl px-6 pt-24 pb-24">
      {/* Article header */}
      <header className="mb-12 max-w-3xl">
        <div className="flex items-center gap-2 mb-5">
          <span className="size-1.5 rounded-full bg-terracotta" />
          <span className="text-xs text-ink-muted">research paper</span>
          {paper.module && (
            <span className="bg-terracotta-pale text-terracotta rounded-full text-xs px-2.5 py-0.5 font-medium ml-1">
              {paper.module}
            </span>
          )}
        </div>

        <h1 className="font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] text-ink tracking-tightest mb-6 text-balance">
          {paper.title}
        </h1>

        {/* Authors */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 mb-4">
          {paper.authors.map((author) => (
            <div key={author.name}>
              <p className="text-sm text-ink font-medium">{author.name}</p>
              {author.email && (
                <p className="text-xs text-ink-muted">{author.email}</p>
              )}
              {author.affiliation && (
                <p className="text-xs text-ink-muted">{author.affiliation}</p>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-ink-muted mb-4">{paper.date}</p>

        {/* Keywords */}
        {paper.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {paper.keywords.map((kw) => (
              <span
                key={kw}
                className="bg-surface-sand rounded-full px-2.5 py-0.5 text-xs text-ink-muted"
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* Abstract callout */}
        <div className="bg-surface-sand rounded-2xl p-6">
          <p className="text-xs text-ink-muted uppercase tracking-wider mb-3">Abstract</p>
          <p className="text-ink-soft leading-relaxed">{paper.abstract}</p>
        </div>
      </header>

      <div className="border-t border-hair mb-12" />

      {/* Two-column layout */}
      <div className="flex gap-16">
        <PaperToc sections={paper.sections} />

        {/* Article body */}
        <div className="flex-1 min-w-0 max-w-2xl">
          {paper.sections.map((section) => {
            const id = slugifyHeading(section.heading)
            const Tag = section.level === 1 ? "h2" : "h3"
            return (
              <div key={id}>
                {section.level === 1 && (
                  <div className="border-t border-hair mt-12 mb-4" />
                )}
                <Tag
                  id={id}
                  className={
                    section.level === 1
                      ? "font-serif text-2xl text-ink mt-2 mb-4 scroll-mt-28"
                      : "font-sans font-medium text-lg text-ink mt-8 mb-3 scroll-mt-28"
                  }
                >
                  {section.heading}
                </Tag>
                <LatexContent
                  latex={section.content}
                  references={paper.references}
                  slug={paper.slug}
                />
              </div>
            )
          })}

          {/* Bibliography */}
          {paper.references.length > 0 && (
            <div className="mt-16 pt-8 border-t border-hair">
              <h2 className="font-serif text-2xl text-ink mb-6">References</h2>
              <ol className="space-y-3">
                {paper.references.map((ref, i) => (
                  <li key={ref.key} className="flex gap-3 text-sm text-ink-muted">
                    <span className="shrink-0 font-medium text-ink-muted">[{i + 1}]</span>
                    <span>
                      {ref.url ? (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-terracotta transition-colors font-mono text-xs"
                        >
                          {ref.text}
                        </a>
                      ) : (
                        ref.text
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Check TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/paper-article.tsx
git commit -m "feat: add paper article layout with header, TOC, body, and bibliography"
```

---

## Task 8 — app/papers/[slug]/page.tsx

**Files:**
- Create: `app/papers/[slug]/page.tsx`

- [ ] **Step 1: Create app/papers/[slug]/page.tsx**

```tsx
import { notFound } from "next/navigation"
import { getAllPapers, getPaper } from "@/lib/papers"
import { PaperArticle } from "@/components/paper-article"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"

export async function generateStaticParams() {
  return getAllPapers().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const paper = getPaper(slug)
  if (!paper) return {}
  return {
    title: `${paper.title} — Gaussia`,
    description: paper.abstract.slice(0, 160),
  }
}

export default async function PaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const paper = getPaper(slug)
  if (!paper) notFound()

  return (
    <div className="min-h-screen bg-surface">
      <SiteNav />
      <PaperArticle paper={paper} />
      <SiteFooter />
    </div>
  )
}
```

- [ ] **Step 2: Verify paper detail page in browser**

With `pnpm dev` running, visit `http://localhost:3000/papers/2026-04-agentic`.

Confirm:
- Article header renders: title, authors (name + email + affiliation), date, keywords pills, abstract in sand callout
- TOC shows section headings on left (desktop only)
- Article body renders sections in order
- Math equations render (KaTeX)
- "← Back to papers" link works
- Visit `http://localhost:3000/papers/2026-04-prompt-optimization` — confirm math-heavy paper renders correctly
- Visit `http://localhost:3000/papers/2026-04-generators` — confirm figures render

- [ ] **Step 3: Test static build**

```bash
pnpm build
```

Expected: Build succeeds, output shows 4 static routes:
- `/papers`
- `/papers/2026-04-agentic`
- `/papers/2026-04-generators`
- `/papers/2026-04-prompt-optimization`
- `/papers/2026-04-regulatory`

- [ ] **Step 4: Commit**

```bash
git add app/papers/[slug]/page.tsx
git commit -m "feat: add paper detail page with generateStaticParams for all 4 papers"
```

---

## Task 9 — Nav + Modules integration

**Files:**
- Modify: `components/site-nav.tsx`
- Modify: `components/modules.tsx`

- [ ] **Step 1: Add Papers link to site-nav.tsx**

In `components/site-nav.tsx`, the `links` array is at line 8. Add `"Papers"` at the end:

```ts
// Replace the links array (lines 8–13)
const links = [
  { label: "Manifesto", href: "#manifesto" },
  { label: "How it works", href: "#flow" },
  { label: "Modules", href: "#modules" },
  { label: "Contribute", href: "#contribute" },
  { label: "Papers", href: "/papers" },
]
```

Add the `Link` import at the top of the file (after `"use client"`):

```ts
import Link from "next/link"
```

In the desktop nav loop (around line 94–110), replace the single `<a>` with a conditional render — `Link` for the Papers route, `<a>` for anchors:

```tsx
{links.map((l) => {
  const isActive = activeId === l.href.slice(1)
  const cls = cn(
    "text-sm transition-colors",
    isActive ? "text-terracotta" : "text-ink-muted hover:text-ink",
  )
  return l.href.startsWith("/") ? (
    <Link key={l.href} href={l.href} className={cls}>
      {l.label}
    </Link>
  ) : (
    <a key={l.href} href={l.href} className={cls}>
      {l.label}
    </a>
  )
})}
```

In the mobile menu (around line 171–189), replace the `<a>` with a conditional render:

```tsx
{links.map((l, i) => {
  const isActive = activeId === l.href.slice(1)
  const cls = cn(
    "flex items-center gap-4 py-3.5 text-lg transition-colors border-b border-hair",
    isActive ? "text-terracotta" : "text-ink",
  )
  const inner = (
    <>
      <span className="font-mono text-xs text-ink-muted w-6">
        {String(i + 1).padStart(2, "0")}
      </span>
      <span>{l.label}</span>
    </>
  )
  return (
    <li key={l.href}>
      {l.href.startsWith("/") ? (
        <Link
          href={l.href}
          onClick={closeMobile}
          className={cls}
          style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms" }}
        >
          {inner}
        </Link>
      ) : (
        <a
          href={l.href}
          onClick={closeMobile}
          className={cls}
          style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms" }}
        >
          {inner}
        </a>
      )}
    </li>
  )
})}
```

- [ ] **Step 2: Add "Read the papers →" CTA to modules.tsx**

In `components/modules.tsx`, add after the closing `</div>` of the mobile slider section (around line 202, before the closing `</section>`):

```tsx
      {/* Read the papers CTA */}
      <div className="mt-12 flex justify-center">
        <Reveal>
          <a
            href="/papers"
            className="inline-flex items-center rounded-full border border-hair-strong bg-surface/70 text-ink px-6 py-2.5 text-sm hover:bg-surface-sand transition-colors"
          >
            Read the papers →
          </a>
        </Reveal>
      </div>
```

Place this inside the outermost `<div className="mx-auto max-w-6xl px-6">` wrapper, after both the desktop grid and mobile slider sections, before the `</div>` that closes the `px-6` container. The exact insertion point in the file is after line 201 (`</div>` closing the mobile dot indicators) and before line 203 (`</section>`).

Since the mobile slider is rendered outside the `max-w-6xl` container, add the CTA in its own centered container:

```tsx
      {/* CTA below modules */}
      <div className="mx-auto max-w-6xl px-6 mt-12 flex justify-center">
        <Reveal>
          <a
            href="/papers"
            className="inline-flex items-center rounded-full border border-hair-strong bg-surface/70 text-ink px-6 py-2.5 text-sm hover:bg-surface-sand transition-colors"
          >
            Read the papers →
          </a>
        </Reveal>
      </div>
```

Insert this block before the closing `</section>` tag at the bottom of `modules.tsx`.

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:3000`:
- "Papers" link appears in desktop nav; clicking navigates to `/papers`
- "Papers" appears in mobile menu (5th item, numbered "05")
- "Read the papers →" button appears below the module cards
- Clicking the button navigates to `/papers`

- [ ] **Step 4: Commit**

```bash
git add components/site-nav.tsx components/modules.tsx
git commit -m "feat: add Papers nav link and Read the papers CTA in modules section"
```

---

## Task 10 — Final verification

- [ ] **Step 1: Full dev smoke test**

With `pnpm dev` running, check each paper:

| URL | Confirm |
|---|---|
| `/papers` | 4 cards, badges, excerpts, hover lift |
| `/papers/2026-04-agentic` | Math renders (pass@K formula), TOC active on scroll |
| `/papers/2026-04-prompt-optimization` | Dense math renders, tables render |
| `/papers/2026-04-generators` | Figures render from `/papers/2026-04-generators/figures/` |
| `/papers/2026-04-regulatory` | "Protect" badge, full sections |

- [ ] **Step 2: Check bibliography**

On any paper detail page, scroll to bottom. Confirm:
- References list numbered `[1]`, `[2]`, etc.
- Citation superscripts in body match reference numbers
- DOI/arXiv entries are clickable links

- [ ] **Step 3: Check reduced-motion**

Open DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`. Reload `/papers`. Confirm cards appear immediately without animation.

- [ ] **Step 4: Production build**

```bash
pnpm build
pnpm start
```

Visit `http://localhost:3000/papers` and `http://localhost:3000/papers/2026-04-agentic` in production mode. Confirm KaTeX math renders (CSS loaded from layout.tsx). Confirm no console errors.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: papers page — listing, detail articles, nav and modules integration"
```
