---
title: "The Two Universes Inside Your Data Lake"
description: "Data lakes were built for facts. AI runs on meaning. The deterministic layer we spent a decade governing and the ungoverned probabilistic layer where decisions actually get made are two universes — and nothing connects them."
publishDate: 2026-03-20
tags: ["ai", "governance", "data-architecture", "lakehouse", "unstructured-data"]
series: "Agnostic Data"
draft: false
canonicalURL: "https://www.linkedin.com/pulse/two-universes-inside-your-data-lake-vakamo-com-2j3re"
---

*From Deterministic to Probabilistic Data*

Data lakes were built for facts. AI runs on meaning. We never built the system that connects the two.

There are two kinds of truth in your data lake. The one your data team spent a decade governing — and the Excel file the CFO emailed last Tuesday that actually decided the outcome.

One is clean. Auditable. Governed. It lives in rows and columns, has a schema, an owner, a contract. You can put it in front of a regulator and sleep at night.

The other is messy. Contextual. Approximate. It lives in PDFs, Slack threads, call recordings, and 50GB model outputs nobody named. It has no owner, no lineage, and no definition of "correct." And yet — it's where every real decision actually gets made.

We call the first one the Deterministic layer — because the answer is always exact, reproducible, and verifiable. The second one is the Probabilistic layer — because when an AI agent reads a PDF, it doesn't return a fact. It returns a best guess, shaped by context, weighted by similarity, confident-sounding but never certain. The layer itself is probabilistic because that's the only honest way to describe what happens when meaning, not value, is the unit of computation.

Most data teams have spent a decade perfecting the Deterministic side. The Iceberg table. The dbt model. The certified dashboard. The single source of truth. Meanwhile the CFO's Excel file lived in an email thread, the legal team's contracts sat in an unnamed S3 folder, and the board deck that shaped the company's strategy for the next three years was a PDF nobody cataloged.

The Probabilistic layer was left behind — not just unconnected, but entirely ungoverned. Nobody built the bridge. And nobody bothered to build the house on that side of the river either.

This wasn't a problem when humans were asking the questions. But AI doesn't ask for structured data. It consumes whatever exists. That makes the Probabilistic layer the default interface — whether you designed for it or not. There is no going back.

## Why the divide exists in the first place

The Deterministic world was built for humans asking structured questions: "What was revenue in Q3?" The answer is either right or wrong. Access policies, row-level security, column masking — all of it assumes you know what the data is, where it lives, and who should see it.

The Probabilistic world doesn't work like that. A contract PDF doesn't have a schema. An earnings call transcript doesn't have a primary key. A 200-page regulatory filing doesn't fit in a SQL WHERE clause. These objects carry meaning, not values. And meaning is, by nature, approximate.

The technical consequence: everything we built to govern the Deterministic layer breaks when you point it at the Probabilistic one.

Object storage access control inherited its logic from Unix permissions — a model designed in the 1970s for single-user filesystems, not distributed multi-tenant data lakes serving AI agents at scale. Half a century later, most platforms are still treating a confidential legal brief and a public marketing deck as identical objects. Both are just paths. The Iceberg table next door has column-level encryption, a full audit trail, and a data contract. The PDF has a filename.

But the governance gap is only half the problem. The deeper issue is that we don't even know what's inside the Probabilistic layer. An Iceberg table is self-describing — schema, partitions, history, all queryable. A PDF is opaque. An image is silent. A folder of contracts in object storage has no catalog entry, no classification, no indication of what it contains, who it concerns, or why it matters.

Before you can govern it, you have to discover it. Most organizations today cannot do either. We built systems that know what data is. We never built systems that know what data means.

## The diagram nobody drew

Look at your data architecture. Draw a horizontal line through the middle.

Above the line: high integrity, low ambiguity. OLTP, OLAP, Iceberg, dbt. The truth layer. Deterministic.

Below the line: high value, high ambiguity. Embeddings, vector stores, raw unstructured files, model inputs, model outputs. The insight layer. Probabilistic.

Now ask yourself: where do your AI agents actually operate?

Below the line. LLMs don't read SQL tables — they read the Probabilistic layer. They ingest the PDF, the transcript, the email thread. They synthesize the ambiguous and return a confident-sounding answer.

But here's the structural problem, stated plainly:

- Deterministic without Probabilistic → no insight. Your governed data answers last quarter's questions.
- Probabilistic without Deterministic → no accountability. Your AI operates without a ground truth to report to.
- AI needs both → which means the current architecture isn't just incomplete. It's broken.

Today, the agent operates in one universe. The audit lives in another. Nothing connects them.

An AI agent reads a contract PDF and approves a discount. Which version of the contract? Authorized by whom? Was the agent permitted to read that file? What entities did it touch? Where is that decision logged?

Right now, none of those questions have answers. The action happened in the Probabilistic layer. The accountability infrastructure exists only in the Deterministic one. And nothing connects them.

Most companies are already making decisions through systems they cannot audit. That isn't a future risk. It's a present violation.

## What a bridge actually looks like

The gap isn't philosophical. It's architectural. And the first thing to understand is that governance is no longer just a storage-time problem — it's an inference-time problem.

When an AI agent reads a file, that is an access event. It needs to be governed with the same rigor as a query against a sensitive database table. That means the Probabilistic layer needs infrastructure that doesn't exist yet.

Concretely, a PDF in a governed lake needs:

- An owner — a human or team accountable for its contents
- A sensitivity classification — enforced, not just labeled
- A link to entities — which customers, deals, contracts, or systems does it concern
- A queryable representation — embeddings, chunks, structured metadata — so it can be reasoned about, not just stored
- Access enforced at inference time — not just when the file is uploaded, but every time an agent touches it

That last point is the one the industry hasn't caught up to yet. Managed Volumes and Vended Credentials are early signals of this shift — moving from storage access to controlled, contextual access. But they're still early. The full picture — classification, entity linking, inference-time enforcement — is largely unbuilt.

And before any of that is possible, there's a more fundamental problem: Context. You cannot govern what you cannot see. What is this file? What's inside it? Who does it concern? Is it sensitive? Does it relate to anything in the Deterministic layer? Today this is either a manual process, a tagging convention, or it simply doesn't happen. Until you can answer "what is in my Probabilistic layer," everything else is theoretical.

## The real reason this matters right now

AI agents are not a future problem. They are running today — delegating tasks, impersonating users, operating with over-broad permissions because nobody scoped them correctly. They thrive in the Probabilistic layer precisely because the Probabilistic layer has no guardrails.

The answer isn't better AI. It's better scaffolding.

The Deterministic layer only holds its value if the Probabilistic layer is connected to it with the same rigor. Right now those two universes sit side by side in every enterprise data lake on the planet, with a gap between them that no tool, no policy, and no org chart is formally responsible for closing.

That gap is where the risk lives. It's also where the opportunity is.

## Next issue: The Four Pillars

The Deterministic storage problem is largely solved. Iceberg gave the whole industry an open standard — not a vendor product, not a proprietary format, but a community-owned specification that Snowflake, Databricks, and everyone else had to interoperate with. That's what made it work.

Now both Snowflake and Databricks are racing to own the Semantic layer — Snowflake with its OSI initiative, Databricks with Metric Views. Both are pointing at the same real problem: business logic needs to be interoperable, not just data. A metric should mean the same thing whether an analyst, an application, or an AI agent is asking for it. But an initiative is not a standard. A vendor roadmap is not a specification. We've seen this movie before — and the version with a good ending always starts with the open source community, not a product announcement.

The same applies, more urgently, to the Probabilistic layer. There is no Iceberg equivalent for unstructured data. No open specification for how a file should be cataloged, classified, contracted, or versioned. No shared format for what "governed" means when the object has no schema.

Iceberg standardized how data is stored. What's missing is a standard for how meaning is described, governed, and accessed.

That's not a gap a single vendor will close, because no single vendor has the incentive to give it away. It requires the same thing Iceberg required: a community that decides the problem is too important to leave proprietary.

Governance, Lineage, Context, and Semantic are not features. They are infrastructure layers — the same class of problem Iceberg solved for the Deterministic side. Next issue we go layer by layer: what's being built, what's still missing, and what it would actually take to standardize them in the open.

The community did it once for data. It now has to do it for meaning.
