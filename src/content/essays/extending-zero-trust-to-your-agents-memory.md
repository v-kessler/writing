---
title: "Extending Zero Trust to Your Agents' Memory"
description: Assume the agent is compromised. Then decide where its memory lives.
publishDate: 2026-09-22
tags: ["security", "ai-agents", "zero-trust", "agent-memory", "data-governance", "apache-iceberg"]
series: "Agnostic Data"
draft: false
---

*Assume the agent is compromised. Then decide where its memory lives.*

I ended a piece two weeks ago with a claim: a catalog is where governed agent memory starts, and a control plane is what it has to become. Claims are cheap. So we built it, as a [runnable example](https://github.com/lakekeeper/lakekeeper/tree/main/examples/agentic-memory) — two agents keeping private memory in one catalog, proposing skills they are unable to publish, and a human promoting them. I work on the catalog in question, so read the comparisons below with that in mind.

The frame is zero trust, pointed at something that has mostly escaped it: nothing in the agent's code enforces any of this. The agent is assumed hostile, and every refusal comes from the catalog.

It works. Rather more interesting is what had to change on the way: four points where the system, rather than an argument, decided how this had to be built.

## The boundary is the dataset, not the record

The obvious design is one memory store with a column for whose memory it is. Nearly everything does this: mem0 scopes with a `user_id`, a vector database with a metadata filter, Databricks with a key. It is the shape anyone would draw first.

It cannot be enforced. A catalog that vends credentials issues them for a *location*: a prefix in object storage, scoped to a dataset. Everything under that prefix is reachable by whoever holds the keys. There is no row-level anything, because at the moment of enforcement there are no rows — there are bytes at a path, and a credential that either covers the path or does not.

And there is a second leak that row scoping does not even reach. Memory is not only entries; it is the embeddings built over them. One shared recall dataset lets anyone who can read it vector-search every memory it indexes, whatever the paths inside look like. Similarity does not respect a `whose` column.

So a scope is a dataset — entries and embeddings together. If two agents must not read each other's memory, they get two datasets, in two namespaces, with two grants. Not two row filters.

*Dataset* here means the catalog's unit of registration, not an Iceberg table: a dataset of entries, a Lance index beside it, each a separate object with its own grant. Only the decision log at the end of this piece is Iceberg.

That sounds like a limitation and is closer to a clarification. Row-level isolation in a memory service is a promise the application makes; dataset-level isolation is a promise the storage layer keeps. One of those survives a bug in the agent framework.

It has a cost, and I would rather state it than not: per-user isolation means a dataset per user. Where a team or a tenant is the real boundary, one dataset for the group is correct and cheaper. The rule that falls out is short: **the dataset is the unit of access, so it has to equal the unit of trust.**

## You cannot grant write without read

The design had agents filing skill proposals into a shared queue they could write but not read. An inbox: you may post, you may not rummage.

The model will not express it. Reading data resolves through a relation that includes writing it, so granting `modify` confers `select` — and `can_drop`, `can_rename` and `can_set_protection` with it. A shared queue would have been readable by every agent that could write to it, and droppable by any one of them.

So each proposer gets its own queue — its own dataset, named for it. Proposals stay private, and attribution stops being a field the caller fills in and becomes a fact about which dataset the write landed in. An agent cannot file under another agent's name because it has no credentials for that dataset.

## The right to label is its own grant

The catalog has governance tags — a controlled vocabulary you attach to objects. `pii`, `sensitivity=restricted`, a lifecycle tag of your own.

The useful part is not the word, it is who may apply it. Attaching a tag is delegated separately from the right to change the data, so a compliance reviewer can label something they cannot read — and someone who can rewrite a dataset cannot quietly strip the label that marks it sensitive, because removing a tag is gated on the tag rather than on the object. Classification becomes a power in its own right, held by whoever should hold it.

What a tag does not do, under the relationship model this build runs, is decide access: no authorizer reads the value, and the grant stays the gate. Under Cedar — which the catalog also supports — policy decides from attributes on the resource, and that is the direction this is going. The label and the decision converge.

## A governance agent must not judge

Human review does not scale. Forty proposals arrive overnight, one matters, and the reviewer reads all forty or none. The obvious fix is an agent that triages them, and it is a trap.

A governance agent is, by construction, a machine that reads attacker-controlled text. A proposed skill is exactly that — it was written by an agent that may itself have been compromised, which is the case the review exists to catch. That is assume-breach applied to an agent rather than a network: the proposer is treated as already hostile, and every refusal in this piece has to hold in that case. Put a model in charge of the verdict and you have built something that reads hostile input and holds the publishing credential. A skill that cannot get past a regex can absolutely get past a model by addressing the reviewer instead of the task.

So the verdicts are deterministic. Rules, not judgement: every proposal comes out `ok`, `warning` or `critical`, and the queue is ordered worst first. Triage decides what the human reads first, never what happens to it. The model writes a one-line summary alongside and touches nothing else. Rules cannot be argued with, they replay identically tomorrow, and they can be shown to an auditor.

Then the same question one level up: who may change the rules? Because whoever can weaken a rule turns triage into theatre — silently, with no diff for anyone to review.

So the rules are governed data, not code. They live in the catalog as a policy document. The governance agent reads them and cannot write them. Which comes down to one sentence:

> The governance agent can read the rules it enforces. It cannot change them, and it cannot approve anything.

Both refusals come from the catalog. Neither is a check in its own code that a clever prompt could talk past.

## What a denial actually looks like

The shape of the thing, once all of that settles:

```
  agent_memory/
    ├── agent_a/     entries + recall     agent-a: read+write · agent-b: invisible
    ├── agent_b/     entries + recall     agent-b: read+write · agent-a: invisible
    └── shared/      entries + recall     both read, neither writes
  skills/
    ├── proposed/
    │     ├── <agent-a>   its own queue, and no sight of any other
    │     └── <agent-b>
    ├── approved          agents READ · only the reviewer WRITES   ← the wall
    ├── rejected          refusals with reasons, readable by the proposer
    └── decisions         every approval and refusal, as a table
  governance/
    └── policy            the triage rules · read by the agent, written by nobody else
```

The two halves are granted at different levels, and the asymmetry is not an oversight. A namespace grant flows downward — `select` on `skills` would hand over every proposal queue beneath it — so skills are granted dataset by dataset. Memory is granted on the namespace, because there the boundary runs around a whole scope rather than between siblings. Inheritance is convenient everywhere except at the line you are trying to hold.

The `rejected` tier is where the loop closes: a refusal is readable by the agent that filed it, so a proposal that fails comes back with the reason it failed.

And the output of the run that proves it, which I find more convincing than any diagram:

```
  PASS  agent-b denied agent-a's memory (404)
  PASS  denied scope drops out of the fan-out
  PASS  shared tier is read-only for agents (AccessDenied)
  PASS  agent-a cannot approve its own skill (AccessDenied)
  PASS  agent-b cannot see agent-a's queue (NotFoundError)
  PASS  governance agent cannot approve (NotFoundError)
  PASS  governance agent cannot weaken its rules (AccessDenied)
```

All of it runs locally. `./up.sh` brings up the catalog, an identity provider, object storage, Jupyter and two local models — no API key, no cloud account — and four notebooks walk it end to end: setup, an agent learning, the denials above, and the governance agent. The third and fourth are where the refusals happen.

Two details in there are worth pulling out.

It is **404, not 403**. The catalog does not admit that a dataset you may not see exists. A denial that says "forbidden" has already told you something.

And "denied scope drops out of the fan-out" is the property I like most. When an agent searches its memory, it asks every scope it knows about. The ones it may not read return nothing and fall out of the results. The agent never enumerates its own permissions, never carries a list of what it is allowed to touch, never has code that could get that list wrong. It asks for everything and the catalog answers by refusing.

That is the difference between governance in the application and governance underneath it. One is a list the agent consults. The other is a door that does not open.

## When not to use any of this

Most production "skills" today are markdown files in a repository, reviewed by pull request, shipped on deploy. That is already governance: versioned, attributed, reviewed, auditable, free.

**If your skills are human-authored and ship on deploy, use git.** Nothing here beats it, and an answer that cannot say so is not worth trusting on the rest.

The same honesty is owed to the memory layer you already run. mem0 and Zep do a great deal this does not — extraction, consolidation, resolving one fact against a contradicting one, letting old entries decay. None of that is on offer here, and none of it is what this replaces. The question it answers is the one underneath: where the bytes live, and who holds keys to them. Nor is it true that they lack access control. Zep binds attribute-based policies to the API key an agent authenticates with and filters results by data class — a real authorization layer, better than most of what is deployed.

The difference is where the refusal happens. Zep evaluates the policy and then reads the data: the service is in the path, holding storage credentials for everything it protects. A vended credential puts the boundary underneath. The agent holds keys for one prefix and nothing else, so a request for bytes it may not read cannot be formed, let alone evaluated — there is no service in the path to have a bug in.

The part I would actually argue for, though, is duller than any of that. These products bring their own permission model, and whatever backend they write to — your Postgres included — those permissions are theirs rather than your platform's. So "who may read this" gets answered twice, in two vocabularies, with two trails to reconcile at audit. Here memory is a dataset beside every other dataset: the same grants your tables already use — readable by whatever engine reads your tables — one log, and a decision log an auditor can query from Trino or DuckDB without knowing the memory layer exists.

Two complete governance stacks side by side are not a separation of powers — they are the same powers twice, and separation needs one constitution with different hands beneath it.

There is also a half of this with no equivalent in that market at all. Those tools store facts. None of them govern a procedure the agent is going to execute.

The sharper version is not "use git" but "have the agent open a pull request", and for many teams that is the right answer — you inherit review, history and CI for nothing. It loses in three places. A pull request is global where approval has to be per tenant. A merge ships on the next deploy where approval has to take effect on the next run. And an agent holding repository credentials can merge its own work: there the control is process and CI, here it is the absence of the ability. That last one is the whole distinction.

What neither reaches is the case this was built for: an agent writing a procedure at three in the morning, at volume, with nothing to review until you build the machinery to make it reviewable.

The nearer-term version needs no autonomous agents at all. On a shared agent platform, who may publish a skill that another team's agents will execute? That is the same question as who may push to production, and it arrives the moment a second team joins.

## One table earns Iceberg

The last of the four, and the only one where the answer was yes.

I argued for an Iceberg index over agent memory, on the grounds that memory should be queryable data. Then I dropped it, for the reason above: memory is one dataset per scope, so there is nothing central to query, and agents read it through an SDK rather than SQL.

Decisions are different, and it took someone asking "is that written anywhere?" to see it. Approvals and refusals are central rather than per-scope, so there *is* one table, and the readers are auditors writing SQL. The log is append-only, multi-writer and time-ordered — which is Iceberg's actual job, and precisely what a plain object store cannot arbitrate.

So every approval and refusal appends a row: when, which skill and version, who proposed it, who signed, what the rules flagged, the reviewer's reason, and which version of the rules was in force. That last column separates *"we did not check for that then"* from *"we checked and missed it"* — a distinction that decides how a post-mortem goes.

The catalog's own audit log already records that a write happened and who made it. What it cannot know is *why* — that is application meaning, and it needs somewhere to live.

## What this does not fix

It governs shared, durable memory. It cannot stop an agent keeping something in its context window or writing to its own disk — the claim is about what persists and is shared, not about what a model can hold in mind.

The rules catch phrasing, not intent. A carefully worded malicious procedure passes every regex in the set. Triage buys attention, not safety.

And the reviewer is still the ceiling. The honest path past them is a policy principal applying an approval under stated conditions — never a model's judgement about text it was handed.

None of that undermines the part that works. A denied agent gets no keys, so it cannot read the bytes. It runs the same code as the permitted one, and the difference is a grant. Zero trust comes down to that: the boundary does not live inside the thing you are not trusting.

The catalog was where it started. Memory and skills are data now, governed like the rest of it — and governance that only works inside one product is not governance you can move.
