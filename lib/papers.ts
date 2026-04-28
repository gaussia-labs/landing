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
  let raw = extractBraced(tex, "\\title")
  // Strip leading decorative vspace
  raw = raw.replace(/^\s*\\vspace\*?\{[^}]+\}\s*/g, "")
  // Cut at subtitle markers (vspace mid-title, or \large font switch)
  const subtitleRx = /\\(?:vspace|large|Large|LARGE|huge|Huge)\b/
  const cutIdx = raw.search(subtitleRx)
  if (cutIdx > 0) raw = raw.slice(0, cutIdx)
  return raw
    .replace(/\\textbf\{([^}]+)\}/g, "$1")
    .replace(/\\textit\{([^}]+)\}/g, "$1")
    .replace(/\\emph\{([^}]+)\}/g, "$1")
    // LaTeX accent commands like \^{}K → ^K
    .replace(/\\\^\{([^}]*)\}/g, "^$1")
    .replace(/\\\^(\S)/g, "^$1")
    // Line breaks → space
    .replace(/\\\\/g, " ")
    // Strip remaining commands
    .replace(/\\[a-zA-Z]+\{([^}]*)\}/g, "$1")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/[{}]/g, "")
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
  const raw = extractBraced(tex, "\\date")
  // Strip \today and any remaining LaTeX commands
  return raw
    .replace(/\\today/g, "")
    .replace(/\\[a-zA-Z]+\{[^}]*\}/g, "")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
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

// ── Bib parser ─────────────────────────────────────────────────────────────

function parseBib(bibContent: string): BibEntry[] {
  const entries: BibEntry[] = []
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

// ── getPaper ───────────────────────────────────────────────────────────────

export function getPaper(slug: string): Paper | null {
  const dir = path.join(PAPERS_DIR, slug)
  if (!fs.existsSync(dir)) return null

  const texFile = fs.readdirSync(dir).find((f) => f.endsWith(".tex"))
  if (!texFile) return null

  const tex = fs.readFileSync(path.join(dir, texFile), "utf-8")

  const bodyStart = tex.indexOf("\\begin{document}")
  const bodyEnd = tex.indexOf("\\end{document}")
  const fullBody = tex.slice(
    bodyStart !== -1 ? bodyStart + "\\begin{document}".length : 0,
    bodyEnd !== -1 ? bodyEnd : undefined,
  )

  const body = fullBody
    .replace(/\\maketitle/, "")
    .replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/, "")
    .trim()

  const abstract = parseAbstract(tex)
  const keywords = parseKeywords(tex)

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
