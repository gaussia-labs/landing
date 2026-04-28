import { Reveal } from "./reveal"
import { SectionLabel } from "./manifesto"

const flow = [
  { id: "A", label: "Scientific paper", sub: "arXiv / DOI" },
  { id: "B", label: "Open discussion", sub: "Review & interpretation" },
  { id: "C", label: "RFC", sub: "Formal specification" },
  { id: "D", label: "Implementations", sub: "Across environments" },
  { id: "E", label: "Validation scripts", sub: "Reproducible checks" },
  { id: "F", label: "Self-hosted usage", sub: "No telemetry" },
] as const

export function HowItWorks() {
  return (
    <section id="flow" className="relative py-28 sm:py-36 px-6 bg-surface">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionLabel index="04" name="How it works" />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10 mb-16">
          <Reveal className="lg:col-span-7">
            <h2 className="font-serif tracking-tightest text-ink text-balance text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.05]">
              One spec. <em>Many implementations.</em>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:pt-3" delay={100}>
            <p className="text-ink-soft leading-relaxed">
              All steps are public, version-controlled, and require no vendor
              approval. Self-hosted usage with zero outbound telemetry.
            </p>
          </Reveal>
        </div>

        <Reveal variant="scale">
          <DesktopFlow />
          <MobileFlow />
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-10 max-w-2xl text-ink-soft leading-relaxed">
            The methodology always precedes the code. A paper becomes a
            conversation, a conversation becomes a formal RFC, and only then
            does it become an implementation — every step in the open, every
            step traceable.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ——————————————————————————————————————————————
   Desktop: inline SVG flowchart with curved edges
   Layout (viewBox 0 0 1000 320):

       A ──→ B ──→ C ──┬──→ D ──┐
                        │        ├──→ F
                        └──→ E ──┘
   —————————————————————————————————————————————— */

const NODES: Record<string, { x: number; y: number; w: number; h: number }> = {
  A: { x: 20, y: 122, w: 150, h: 76 },
  B: { x: 220, y: 122, w: 150, h: 76 },
  C: { x: 420, y: 122, w: 150, h: 76 },
  D: { x: 620, y: 22, w: 160, h: 76 },
  E: { x: 620, y: 222, w: 160, h: 76 },
  F: { x: 840, y: 122, w: 150, h: 76 },
}

const EDGES = [
  { key: "A-B", d: "M 170,160 L 220,160" },
  { key: "B-C", d: "M 370,160 L 420,160" },
  { key: "C-D", d: "M 570,160 C 595,160 595,60 620,60" },
  { key: "C-E", d: "M 570,160 C 595,160 595,260 620,260" },
  { key: "D-F", d: "M 780,60  C 810,60  810,160 840,160" },
  { key: "E-F", d: "M 780,260 C 810,260 810,160 840,160" },
]

function SvgNode({
  nodeId,
  label,
  sub,
}: Readonly<{
  nodeId: string
  label: string
  sub: string
}>) {
  const n = NODES[nodeId]
  const accent = nodeId === "F"
  return (
    <g>
      <rect
        x={n.x}
        y={n.y}
        width={n.w}
        height={n.h}
        rx={10}
        fill={accent ? "var(--terracotta-pale)" : "var(--surface-lowest)"}
        stroke={accent ? "var(--terracotta-soft)" : "var(--hair-strong)"}
        strokeWidth={1}
      />
      <text
        x={n.x + n.w / 2}
        y={n.y + n.h * 0.4}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--ink)"
        style={{
          // fontFamily: "var(--font-instrument-serif), Georgia, serif",
          fontSize: 13.5,
        }}
      >
        {label}
      </text>
      <text
        x={n.x + n.w / 2}
        y={n.y + n.h * 0.68}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--ink-muted)"
        style={{
          fontFamily: "var(--font-inter), system-ui, sans-serif",
          fontSize: 11,
        }}
      >
        {sub}
      </text>
    </g>
  )
}

function DesktopFlow() {
  return (
    <div className="hidden lg:block rounded-2xl bg-surface-sand border border-hair p-8">
      <svg
        viewBox="0 0 1000 320"
        className="w-full"
        aria-label="Flowchart: scientific paper → discussion → RFC → implementations and validation → self-hosted usage"
      >
        <title>How it works flowchart</title>
        <defs>
          <marker
            id="flow-arrow"
            viewBox="0 0 12 12"
            refX={10}
            refY={6}
            markerWidth={8}
            markerHeight={8}
            orient="auto"
          >
            <path
              d="M 2,2 L 10,6 L 2,10"
              fill="none"
              stroke="var(--terracotta)"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        {EDGES.map((e) => (
          <path
            key={e.key}
            d={e.d}
            fill="none"
            stroke="var(--terracotta-soft)"
            strokeWidth={1.5}
            markerEnd="url(#flow-arrow)"
          />
        ))}

        {flow.map((n) => (
          <SvgNode key={n.id} nodeId={n.id} label={n.label} sub={n.sub} />
        ))}
      </svg>
    </div>
  )
}

/* ——————————————————————————————————————————————
   Mobile: vertical HTML/CSS flow
   —————————————————————————————————————————————— */

function MobileFlow() {
  return (
    <div className="lg:hidden flex flex-col items-center rounded-2xl bg-surface-sand border border-hair p-5">
      {flow.slice(0, 3).map((n, i) => (
        <div key={n.id} className="w-full flex flex-col items-center">
          {i > 0 && <Stem />}
          <FlowCard label={n.label} sub={n.sub} />
        </div>
      ))}

      <Stem />

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        <FlowCard label={flow[3].label} sub={flow[3].sub} compact />
        <FlowCard label={flow[4].label} sub={flow[4].sub} compact />
      </div>

      <Stem />

      <FlowCard label={flow[5].label} sub={flow[5].sub} accent />
    </div>
  )
}

function FlowCard({
  label,
  sub,
  accent,
  compact,
}: Readonly<{
  label: string
  sub: string
  accent?: boolean
  compact?: boolean
}>) {
  return (
    <div
      className={`w-full rounded-xl border text-center ${
        compact ? "px-3 py-3" : "max-w-xs px-5 py-4"
      } ${
        accent
          ? "bg-terracotta-pale border-terracotta-soft"
          : "bg-surface-lowest border-hair-strong"
      }`}
    >
      <div
        className={`font-serif text-ink ${compact ? "text-base" : "text-lg"}`}
      >
        {label}
      </div>
      <div className="text-sm text-ink-muted mt-0.5">{sub}</div>
    </div>
  )
}

function Stem() {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-5 bg-terracotta-soft" />
      <svg width="10" height="7" viewBox="0 0 10 7" aria-hidden>
        <path
          d="M 1,1 L 5,6 L 9,1"
          fill="none"
          stroke="var(--terracotta)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
