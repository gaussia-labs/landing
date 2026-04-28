---
title: "Gaussia: when a number stops being an opinion"
tags:
  - ai
  - evaluation
  - gaussia
  - divulgation
status: draft
created: 2026-04-20
---

# Gaussia: when a number stops being an opinion

> [!quote]
> *If you can't trace it to a paper, it's not a metric. It's an opinion.*
> gaussia.ai

## The problem no one wants to admit

Ask any team shipping an AI product how they know their system is good and you'll usually get a screenshot: faithfulness 0.87, toxicity 0.03, bias score 0.12, a row of comfortable green numbers on a comfortable dark dashboard. Ask *why* 0.87 is a good faithfulness score and not a 0.91 or a 0.73, and the conversation gets awkward fast. Someone will say it's what they've been tracking, someone else will mention the framework that computes it, and almost nobody will be able to point to the thing that should be sitting underneath that number: a paper, a methodology, a validated dataset. That gap is less a technical problem than an epistemological one, and it's the gap [Gaussia](https://www.gaussia.ai/) was built to close.

There is a thriving ecosystem of tools for evaluating AI systems today, dozens of frameworks, platforms and libraries, and most of them work in the narrow sense that matters to engineering: the programs run, they return values between 0 and 1, and those values move in reasonable ways when the inputs change. What almost none of them can answer is the more basic question underneath, **where does this number come from?** An engineering shortcut is something that works until it doesn't, and when it breaks you can't explain why, whereas a scientific claim comes with a source, a methodology, known validity limits and a path for validation that anyone can reproduce, cite or challenge. Evaluating intelligent behaviors with metrics that nobody can trace, cite or reproduce is exactly the kind of magical thinking those same systems taught us to avoid.

## What Gaussia is

Gaussia is an open source library of scientific metrics for evaluating intelligent behaviors, and each word there is deliberate:

- **Library**. The whole project ships as code you import: MIT licensed, with no SaaS, no dashboard, no telemetry, no lock in. It is infrastructure for others to build products on top of.
- **Scientific metrics**. Every metric traces back to a paper that defines its methodology, its assumptions, its validity limits and the datasets that validated it. Where there is no paper, there is no metric.
- **Intelligent behaviors**. The unit of analysis is the behavior itself, whatever produced it. A voice agent in a call center, a human operator handling support chats, a hybrid system where both share the conversation: all of them can be evaluated under the same criteria, because what matters is the response, not the architecture behind it.

## The paper first contract

The founding principle of Gaussia fits in one sentence: **no metric exists without verifiable scientific backing**. That sounds obvious, and in practice almost no evaluation framework honors it. When a tool gives you a toxicity score of 0.4, there is usually no way to answer the questions that would actually let you defend it, which paper defines what that 0.4 means, which dataset validated it against human judgment, what assumptions the methodology makes, where its limits lie. The score looks authoritative without actually being so.

Gaussia inverts the process. Before writing a single line of code, someone has to draft a document that explains what the metric measures, which paper grounds it, which formula it implements, and why *that* formula and not another. Coding starts only once that document has been debated and accepted, and any PR that tries to sneak in a metric without a traceable scientific source simply does not get merged, because the contribution process itself enforces the standard.

Every metric in the library carries its lineage with it:

- The title of the paper that defines it, with authors, year and venue
- The arXiv identifier or DOI for direct access
- A note explaining how the code maps to the methodology in the paper
- The datasets used by the original authors to validate the metric, and how to rerun that validation locally
- A BibTeX entry ready to cite in research

That lineage changes who you are trusting when you trust the score. Today, when a team hands a faithfulness number to a client, the client has to trust the reputation of the team that built the tool, and that kind of trust does not scale, does not survive turnover, and does not survive the scrutiny of a regulator, a hospital compliance officer, or a credit risk committee. With a paper behind every metric, that trust transfers from a single team to the scientific community that validated the methodology, which is auditable in a way personal reputation never can be.

In regulated industries the question is no longer "what does your dashboard say?", but "what methodology defines that your system is fair?", and Gaussia exists so that question has an answer that anyone can read, cite, and contest.

Forcing paper first has a second, quieter effect: it improves the design itself, because the questions that engineering used to wave away ("why this formula and not another?", "what are the failure modes?", "does this generalize outside the original dataset?") have to be answered up front, and the resulting metric usually ends up stronger for it, traceable and well designed at the same time.

## Community first, by design

Paper first answers *what* gets into the library, and community governance answers *who decides*. A library maintained exclusively by one company will always, eventually, reflect that company's use cases, blind spots and incentives, even with the best intentions, because the metrics a team builds are shaped by the problems of its own clients, and what is an advantage for internal work becomes a fatal limitation for a library that wants to be a credible scientific tool.

That is why Gaussia lives *outside* any single company's org, as a community project that a company happens to help maintain rather than an internal tool with a community tacked on around it. The distinction matters more than it sounds, because it determines who the library ultimately answers to when priorities collide.

The flow for incorporating a new metric has three stages, and the entry barrier at each one is deliberately scientific:

1. **Paper proposal**. Anyone can open an issue with an academic reference. You don't start with code, you start with literature. The barrier to entry is a paper, not a PR.
2. **Methodology discussion**. Open debate about the assumptions the paper makes, how the methodology should map to an implementation, and what the limits of validity are. Disagreements get recorded, not resolved privately.
3. **RFC and implementation**. Only once there is consensus on the interpretation does an RFC for implementation get opened, and code gets written.

This gives Gaussia something no commercial evaluation tool can easily replicate: **its metrics are audited publicly before they exist**, with the debate visible, the dissent recorded, and every implementation traceable back to documented decisions.

The same logic extends to how Gaussia handles implementations across languages. Most evaluation frameworks are inseparable from their code, to the point that the metric effectively *is* the Python package that computes it, and anyone who wants to use it elsewhere has to reimplement it and hope they got the details right. Gaussia flips that relationship by making the source of truth for every metric the paper and the specification derived from it, so that implementations in Python, TypeScript, Rust, Go, C++, or whatever a community chooses, are all SDKs that materialize the same spec, none of them privileged as "the original", all of them first class implementations of the same science and validated against the same datasets from the same papers.

Gaussia does not prescribe which languages should have implementations: if a community needs evaluation in the browser it builds a JavaScript SDK, if someone needs evaluation on embedded hardware they build one in C, and what Gaussia certifies is **fidelity to the science**, not exclusivity of a runtime. That is the kind of decision only a community project can make, because a vendor selling a Python platform has every incentive to keep you on Python.

## The four gaps Gaussia fills

Zooming out, the current evaluation ecosystem has four problems that no single tool solves on its own, and all four point back to the same two pillars: paper first and community first.

**Fragmentation.** Quality, safety and ethics live in separate worlds, and to comprehensively evaluate a system today a team has to combine multiple frameworks with incompatible conventions, none of them designed to talk to each other. A community project governed by a single scientific contract can bring them under one roof in a way no individual vendor has the incentives to.

**Absence of scientific traceability.** There is no framework where *every* metric is backed by a peer reviewed paper defining the methodology, the assumptions, the validity limits and the validation datasets, which leaves most scores as numbers without traceable origin. This is the deepest gap, and the one paper first exists to close.

**Lock in to a single language.** The entire evaluation ecosystem is written in Python, and each framework couples the definition of the metric with its implementation, so the evaluation ends up chained to a package rather than to the science behind it. Inference has moved to the edge, to browsers, to embedded devices, but evaluation did not move with it, because it was never allowed to.

**The wrong unit of analysis.** Current methodologies assume that what gets evaluated is always an AI system, and that assumption is too narrow, because what actually gets evaluated is a behavior, and a behavior can come from a language model, a human, or a hybrid.

## What you can evaluate with Gaussia

The library is organized into three modules, each answering a different question. The three categories are fixed, the contents inside them are deliberately not. What follows is a snapshot of what lives in each module today, and every new metric the community proposes will settle into one of the three as it goes through the paper first process.

### Evaluate: how good is it?

Current metrics include:

- **Context and faithfulness** in RAG systems, following the methodology by Es et al. (EACL 2024).
- **Conversational quality** across seven dimensions derived from Grice's maxims (1975): quality, quantity, relation, manner, plus conversational memory, sensibleness and language adequacy.
- **Agentic evaluation**: `pass@K` and `pass^K` for decision sequences, tool selection and tool use 
- **Emotional resonance** using the NRC lexicon, useful for customer support, therapeutic assistance, any domain where empathy matters.
- **King of the hill**: direct pairwise tournaments between systems.

### Protect: is it safe and fair?

Current metrics include:

- **Toxicity via DIDT** (Demographic Informed Distribution Testing): it measures average toxicity together with its disparity across demographic groups detected with HDBSCAN and UMAP.
- **Bias** via guardian models such as IBM Granite Guardian and LLaMA Guard, with scores calibrated through logprobs.
- **Regulatory compliance**: detects contradictions between system responses and a regulatory corpus using Natural Language Inference, with traceability to the specific fragment.
- **Red teaming** as a future direction: prompt injection, jailbreaks, OWASP LLM Top 10.

### Improve: how do I make it better?

Current tools include:

- **Prompt optimization** with GEPA and MIPROv2 (Opsahl Ong et al., 2024).
- **Explainability** with Integrated Gradients, SmoothGrad, LIME, KernelSHAP.
- **Synthetic data generation** for evaluating domain specific systems without relying on generic datasets.

Every one of these capabilities is grounded in a specific paper, proposed publicly, debated openly, and implemented only after consensus. As the community brings new metrics through that same process, the library grows inside the same three buckets, with Evaluate, Protect and Improve acting as the stable scaffolding underneath a moving set of contents.

## Why now

Three pressures converge at the same time.

**Regulation.** The EU AI Act is in force, and NIST AI RMF has become a mandatory reference in US government procurement, so the questions starting to surface in healthcare, finance and education ("what methodology defines that your system is fair?", "what paper validates your hallucination detector?") cannot be answered with a dashboard anymore.

**Reproducibility crisis.** An ICSE 2025 study (Widyasari et al.) found that half of the research artifacts with ACM reproducibility badges failed to meet their own requirements a year later, which is systemic enough that a library tolerating metrics without scientific sourcing would be accumulating the worst kind of technical debt, numbers that feel authoritative without actually being so.

**Infrastructure migration.** Inference has moved to the edge, to browsers, to mobile devices, and evaluation cannot stay chained to monolithic implementations in a single language, so only an ecosystem where the science is separated from the implementation, and where any community can build the SDK it needs, can scale alongside that migration.

## The long term vision: the auditor model

The natural destination of Gaussia, if the community validates it, is a model of its own: trained *from scratch* specifically for auditing intelligent behaviors, rather than adapted from a general purpose LLM after the fact. A model like that would have three traits no current alternative can match:

- **Fully public dataset**, annotations included.
- **Transparent training process**: architecture, hyperparameters, loss curves, known biases, benchmarks against the papers that inspired each metric.
- **Sectoral finetuning**: on top of the public base model, sectors can build specialized versions, a medical auditor, a legal one, a code one.

Its role is to make human judgment more scalable, more consistent and more traceable, while leaving the final call where it belongs.

> [!warning] Honesty about what we don't know
> The auditor model requires substantial investment and isn't an area of deep prior experience for the team. Multi language adoption depends on communities willing to build SDKs. Community governance is easy to propose and hard to execute. Naming these uncertainties does not weaken the proposal, it strengthens it. A project that cannot admit what it does not know is exactly the kind of project Gaussia promises not to be.

## Closing

The evaluation ecosystem for intelligent behaviors is active and growing, but no existing tool asks the question that should be the starting point, **where does this number come from?**. Gaussia starts there, with every metric carrying verifiable scientific backing, every backing having been discussed and accepted by a community that anyone can join, and every implementation validatable against the same datasets in any language someone chooses to build it in.

If we're going to trust AI for decisions that matter (diagnoses, credit, sentencing, admissions), we first have to trust how we evaluate it, and trust of that kind, if it is going to survive the next decade, cannot live inside a single company's repo. Gaussia is the library where, when you use a metric, you can explain exactly why it means what it says, and so can anyone else.
