---
title: "The Back Door Just Got a Deadline"
description: "For three issues this newsletter described an architectural gap. Now BCBS 239, DORA, and the EU AI Act have turned governing what AI agents read from unstructured documents into a regulatory deadline for banks."
publishDate: 2026-04-25
tags: ["governance", "regulation", "ai", "banking", "compliance"]
series: "Agnostic Data"
draft: false
canonicalURL: "https://www.linkedin.com/pulse/back-door-just-got-deadline-vakamo-com-ykmue/"
---

*For three issues I have been writing about an architectural gap. Banks just got the bill.*

At 09:14 on a Tuesday morning, an AI agent at a major European bank reads a 200-page legal contract with one of its trading partners. The agent finds the clauses that say what happens if the partner defaults. It pulls out the rules for which assets count as collateral. It checks the limits and the thresholds. Six minutes later, a risk number updates. The number lands in the Iceberg table that feeds the bank's capital report. Six months later, a supervisor asks which version of the contract the agent read.

Nobody knows.

The Iceberg table next to it could answer that question in milliseconds — schema, version, snapshot, timestamp, query identity. The PDF the agent actually read has a filename and an S3 path. That is the entire metadata.

For three issues, I have been describing this gap. The Probabilistic Layer the agent reads from. The Back Door the agent walks through. The Inference Commit that does not yet exist. For most industries, the gap is still abstract — a slow-moving architectural problem.

For banks, the deadline has arrived.

## Three frameworks just discovered the Probabilistic Layer

BCBS 239 — fifteen years old, and the Bank for International Settlements (BIS) most recent progress report finds full compliance still rare across the world's biggest banks — requires risk data to be accurate, complete, and aggregatable.

DORA — enforceable across the EU since January 2025 — requires every ICT process to be documented, traceable, and controllable end-to-end. Supervisors are reading "ICT process" to include AI agent workflows.

The EU AI Act phases in for high-risk systems from August 2026. Banks using AI to make credit decisions are explicitly in scope. Internal risk and capital agents are likely to follow.

Three frameworks. One gap. The first time a regulator asks a bank to explain how a capital number was produced — when an agent reading an unstructured document was part of the chain — the answer "we have access logs at the storage layer" will not be sufficient. It will not be close.

The other defence banks will reach for the human in the loop. A senior analyst reviewed the agent's output, so the process is governed. That argument does not survive contact with DORA. If the analyst signed off on the wrong version of the contract, or on a confident-sounding hallucination, the ICT process is still broken — and DORA asks about the process, not the signature.

Banks are not behind on this because their architecture is worse than other industries. They are ahead of the deadline because their industry has supervisors who can hand out fines.

## The deadline changes the argument

In the April issue I described what a working bridge would look like — the Context Envelope, the Semantic Map, the Inference Commit. The Inference Commit is the one that answers the supervisor's question: a versioned record of which document the agent read, under which credential, with what result. I argued the unstructured side has to be community-owned, the same way Iceberg is community-owned for the structured side.

The argument has not changed. The urgency has.

Until the first regulator asks a bank to reconstruct an agent's read, "open standards for the Probabilistic Layer" is a thoughtful long-term position. After the first regulator asks, it becomes a procurement requirement — and the only question is whether the bank can satisfy it with infrastructure it controls, or whether the answer gets chosen for them.

Iceberg solved the structured-storage problem because the community decided not to leave it proprietary. The structured-storage problem was urgent for analytics teams. The unstructured-governance problem is now urgent for compliance teams — and compliance teams move when supervisors tell them to.

That is what changed.

## Banks are the canary

Hospitals are next. Then insurers. Then pharma. Then anyone whose AI decisions land in a regulated artifact. The Probabilistic Layer is everyone's problem. Banks just got the invoice first.

If the community moves now, the answer the bank gives its supervisor in 2027 is built on infrastructure the bank can read, fork, audit, and replace.

We have done this before. We have to do it again, faster.
