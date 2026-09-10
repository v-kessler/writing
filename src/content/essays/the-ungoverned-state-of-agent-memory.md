---
title: "The Ungoverned State of Agent Memory"
description: Why local agent state is a security nightmare, and how a control plane fixes it.
publishDate: 2026-09-10
tags: ["ai-agents", "data-governance", "agent-memory", "mcp", "data-architecture"]
series: "Agnostic Data"
draft: false
---

*Why local agent state is a security nightmare, and how a control plane fixes it.*

Your coding agents have started writing things down.

Not the code — notes about the work. Who you are. What you corrected last week. Why the deploy failed in March. Every serious coding agent now keeps a memory folder, and it fills up quietly while people work.

Nobody governs any of it.

I wrote a few months ago, borrowing Jamin Ball's framing, that the clearinghouse for AI agents has to hold four things: memory, context, execution, and governance. Memory is the one already happening — on every laptop in your company, in a format nobody chose.

## Two folders that never met

Open two coding agents on the same machine, same repository, same person, and you get two memory systems that have never heard of each other.

Claude Code keeps a folder per project and writes a note the moment it decides something matters. Codex pools its notes for the whole machine and merges them later, in the background. Both are sensible. Neither team had reason to coordinate with the other.

That is the point. Two agents, one employee, one laptop — and what each learns about your codebase sits in a separate folder that will never be reconciled, searched together, or deleted together. Multiply that across a company and you have a filing system nobody designed.

## The contractor problem

There is a sharper version of this, on a lot of laptops right now: the freelancer who works for two clients. One machine, two companies that are not supposed to know anything about each other. Possibly competitors.

Claude Code's per-project folders happen to keep them apart. Codex's memory does not work that way — one pool for the person, fed into the next session no matter which client it is for.

Nothing here is misbehaving. The tool was never told that the person at the keyboard has two employers, because there is nowhere in the format to say so.

So one client's architecture and incident history gets folded into a summary, and handed to an agent working for the other. No breach. No alert. No log entry. And no NDA that anticipated it.

## Nobody owns the format

You would expect the Model Context Protocol to have settled this. It has not. MCP covers tools, resources, and prompts. It says nothing about memory.

Into that gap fell an example implementation, shipped as a demo and copied widely because it was there. It lost data — two writes at once, one silently gone — for the better part of two years. Volunteers fixed that copy a few weeks ago. Everything that inherited the pattern did not get the patch, and most never will.

A newer proposal, memorywire, at least gives memory a shared vocabulary — but a vocabulary tells you how to say "forget this," not which stores exist to say it to, or who is allowed to say it.

## Every vendor governs. Nobody governs across.

It would be wrong to call enterprise memory tools ungoverned. They are siloed, which is a different problem.

AWS, Zep, Mem0 and Databricks all ship real controls — customer-held encryption keys, audits, legal holds, catalog permissions. Each can answer honestly, inside its own walls: is this encrypted, can we delete it, who is allowed to read it.

None of them can answer it about the others. No shared identity, no shared retention rule, no shared delete button across four stores and a laptop folder that all know something about the same customer.

Governance grew up per vendor, correctly. It stops at the vendor's edge, the way a passport is real, enforceable, and good only in the country that issued it.

We have seen this before. A decade ago every warehouse governed its own data perfectly and none of it moved. Iceberg broke that open: the table became something any engine could read, with a catalog above it holding the rules. Agent memory is roughly where the warehouses were — governed inside each vendor, portable nowhere.

And you cannot fix that by asking four vendors to agree. Interoperability holds only where it is enforced — somewhere everyone already passes through: where the data sits, and where permission to read it is issued.

## The question nobody can answer

Try this today. Show me everything any agent, on any tool, knows about this person — and delete all of it.

There is no query that answers it. Not because any vendor is careless, but because there is no catalog of memory the way there is a catalog of tables. Nobody can even list what exists.

## It is a security problem too

Picture the attack. Someone plants an instruction inside a document your agent reads — a README, a ticket. The agent decides it is worth remembering and writes it down. Weeks later it fires, in a session with nothing to do with where it came from.

This is memory poisoning, and OWASP now ranks it in its top ten for agentic applications. Prompt injection ends when the session ends. This gets written down.

It is also close to invisible: poisoned memory looks like the model being unreliable, so it gets debugged instead of investigated. Memory is not unaudited. There is no audit to fail.

## Where this has to go

A table format is not a memory format, and I am not going to pretend otherwise. But a catalog does not need to hold the memory — only the record of it and the rules over it. That part already works: files and datasets on object storage can be registered as governed objects, with access granted per request and per identity, and the data itself never moving.

A memory store is already a location plus a policy. That is what it is on every laptop today, minus the registration.

But registration is where this starts, not where it ends. An inventory tells you what exists; it does not stand between the agent and the data at the moment the agent asks — the only place a rule is really enforced. That needs a control plane: one place where every request is cleared or refused, and the decision written down either way.

And notes are not the only thing accumulating. The same background pass writes the agent's skills too. A note is something the agent believes; a skill is something it will run. Govern the notes, ignore the skills, and you have governed the safer half.

The catalog is where it starts. The control plane is what it has to become.
