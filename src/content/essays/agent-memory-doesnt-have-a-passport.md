---
title: "Agent Memory Doesn't Have a Passport"
description: Every coding agent on your laptop now keeps a memory folder. Every enterprise memory vendor now has real security controls. Neither fact solves the actual problem, which is that none of it travels.
publishDate: 2026-08-10
tags: ["ai-agents", "data-governance", "agent-memory", "mcp", "data-architecture"]
series: "Agnostic Data"
draft: true
---

I wrote a few months ago that a clearinghouse for AI agents has to hold four things: memory, context, execution, and governance. Of the four, memory is the one I keep coming back to, because it is the only one that is already happening, quietly, on every developer laptop in your organization, in a format nobody governs.

Open two different coding agents on the same machine, pointed at the same repository, working for the same person, and you get two memory systems that have never heard of each other.

## Two Folders, No Handshake

Claude Code keeps a memory folder per project — `~/.claude/projects/<repo>/memory/` — with a `MEMORY.md` index that is always loaded into context and a set of topic files underneath it, written synchronously, mid-session, the moment the agent decides something is worth remembering. It is documented, in the agent's own operating instructions, as a place to record who the user is, what they've corrected before, and what's true about the project that isn't obvious from the code.

Codex, on the same laptop, does something structurally different. It writes raw session material into `~/.codex/memories/`, then runs a background consolidation pass after a thread has sat idle for a few hours, merging the last month or so of rollouts into its own `MEMORY.md` and a `memory_summary.md` that gets injected into future sessions. The working directory is git-committed, so there's at least a diffable baseline — a property Claude Code's memory folder doesn't share.

Both are reasonable engineering decisions. Neither product had any reason to coordinate with the other. And that's exactly the point: two agents, one employee, one machine, and the memory each one accumulates about your codebase, your incident history, your internal conventions, sits in two unrelated directories that will never be reconciled, never be searched together, and never be deleted together.

Multiply by however many engineers use more than one agent — which, in 2026, is most of them — and you have a filing system nobody designed, growing on every laptop in the company.

## The Protocol Has No Opinion

You might expect Model Context Protocol, the thing that's supposed to standardize how agents reach tools and context, to have settled this. It hasn't. MCP specifies tools, resources, prompts, and transports. It says nothing about memory as a primitive.

Into that gap fell a reference implementation, `@modelcontextprotocol/server-memory`, that a large fraction of the ecosystem treats as the de facto standard simply because Anthropic shipped it as an example. Go and read the source. `loadGraph()` reads the entire file on every single call — `fs.readFile(this.memoryFilePath, "utf-8")` — parses it into entities, relations, and observations, and hands the whole graph back. `saveGraph()` writes the whole thing back out with a plain `fs.writeFile`. There is no locking. Two concurrent writes and the second one wins outright; the first is gone, silently.

That's not a criticism of the code — it was written as a demo, not a product. It's a criticism of what happened next, which is that a huge number of real MCP memory servers still work exactly this way, because "a JSONL file with no concurrency control" is what the convention became in the absence of a spec. A protocol with no opinion on memory got one anyway, by accident, and the accident doesn't scale past a single user on a single machine.

## Governance Exists. It Just Doesn't Travel.

Here I want to be careful, because it would be easy and wrong to claim enterprise memory tooling is ungoverned. It isn't. It's siloed, which is a different and more interesting problem.

AWS Bedrock AgentCore Memory encrypts everything at rest and lets you supply your own KMS key via `encryptionKeyArn`; disable that key and the memory becomes cryptographically inaccessible, which AWS explicitly frames as a mechanism for GDPR and CCPA right-to-erasure. Zep is SOC 2 Type II and HIPAA certified, offers bring-your-own-cloud deployment, and has a real legal-hold feature that blocks deletion when compliance needs it to. Mem0 is SOC 2 Type I certified with Type II underway, and ships bring-your-own-key encryption and zero-trust access controls. Databricks went furthest: a memory store is now a first-class Unity Catalog securable, requiring a `CREATE MEMORY STORE` privilege on the parent schema, inheriting the same access control and lineage as any table.

Each of these can answer, truthfully, "is this encrypted, can we delete it, who is allowed to read it" — inside its own walls. None of them can answer that question about the other three. There is no shared identity model, no shared retention policy, and no shared deletion hook across a Bedrock memory, a Zep memory, a Mem0 memory, and a Claude Code memory folder that all happen to hold derived knowledge about the same customer or the same production incident. Governance grew up, correctly, per vendor. It just stops exactly at the vendor's boundary, the same way a passport is real and enforceable and only good within the country that issued it.

## The Query Nobody Can Run

The practical failure mode isn't exotic. It's an engineer who used three agent tools over two years, changes teams, and leaves behind memory artifacts on a laptop, in a SaaS memory store, and inside whatever the team's MCP server accumulated — none of which is discoverable by the security team, none of which is wired into offboarding, and none of which shows up when someone eventually asks "what does this system know about the outage in March, and who told it that."

Try to run "show me everything any agent, on any tool, holds about this person or this system, and delete all of it" today, across a real enterprise stack, and there is no query that answers it. Not because any individual vendor is careless — because there is no catalog of memory the way there is a catalog of tables. Nobody has built `listNamespaces` and `listTables` for memory. RUBICON, a recent paper on agentic AI over messy enterprise data, hand-rolled exactly those two commands for its own sources — `?` to list them, `? <source>` to list what's inside — because the agent needed a schema to reason over and nothing in its environment offered one. Memory needs the same thing and doesn't have it either.

## Memory Is the Interesting One

I said it before and I'll say it more precisely now: memory is the pillar of the agent stack with the least structure and the most consequence, because it's the one that silently accumulates the judgments an agent has made about your business and then feeds those judgments into every future decision, unaudited. Lakekeeper doesn't solve this — it's a catalog for Iceberg tables, not a memory store, and I'm not going to pretend otherwise. But the shape of the fix is the one Lakekeeper is built on: an open, portable layer that knows what exists, who's allowed to touch it, and how to prove that later, sitting below the tools rather than inside each one of them. Structured data got that layer over the last decade. Agent memory is where the structured/unstructured governance gap is showing up next, and right now it doesn't have one at all.
