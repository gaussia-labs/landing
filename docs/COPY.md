# Gaussia Landing — Copy Reference

Exact strings for every section of the page. Do not paraphrase. Do not invent variants. If a string needs to change, get the new text from the user and update this file.

Italic emphasis within headlines is marked with *asterisks*. In code it maps to:
- Light sections: `<em className="italic text-terracotta">`
- Dark (ink) sections: `<em className="italic text-terracotta-soft">`

---

## Nav (`components/site-nav.tsx`)

**Wordmark:** Gaussia (font-sans font-medium — not serif)

**Nav links:** Manifesto · How it works · Modules · Contribute

**CTA button:** Get started

---

## Hero (`components/hero.tsx`) — `bg-surface`

**Eyebrow:** `Open source · paper-first · community-maintained`

**Headline:** `Metrics grounded in *science*, built by the community.`

**Body:**
> Open-source metrics that are paper-backed, reproducible, and language-agnostic. Evaluate, protect, and improve AI behaviour with open, auditable tools.

**Stats:**
- License: MIT
- Lock-in: Zero

**CTAs:** `Get started` (primary) · `Propose a new paper` (secondary)

---

## Manifesto (`components/manifesto.tsx`) — `bg-surface-sand`

**Section label:** 01 / Manifesto

**Headline:** `From metrics to *evidence-backed* evaluation.`

**Pull-quote:**
> "An evaluation metric is only as useful as the evidence behind it."

**Body paragraph 1:**
> Many AI teams work with dashboards full of scores (faithfulness 0.87, toxicity 0.03, bias 0.12) without enough context to understand what those numbers truly represent or how much confidence they deserve.

**Body paragraph 2:**
> Gaussia was built to help close that gap. By requiring every metric to be grounded in verifiable scientific evidence, it turns evaluation outputs into claims that are clearer, more reproducible, and more trustworthy.

**Principles:**

| # | Title | Body |
| --- | --- | --- |
| 01 | Scientific grounding | The metric's definition, assumptions, and validation basis are directly connected to published research. |
| 02 | Reproducibility | Every score can be independently verified, reproduced, and confidently cited in your own work. |
| 03 | Decision confidence | See the methodological strength behind every number instead of trusting a polished dashboard. |

---

## Why Gaussia (`components/why-gaussia.tsx`) — `bg-surface`

**Section label:** 02 / Why Gaussia ?

**Headline:** `The four gaps *we close*.`

**Body:**
> Today's evaluation landscape is fragmented, opaque, and language-specific. Gaussia fills four structural gaps.

**Gap cards:**

| # | Title | The ecosystem today | How Gaussia solves it |
| --- | --- | --- | --- |
| 01 | Fragmented tooling | Quality, safety, and ethics live in separate libraries with incompatible conventions. | A single, extensible library that houses all three concerns under one scientific contract. |
| 02 | Absence of scientific traceability | Scores are just numbers; the originating paper, methodology, and validation data are rarely exposed. | Every metric ships with the paper title, authors, year, DOI/arXiv link, and a ready-to-cite BibTeX entry. |
| 03 | Lock-in to a single language | Metric logic is tied to a specific runtime or stack, making it hard to apply consistently across environments. | The metric definition lives in the scientific source; implementations follow the same spec across languages. |
| 04 | Wrong unit of analysis | Evaluation assumes the target is an "AI system" rather than the observable behaviour. | Gaussia's modules evaluate any behaviour — model output, human response, or hybrid interaction — by the same criteria. |

---

## Contract (`components/contract.tsx`) — `bg-surface-clay`

**Section label:** 03 / The Gaussia Contract

**Headline:** `Paper-first. *Community-first.*`

**Body:**
> Every metric in Gaussia is provably linked to a peer-reviewed source. The link is immutable and visible to every user.

**Steps:**

| # | Title | Body | Tags |
| --- | --- | --- | --- |
| 01 | Paper proposal | Anyone opens a Discussion in the Proposals category, cites the peer-reviewed work, and explains the problem the metric solves. | Discussion · DOI / arXiv · Motivation |
| 02 | Community debate | Reviewers examine the proposal publicly — the debate is visible, dissent is recorded, decisions are traceable. | Novelty · Soundness · Clarity · Feasibility |
| 03 | Implementation | Any language can implement from the paper. The code must include a metadata block mapping the implementation to the methodology. | Python · TypeScript · Rust · Go · C++ |
| 04 | Merge & credit | After two reviewer approvals the PR is merged. The paper joins the official framework and authors are credited in the code and citation list. | PR merged · Authors credited · Immutable link |

---

## How it works (`components/how-it-works.tsx`) — `bg-surface`

**Section label:** 04 / How it works

**Headline:** `One spec. *Many implementations.*`

**Body:**
> A scientific paper seeds a public discussion, which crystallises into a formal RFC. Independent implementations follow the spec across languages. Validation scripts confirm reproducibility. Everything self-hosted, no telemetry.

**Flow nodes (id / label / sub-label):**

| ID | Label | Sub-label |
| --- | --- | --- |
| A | Scientific paper | arXiv / DOI |
| B | Open discussion | Review & interpretation |
| C | RFC | Formal specification |
| D | Implementations | Across environments |
| E | Validation scripts | Reproducible checks |
| F | Self-hosted usage | No telemetry |

Flow: A → B → C → { D, E } → F

---

## Modules (`components/modules.tsx`) — `bg-surface-mist`

**Section label:** 05 / Modules at a glance

**Headline:** `Three modules. *One scientific contract.*`

**Body:**
> Each module answers a different question about AI behaviour, backed by peer-reviewed methodology.

**Module cards:**

### 01 — Evaluate
**Question:** How good is the output?

| Metric | Citation |
| --- | --- |
| Context & Faithfulness in RAG | Es et al., EACL 2024 |
| Conversational quality (Grice's maxims) | Grice, 1975 |
| Agentic pass@K | Ruan et al., 2024 |

### 02 — Protect
**Question:** Is it safe and fair?

| Metric | Citation |
| --- | --- |
| Toxicity via DIDT | Gehman et al., 2020 |
| Bias · Granite Guardian & LLaMA Guard | Liang et al., 2021 |
| Regulatory compliance via NLI | Markov et al., 2023 |

### 03 — Improve
**Question:** How can I make it better?

| Metric | Citation |
| --- | --- |
| Prompt optimisation · GEPA, MIPROv2 | Zhou et al., 2023 |
| Explainability — Integrated Gradients · SHAP · LIME | — |
| Synthetic data generation | Reynolds & McDonell, 2021 |

---

## Get started (`components/get-started.tsx`) — `bg-surface`

**Section label:** 06 / Get started

**Headline:** `Install locally. *Run anywhere.*`

**Body:**
> MIT-licensed, self-hosted, no outbound telemetry. Runs wherever your stack runs.

**Install commands:**

Python (stable):
```bash
pip install "gaussia"
pip install "gaussia[prompt-optimizer]"   # prompt optimisation
pip install "gaussia[vision]"             # vision metrics
```

TypeScript (beta):
```bash
npm i @gaussia/sdk
```

**CTA:** `Get started →` (links to docs.gaussia.ai)

---

## Contribute (`components/contribute.tsx`) — `bg-ink`

**Section label:** 07 / Contribute

**Headline:** `A quick guide to *shaping the library.*`
(italic in `text-terracotta-soft`, not `text-terracotta`)

**Body:**
> All contributions stay under the MIT licence. Reviewers receive permanent citation credit.

**Steps:**

| # | Title | Body |
| --- | --- | --- |
| 01 | Propose your idea | Open a Discussion in Proposals. Include the paper citation, problem statement, and target SDKs. |
| 02 | Write the paper | Fork the repo, copy template/ to papers/YYYY-MM-your-title/, write in LaTeX, add figures and references.bib. |
| 03 | Open a PR | Target main, fill the PR template, link the original discussion, and ensure the paper compiles. |
| 04 | Community review | At least two reviewers approve on novelty, soundness, clarity, and feasibility. |
| 05 | Merge & implement | An implementation issue opens in the relevant SDK repo; authors are credited in code and citation list. |

**CTAs:**
- `Read the full contribution guide` + ArrowRight icon (primary)
- `Start a proposal` (secondary ghost)

---

## Footer (`components/site-footer.tsx`) — `bg-surface-sand`

**Wordmark:** Gaussia (font-sans font-medium — not serif)

**Footer columns:**

| Column | Links |
| --- | --- |
| Product | Docs · Modules |
| Community | GitHub · Contribute · Proposals |
| Project | Manifesto · The Contract |

**Copyright line:**
`Crafted by [Alquimia logo] © {year} Gaussia · community-maintained, open source`
