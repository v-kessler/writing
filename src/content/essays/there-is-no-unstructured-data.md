---
title: "There Is No Unstructured Data"
description: Unstructured was never a property of the data. It was a limit of the reader. Agents can read what SQL never could, and the table loses its monopoly on the question.
publishDate: 2026-10-25
tags: ["unstructured-data", "ai-agents", "data-architecture", "lakehouse", "apache-iceberg"]
series: "Agnostic Data"
draft: false
---

Pick up a supplier contract. It is a PDF, forty pages, scanned at a slight angle. In ten seconds you know who the parties are, when it starts, when it can be cancelled, what the penalty is for late delivery and which law applies. You see a header, a list of obligations, a table of prices and two signatures.

Now ask your data platform what it sees. It sees a blob. Content type `application/pdf`, size 2.3 MB, last modified Tuesday. In the catalog, if it is in a catalog at all, it is filed under one word: unstructured.

So which one of you is unstructured?

## We built an industry around a limitation

For fifty years the rule of data has been simple: structure first, then ask. Before a question can be answered, someone has to turn the world into rows and columns. Sensor events are parsed into tables. XML is flattened into tables. Forms are typed into tables. Then we join those tables, clean them into new tables, aggregate them into more tables and publish the last one as a dashboard. Bronze, silver, gold. Tables on tables on tables.

We called this engineering, and it was. But look at what it really is: a translation layer. The world does not arrive in rows. The query engine needs rows. So we hired an army to translate.

And the army is losing. Depending on who counts, somewhere between 75 and 90 percent of the data a company holds never makes it into a table. Contracts, emails, scans, images, call recordings, log files, CAD drawings, chat threads. It is not that nobody wanted to query it. It is that nobody could afford to translate it. Every new pipeline costs weeks, breaks when the source changes and covers one document type at a time. The gap does not close. It grows every year, because the world produces documents faster than we produce pipelines.

We gave that untranslated majority a name, and the name blames the data.

## Structure belongs to the reader

Here is the uncomfortable thought: almost nothing is truly unstructured.

A contract has a grammar. Parties, dates, clauses, amounts, signatures. An invoice has a header and line items. An XML file is structure by definition. A sensor stream has a timestamp, a device and a value. Even a photo of a damaged truck has structure: a vehicle, a location, a dent of a certain size on a certain panel. An insurance assessor reads that structure every day without writing a single line of ETL.

What these things lack is not structure. They lack a structure that SQL can parse. They are not unstructured. They are un-SQL. "Unstructured" never described the data. It described the reader. It meant: our machines cannot see what is in here, so a human has to look.

That was true for fifty years. It is not true anymore.

## Enter a new reader

An agent can open the PDF. It reads the contract the way you did: parties, dates, the penalty clause, the governing law. It can compare it with the last three contracts from the same supplier, notice that the cancellation period got shorter and tell you why that matters. It reads XML without a schema, logs without a parser and photos without a labelling project.

For the first time, a machine can ask questions of the majority of our data, in place, without anyone translating it first.

Think about what that does to the old rule. "Structure first, then ask" assumed that asking required rows. With an agent as the reader, asking requires only access. The structure is applied at the moment of the question, by the reader, for that question. Data engineers know this pattern as schema-on-read. Agents take it one level up: not schema-on-read, but meaning-on-read.

So here is the provocation, stated plainly: **the table was never the natural shape of data. It was the shape our readers needed.** It was a crutch for SQL engines and for the humans who wrote SQL. And in an agentic world, the table loses its monopoly on the question.

## The table is not dead. It is demoted.

If you are a data engineer, you have objections by now. They are good ones, and they are exactly why this is not the end of the table.

- **Cost.** An agent reading ten million PDFs to answer one question is absurdly expensive. A columnar scan over an Iceberg table costs a fraction of a cent.
- **Determinism.** Ask an agent the same question twice and you may get two answers. Ask a table twice and you get the same number twice.
- **Aggregation.** An agent cannot sum a billion rows by reading them. A query engine does it in seconds.
- **Proof.** A regulator wants a number with a source and a method, not a model's opinion of a number.

All true. But notice what these objections defend. Not the table as the gate to every question. They defend the table as the cheap, repeatable, provable answer to a question we ask often.

That is the demotion. The table stops being the precondition for asking anything at all. It becomes a **cached interpretation**: meaning that was read once, frozen and made cheap to read again. When the procurement team asks every month how many supplier contracts can be cancelled within 30 days, you do not want an agent reading every contract every month. You want the agent to read each contract once, write the cancellation period into a table and let SQL do the rest.

The dividing line in the data platform is no longer structured versus unstructured. It is **interpreted once versus interpreted every time**.

- The long tail of questions, the one-off investigation, the "what does this contract actually say" goes to the agent, reading the original.
- The repeated question, the board metric, the regulatory report goes to a table, which an agent may well have filled.

The table survives. It just stops being the place where all data has to go before anyone is allowed to look at it.

## The new problem: a table full of opinions

Here is the part nobody likes. Once an agent fills the table, the table changes character.

When an ETL job parsed a date from a CSV, the result was deterministic. Same input, same output, forever. When an agent reads a contract and writes "cancellation period: 30 days", that row is an interpretation. A different model, a different prompt or a newer version of the same model could write 60, because clause 14.2 refers to an annex that changes the default. The row looks exactly like a fact. It is a judgement.

That means three things for anyone running a data platform:

1. **The original stays the source of truth.** The PDF is not raw input to be thrown away after extraction. It is the record. The table is a derivative you must be able to rebuild from it.
2. **Every interpretation needs lineage of meaning.** Not only which file a row came from, but which model read it, with which prompt, in which version, and with what confidence. Without that, you cannot explain a number, and you cannot redo it when the model improves.
3. **The reader needs permissions, not just the data.** If agents are now reading contracts, scans and emails directly, then those files need owners, policies and an audit trail, the same as any table. An agent acting for a user should see exactly what that user may see, in the PDF and in the table built from it.

This is where the old split hurt us most. For a decade we governed the tables carefully and left the files in buckets with a path and a prayer. In an agentic world the files are not the leftovers. They are the majority of what gets read.

## What we are building toward

At [Vakamo](https://vakamo.com) this is the problem we keep coming back to, and it shapes how we build [Lakekeeper](https://lakekeeper.io), our open-source Apache Iceberg REST catalog. The idea is simple: one catalog and one policy set for both sides of the line.

- **Iceberg tables** for the interpretations we have frozen: cheap, repeatable, versioned, readable by every engine.
- **Governed Datasets** for the files themselves, PDFs, images and documents with an owner, a policy and a version, so an agent reads them through the same rules as a query engine reads a table. This is in preview in Lakekeeper today.
- **Policy as code** with Cedar, so a rule like "only procurement may read supplier contracts" applies whether the reader is a Spark job, an analyst or an agent working for one of them.

Lineage of meaning, connecting a row in a table to the file, model and prompt that produced it, is the next piece, and an open one for the whole industry. I wrote about the gap between the deterministic and the probabilistic parts of the lake in [The Two Universes Inside Your Data Lake](https://vakamo.com/resources/blog/the-two-universes-inside-your-data-lake), and about governing the files in [Did We Forget the Lake?](https://vakamo.com/resources/blog/did-we-forget-the-lake). This essay is the reason both matter more now than they did in March.

## Back to the contract

Pick up the supplier contract again. To you, it was never unstructured. To your data platform, it was, for fifty years, because the platform's only readers were SQL engines and the people who fed them.

That era is ending. The agent reads the contract the way you do. The table becomes what it always should have been: a fast, trusted summary of what we have already understood, not a toll booth every piece of data must pass before anyone may ask about it.

There is no unstructured data. There is only data we had not learned to read. Now that we can, the question is no longer how to force it into rows. It is who gets to read it, and how we prove what they understood.

*If you are already letting agents read your documents directly, I would like to hear how you keep track of what they concluded. [Write to me](mailto:viktor@vakamo.com) or find us on the Lakekeeper Discord.*
