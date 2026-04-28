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
