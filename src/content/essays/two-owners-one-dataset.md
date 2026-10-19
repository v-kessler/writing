---
title: "Two Owners, One Dataset: Why Governance Has to Shift Left"
description: Every copy is a governance break. Move the rules to where data is born, and check them at every access.
publishDate: 2026-10-19
tags: ["data-governance", "apache-iceberg", "shift-left", "ai-agents", "lakehouse"]
series: "Agnostic Data"
draft: false
---

Max runs the order system. Every order is a row in his Postgres database, and he knows exactly what each column means, who may read it and why. Alice runs analytics. She works on a copy of the same orders in the lakehouse, exported overnight, cleaned, joined and secured again with her own rules.

On Monday the board asks how many orders were cancelled last quarter. Max says one number. Alice says another. Both are right about their own data, and neither owns the answer.

This is not a story about bad engineers. It is the normal shape of a data platform: data is born in one place, copied to another, and every copy gets a new owner and a new set of rules. We have spent a decade making the lakehouse faster and more open. We have spent much less time asking who owns the data once it leaves home.

## Every hand-over is a governance break

Follow the orders from Max's table to Alice's dashboard and count the hand-overs: export, land, clean, join, secure, publish. Each hop is a place where ownership changes hands and access rules are written again, by someone else, in another tool. Four things go wrong, every time.

- **Two owners, one dataset.** Max owns the source, Alice owns the copy. Nobody owns the truth end to end, so every disagreement becomes a meeting.
- **A governance break at every hop.** Each copy gets new permissions. A rule that masks a customer's IBAN in Postgres does not travel with the export. Policies drift, and lineage is lost on the way.
- **Unstructured data stays ungoverned.** Contracts, scans and PDFs sit in buckets with no catalog, no owner and no policy. They are exactly what we now feed to AI.
- **Agents multiply the problem.** Every new agent gets its own extract and its own keys. There is no central control and no audit of who did what.

None of this is a tooling failure. It is what happens when governance is something we add at the end of the pipeline instead of something the data carries from the start.

The problem is not the bytes. Moving data is often the right call. The problem is that ownership and rules do not move with it.

## Why "fix it later" stopped working

For years the copy chain was annoying but tolerable. A data team could reconcile the numbers, rebuild the permissions and explain the difference in a footnote. Three things have changed that.

**AI reads everything.** A model or a retrieval pipeline does not stop at the tables someone curated. It reads the PDFs, the images and the raw exports, the data that never had an owner. If you cannot say what went into an answer, you cannot defend the answer.

**Agents act, and they act fast.** An agent working for a user reads from Postgres, writes to the lake and calls the next system in seconds. Every extract it takes is another copy with another set of keys. Governance that runs once a quarter cannot keep up with software that runs every second.

**Regulators want proof, not intent.** In financial services, BCBS 239 asks banks to show where risk data comes from and that it is accurate. DORA asks them to prove control over their ICT systems. "We copied it, cleaned it and re-secured it" is not proof. It is a chain of trust with a weak link at every hop.

## Shift left: govern where data is born

Software engineering learned this lesson years ago. Testing and security moved "left", closer to where code is written, because finding a problem in production costs far more than preventing it at the source. The data world has started the same move for quality, with data contracts at the producer.

Access governance has not moved yet. We still secure data where it lands: in the warehouse, in the BI tool, in the vector store. Shifting left means the opposite. The owner of the data at its source, Max, defines who may see what, once, and that definition follows the data wherever it is read.

In practice that means three things:

1. **One catalog that reaches the source.** The Postgres tables, the Iceberg tables in the lake and the files in object storage are all visible in one place, with one owner each.
2. **One policy language for all of it.** A tag like `pii` on a column means the same rule whether the column is read in Postgres, in the lake or by an agent.
3. **No re-owned copies.** Data may still move, from Postgres into Iceberg for example, but it moves as the owner's data product: same owner, same policy, same lineage. Consumers read that product instead of building their own secured copy.

Alice does not lose anything. She still builds her analysis. She just builds it on Max's data product rather than on a private copy of it.

## Continuous governance: decide at every access

Shifting left fixes where rules are written. Continuous governance fixes when they are applied.

Most organizations govern in batches. Permissions are granted in tickets, copied into each engine and reviewed once a quarter in a spreadsheet. Between reviews, nobody can say with confidence who can read what right now. When someone leaves a team, the revoke reaches one system and not the other four.

Continuous governance replaces that with three simple properties:

- **Define once.** Rules live in one place as policy as code, not as grants scattered across engines.
- **Enforce at every access.** Each read is checked against the current policy at the moment it happens, by whoever is asking: an analyst in Snowflake, a Spark job, an agent acting for a user. Access comes as short-lived credentials, not standing passwords.
- **Prove it all the time.** Every allow and every deny lands in one audit log. The answer to "who could see this table last Tuesday" is a query, not a project.

This is also how governance scales to agents. An agent acting for Bob should get exactly Bob's permissions, evaluated the same way as Bob's own query, and leave the same trail. If the rule changes, the next request already follows the new rule.

![Before and after. Today, an order row in Max's Postgres database passes through a nightly export, a lake copy and a re-secured view before it reaches Alice's dashboard; every hop brings a new owner, new permissions and lost lineage, so the board gets two numbers. After shifting left, Postgres tables, Iceberg tables and files sit behind one control plane (one catalog with one owner per dataset, one policy set as code, checked at every access, one audit log), and analysts, engines and AI agents acting as the user all read through it. Max owns the data from the first row to the last answer: one number.](https://vakamo.com/diagrams/shift-left-control-plane.svg)

The difference is not more security on the right. It is fewer places where security has to be rebuilt.

## A path, not a big bang

Nobody rebuilds their data estate to fix ownership. The good news is that you don't have to. Shift left works best as a sequence, where each step pays off on its own:

1. **Start with the lakehouse.** Put one catalog and one policy set in front of your Iceberg tables, so every engine reads and writes through the same rules.
2. **Bring in the other catalogs.** Federate the tables your Snowflake and Databricks teams own. They keep ownership; everyone else finds every table, and its rules, in one place.
3. **Bring in the files.** Give every image, PDF and document an owner, a policy and a version, before it feeds a model.
4. **Reach the source.** Govern Postgres tables in the same catalog, and replace standing database passwords with short-lived credentials per user.
5. **Treat agents as first-class.** Same policies, same audit log, acting as the user they work for.

This is the path we are building [Lakekeeper](https://lakekeeper.io) for, an open-source Apache Iceberg REST catalog with Cedar policy as code. Where it stands today:

| Step | Status in Lakekeeper |
| --- | --- |
| One catalog and policy set for Iceberg, short-lived storage credentials | Available today |
| Images, PDFs and documents as governed Datasets | Preview, usable today |
| Postgres tables and per-user Postgres credentials via pg_lakekeeper | Next |
| Federation of Unity Catalog and Snowflake Horizon | On the roadmap |
| Per-user decisions inside Snowflake and Databricks | Depends on engines passing end-user identity |

We would rather be precise about that table than promise the whole picture at once. Each row is a step a team can take on its own.

## One owner, one number

Go back to Monday's board meeting. In a shifted-left world, Max owns the orders from the moment a row is written to the moment it appears in the board report. Alice builds her analysis on his data product. The orders still land in the lake as Iceberg tables, but Max publishes them, owns them and sets their rules, and nobody re-secures them on the way. The rule that hides customer IBANs is written once and applies in Postgres, in the lake and to the agent that drafts the summary. When the board asks how many orders were cancelled, there is one number, and an audit log that shows who could see what along the way.

That is the real promise of shift left and continuous governance. Not more controls, but fewer places where control can break.

*If you are working through the same problem, I would like to hear where your copy chain hurts most. [Write to me](mailto:viktor@vakamo.com) or find us on the Lakekeeper Discord.*
