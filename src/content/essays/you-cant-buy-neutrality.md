---
title: "You Can't Buy Neutrality"
description: "Why the clearinghouse for AI agents will be chosen, not imposed — and why the incumbents can't hold the seat. Captivity needs no structure; trust requires it."
publishDate: 2026-06-14
tags: ["ai", "governance", "open-source", "strategy", "data-architecture"]
series: "Agnostic Data"
draft: false
canonicalURL: "https://www.linkedin.com/pulse/you-cant-buy-neutrality-vakamo-com-vb9we/"
---

*Why the clearinghouse for agents will be chosen, not imposed — and why the incumbents can't hold the seat.*

[Jamin Ball](https://www.linkedin.com/in/jamin-ball-49366137) recently wrote that systems of record won the SaaS era because removing one was prohibitively painful, and the equivalent prize in the agent era is the clearinghouse — the mechanism deciding which agent is cleared to act, on what data, with what limits, and keeping records. Whoever holds that seat holds the moat. The lock-in moves from your data to your permissions; the source-of-truth era becomes the source-of-permission era.

He's right. If you read one thing on where enterprise AI value is about to land, read [his piece](https://cloudedjudgement.substack.com/p/systems-of-record-won-the-saas-era).

But there's one line worth examining, because it quietly includes an assumption that doesn't apply to everyone racing toward that seat. Jamin says: nobody really loves the clearinghouse, but it has to exist.

That's true of one kind of clearinghouse. It is not true of all of them. And the difference is the entire strategy.

## The clearinghouse nobody loves

The model in that line is something like the DTCC — the Depository Trust & Clearing Corporation, the plumbing nearly every US securities trade settles through. Nobody has warm feelings about the DTCC. Most people don't know it exists. You route through it not because you chose it but because the structure leaves no alternative.

Its moat is captivity. Exit is impossible, so love is irrelevant. "Nobody loves it" isn't a flaw in the business — it is the business.

That's one way to hold a neutral seat between parties who don't trust each other: make yourself unavoidable.

## The clearinghouse the world chose

There's another. I happen to live in it.

Nobody is forced to bank in Switzerland, arbitrate in Geneva, or route a sensitive negotiation through a Swiss table. There is no structural lock-in. Every party that clears through Switzerland could clear somewhere else tomorrow. And yet, for a very long time, they didn't — they chose it, repeatedly, over the alternatives. Not out of love, exactly. Out of trust — the earned, boring, compounded belief that the institutions are predictable, that no single actor can capriciously seize what you put there, that the rules today will be the rules next year.

That is also a clearinghouse. Same job: a neutral party sitting between actors who don't fully trust each other. Opposite moat. One holds its seat through inescapability. The other holds it through being chosen.

## Why this distinction is the whole game

Here is why this matters, beyond splitting hairs. If you are building an open, neutral platform — and a lot of the most important infrastructure now is open — you are structurally barred from the first kind. You cannot make anyone unavoidable-route through you. Exit, for us, is a git clone away. That is not the absence of a moat — it's the absence of a cage. The stickiness we earn is the kind you accumulate and wouldn't want to walk away from: tuned policies, audit history, integrations, trust. Not the kind we trap you into. The captivity moat is the one we've foreclosed by design.

Which means the question of whether it's trusted and chosen is not a soft branding afterthought we get to do at the end of the sales cycle. It is the entire competitive position. Jamin's "nobody loves the clearinghouse, and that's fine" is, for an open player, exactly backwards. We don't get captivity. Trust is all we have. So it had better be the thing we engineer for first, not the thing we hope shows up last.

## Trust is structural, or it is a brand promise

This is where an earlier piece on trustworthy data platforms comes back. The argument was that a trustworthy data platform has the structure of a constitutional democracy: separated branches — policy, enforcement, audit — a constitution above them that ordinary policy can't amend, and real checks between them. At the time that read as an argument about how to build one system well. Jamin's frame turns it into an argument about who wins the market.

Because the reason Switzerland can be chosen rather than merely tolerated is structure. The trust isn't "we're nice." It's institutions — separation of powers, predictability, the credible belief that no one branch can go rogue and seize what you placed there. Captivity needs no structure; you're stuck either way. Trust requires it. Separation of powers is not just a security pattern. It is the thing that makes a chosen clearinghouse credible instead of a slogan.

And there is a warning baked into the Swiss case worth acknowledging: earned trust is perishable. Centuries of reputation got visibly dented in a few years — a flagship bank collapsed, banking secrecy ended, and the "predictable, untouchable" story took real damage. And it isn't only scandal that erodes neutrality — it's gravity. Secrecy didn't end because it failed; it ended because a large enough power made staying neutral too expensive. The platform version of that pressure is bundling: use our built-in clearinghouse, here's a million in credits. A neutral seat is only worth the name if it can resist that pull — which is exactly why structure, not good intentions, is what keeps a thing neutral under pressure. That's not a hole in the analogy. It's the most important part of it. A captive clearinghouse survives its own scandals, because you can't leave. A chosen one does not. It has to re-earn the seat continuously — and when an incident lands, structure is what lets you re-earn it credibly. "No single component can go rogue alone" is not a compliance nicety. It is the mechanism by which a chosen intermediary survives its worst day.

## Why we are building clearinghouses at all

Step back and ask why agents need a clearinghouse in the first place. The honest answer: we invented actors we can't punish. You cannot jail an agent, fine it, or reach into its conscience. Accountability — the thing that let us trust human operators to interpret rules in good faith — doesn't bind them. So the trust has to move out of the actor and into the structure.

The clearinghouse is the institutional answer to the unjailable agent. And the only clearinghouse that can answer durably is one whose trustworthiness is structural rather than promised — because the agents will operationalize whatever you hand them literally, at scale, and at speed, in ways the author never anticipated.

## You cannot extend your way into neutrality

Which brings us to where there's disagreement with the people racing for this seat.

The data players believe they win from below: data gravity becomes clearing gravity, because the agents have to come to where the data lives. The OS and productivity players believe they win from above: own the surface where work starts, and clear wherever the user is. Both are arguments for extending into the clearinghouse from an existing position of power. And both run into the same wall.

A clearinghouse's value is that it has no stake. The whole point, in financial markets, is that the parties who don't trust each other settle through someone who isn't on either side of the trade. One vendor clearing a rival's agents doesn't hold together, for the same reason a legislature can't be its own supreme court. The incumbent cannot be neutral about the very thing it is incumbent in.

This is the Switzerland point again, in market form. The seat that compounds is not the captive one the incumbents can build from above and below. It is the chosen one — and being chosen requires a neutrality that incumbency destroys. You cannot extend your way into neutrality. You either have no engine, no model, no agent of your own to favor, or you don't.

## What I am, and am not, claiming

I'll be precise here, because over-claiming is the fastest way to lose the reader who matters. In Jamin's full sense a clearinghouse holds four things: memory (what agents know), context (what they see), execution (what they're allowed to do), and governance (who's allowed to do what, plus the audit trail behind it).

The easy version of the argument is "we just do the governance part." That doesn't capture the full picture, and it sells the seat short. A neutral control plane sits under all four — and not the passive inventory the word usually conjures. An operational one, in the path of every request, deciding in real time.

Start with context. Serving what an agent is allowed to see, from where, in what shape — that is a control plane's core job. A control plane doesn't sit next to the context layer; it is the context layer. A neutral one decides what every engine and every agent gets to see, against one set of rules.

Memory is the interesting one. A control plane doesn't think the agent's thoughts for it. But the moment memory is written down — traces, telemetry, evals, the embeddings and vector stores agents reason over — it becomes the exact thing Jamin says these systems fill up with: data. And data has to be registered, governed, and audited. That is the control plane again. We don't hold the memory the way the agent holds it in the moment; we hold the record of it and the rules over it.

There is a catch, and it's the gap worth returning to. Governance grew up around structured data — tables, columns, rows. The lake "larger" half of the Lakehouse, the unstructured side, was mostly left ungoverned. And agent memory lives almost entirely on that side: documents, embeddings, traces, the messy stuff that never fit in a table. So a control plane that wants to clear agents has to reach into the lake, not just the warehouse. Here we need more standards to provide a solution as Apache Iceberg did for structured data. A clearinghouse that can only govern the structured half is governing the wrong half for agents.

Execution we already touch. A policy-enforcement point clears or denies each request as it arrives. We don't run the agent, but no request reaches the data without passing through us first.

So the honest claim is bigger than "the governance branch," and narrower than "the whole clearinghouse." We don't run the agents or own their reasoning. But the control plane is the one neutral place all four touch ground — where context is served, memory is registered, execution is cleared, and governance is written down. That is the part the incumbents can build but cannot make credible, for the same reason a referee can't also play.

## The question worth taking back to your team

So if you're placing this bet — as a buyer or a builder — Jamin's question is the right one: are you on a path to the clearinghouse, or building a feature that clears through someone else's? I'd add one underneath it.

Of the two kinds of clearinghouse, which one are you actually trying to be? The unavoidable one, whose moat is that you can't leave? Or the chosen one, whose moat is that you wouldn't want to?

Because the first is a tollbooth, and people are right not to love it. The second is a place people move to. Switzerland earned that over centuries. The seat is open now, in software, for whoever is willing to build the structure that makes being chosen possible — and honest enough to admit that no amount of incumbency can shortcut it.
