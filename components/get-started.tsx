"use client"

import { type ReactNode, useState } from "react"
import { Check, Code2, Copy, Terminal } from "lucide-react"
import { Reveal } from "./reveal"
import { SectionLabel } from "./manifesto"

/* ── snippet types ─────────────────────────────────────────── */

type ShellSnippet = {
  id: string
  tab: string
  label: string
  mode: "shell"
  lines: { cmd: string; comment?: string }[]
}

type CodeSnippet = {
  id: string
  tab: string
  label: string
  mode: "code"
  code: string
}

type Snippet = ShellSnippet | CodeSnippet

/* ── data ──────────────────────────────────────────────────── */

const EXAMPLE_CODE = `from gaussia.metrics.toxicity import Toxicity
from gaussia.core.retriever import Retriever
from gaussia.schemas.common import Dataset, Batch

# Define a custom retriever to load your data
class MyRetriever(Retriever):
    def load_dataset(self) -> list[Dataset]:
        return [
            Dataset(
                session_id="session-1",
                assistant_id="my-assistant",
                language="english",
                context="",
                conversation=[
                    Batch(
                        qa_id="q1",
                        query="Tell me about AI safety",
                        assistant="AI safety is important...",
                    )
                ]
            )
        ]

# Run the toxicity metric
results = Toxicity.run(
    MyRetriever,
    group_prototypes={
        "gender": ["women", "men", "female", "male"],
        "race": ["Asian", "African", "European"],
    },
    verbose=True,
)

# Analyze results
for metric in results:
    print(f"DIDT Score: {metric.group_profiling.frequentist.DIDT}")`

const snippets: Snippet[] = [
  {
    id: "example",
    tab: "example.py",
    label: "python",
    mode: "code",
    code: EXAMPLE_CODE,
  },
  {
    id: "install",
    tab: "terminal",
    label: "pip",
    mode: "shell",
    lines: [
      { cmd: 'pip install "gaussia"' },
      { cmd: 'pip install "gaussia[prompt-optimizer]"', comment: "prompt optimisation" },
      { cmd: 'pip install "gaussia[vision]"', comment: "vision metrics" },
    ],
  },
]

/* ── minimal python syntax colouring ───────────────────────── */

const PY_KW = new Set([
  "from", "import", "class", "def", "return", "for", "in", "if",
  "True", "False", "None", "self", "list", "print",
])

const TOKEN_RE =
  /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(->)|\b([a-zA-Z_]\w*)\b|([(){}[\]:,.=*])|(\s+)/g

function highlightLine(line: string, row: number): ReactNode[] {
  if (!line.trim()) return []
  const out: ReactNode[] = []
  let m: RegExpExecArray | null
  let i = 0
  TOKEN_RE.lastIndex = 0
  while ((m = TOKEN_RE.exec(line)) !== null) {
    const [, comment, str, arrow, word, punct, space] = m
    const k = `${row}-${i++}`
    if (comment)
      out.push(<span key={k} className="text-surface/30 italic">{comment}</span>)
    else if (str)
      out.push(<span key={k} className="text-terracotta-pale">{str}</span>)
    else if (arrow)
      out.push(<span key={k} className="text-terracotta-soft">{arrow}</span>)
    else if (word && PY_KW.has(word))
      out.push(<span key={k} className="text-terracotta-soft">{word}</span>)
    else if (word)
      out.push(<span key={k} className="text-surface/85">{word}</span>)
    else if (punct)
      out.push(<span key={k} className="text-surface/40">{punct}</span>)
    else if (space) out.push(space)
  }
  return out
}

/* ── component ─────────────────────────────────────────────── */

export function GetStarted() {
  const [tab, setTab] = useState<string>("example")
  const [copied, setCopied] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const active = snippets.find((s) => s.id === tab) ?? snippets[0]

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      setTimeout(() => setCopied(null), 1200)
    } catch {
      /* ignore */
    }
  }

  const copyAll = async () => {
    try {
      const text =
        active.mode === "code"
          ? active.code
          : active.lines.map((l) => l.cmd).join("\n")
      await navigator.clipboard.writeText(text)
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 1200)
    } catch {
      /* ignore */
    }
  }

  return (
    <section
      id="get-started"
      className="relative py-28 sm:py-36 px-6 bg-surface"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel index="06" name="Get started" />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10 mb-14">
          <Reveal className="lg:col-span-7">
            <h2 className="font-serif tracking-tightest text-ink text-balance text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.05]">
              Install locally. <em>Run anywhere.</em>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:pt-3" delay={100}>
            <p className="text-ink-soft leading-relaxed">
              All SDKs are MIT-licensed, install locally, and run without
              any outbound telemetry.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="relative group">
            <div className="absolute -inset-1.5 rounded-2xl bg-terracotta/8 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative rounded-2xl border border-surface/10 bg-ink overflow-hidden shadow-2xl">
              {/* header bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface/8 bg-ink-soft">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5" aria-hidden="true">
                    <span className="size-3 rounded-full bg-[#ff5f56]" />
                    <span className="size-3 rounded-full bg-[#ffbd2e]" />
                    <span className="size-3 rounded-full bg-[#27ca3f]" />
                  </div>

                  <div className="flex items-center gap-1">
                    {snippets.map((s) => {
                      const isActive = tab === s.id
                      return (
                        <button
                          key={s.id}
                          onClick={() => setTab(s.id)}
                          className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-mono transition-colors ${
                            isActive
                              ? "bg-surface/10 text-surface/90"
                              : "text-surface/40 hover:text-surface/70"
                          }`}
                        >
                          {s.mode === "shell" ? (
                            <Terminal className="size-3" />
                          ) : (
                            <Code2 className="size-3" />
                          )}
                          {s.tab}
                          <span
                            className={`rounded px-1.5 py-px text-[10px] ${
                              isActive
                                ? "bg-terracotta/20 text-terracotta-soft"
                                : "bg-surface/5 text-surface/30"
                            }`}
                          >
                            {s.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button
                  onClick={copyAll}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-surface/50 hover:text-surface hover:bg-surface/10 transition-colors"
                >
                  {copiedAll ? (
                    <>
                      <Check className="size-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* scrollable code body */}
              <div className="max-h-[420px] overflow-y-auto overflow-x-auto scrollbar-dark">
                <div className="p-6 sm:p-8">
                  {active.mode === "shell" ? (
                    <code className="block font-mono text-sm leading-relaxed">
                      {active.lines.map((l, i) => (
                        <div
                          key={i}
                          className="group/line flex items-center gap-4 py-2 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="select-none text-surface/25 text-xs w-5 text-right shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-terracotta-soft select-none">$</span>
                            <span className="text-surface/90 whitespace-nowrap">
                              {l.cmd}
                            </span>
                            {l.comment && (
                              <span className="hidden sm:inline text-surface/30 text-xs">
                                # {l.comment}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => copy(l.cmd)}
                            aria-label={`Copy: ${l.cmd}`}
                            className="shrink-0 ml-auto opacity-0 group-hover/line:opacity-100 transition-opacity inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-surface/40 hover:text-surface/80 hover:bg-surface/10"
                          >
                            {copied === l.cmd ? (
                              <Check className="size-3" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        </div>
                      ))}
                    </code>
                  ) : (
                    <pre className="font-mono text-sm leading-relaxed">
                      <code>
                        {active.code.split("\n").map((line, i) => (
                          <div
                            key={i}
                            className={`group/line flex items-start gap-4 ${
                              line.trim() ? "py-px" : "h-5"
                            }`}
                          >
                            <span className="select-none text-surface/25 text-xs w-5 text-right shrink-0 pt-px">
                              {i + 1}
                            </span>
                            <span className="flex-1 min-w-0 whitespace-pre">
                              {highlightLine(line, i)}
                            </span>
                          </div>
                        ))}
                      </code>
                    </pre>
                  )}
                </div>
              </div>

              {/* footer */}
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-4 border-t border-surface/8">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://docs.gaussia.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-terracotta text-surface px-4 py-2 text-sm hover:bg-terracotta-soft transition-colors"
                  >
                    Get started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
