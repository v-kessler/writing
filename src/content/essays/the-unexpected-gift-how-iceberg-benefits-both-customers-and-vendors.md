---
title: "The Unexpected Gift: How Iceberg Benefits Both Customers and Vendors"
description: "How Apache Iceberg unbundles storage, query engines, and the control plane, freeing customers from lock-in and letting vendors specialize instead of building do-it-all stacks."
publishDate: 2025-09-21
tags: ["apache-iceberg", "query-engines", "data-architecture", "vendor-lock-in", "lakehouse"]
series: "Agnostic Data"
draft: false
canonicalURL: "https://www.linkedin.com/pulse/unexpected-gift-how-iceberg-benefits-both-customers-vendors-u3n3e/"
---

## The Pain of the Past + Iceberg's Role

For the last five years, I've been part of countless debates: Should we use query engine X or Y? What's the real difference? Almost always, the arguments boiled down to speed and cost. But today, speed differences are measured in milliseconds, and costs have dropped so much that they're barely a differentiator, with vendors even trying to outcompete each other on price.

Did Apache Iceberg turn query engines into a commodity? The answer isn't what you think.. With data stored in an open, interoperable format, the query engine suddenly looks like just another replaceable component. If the data lives independently of the tool, what's left to differentiate? Is Iceberg a blessing—or did it make query engines less critical?

When Iceberg is deployed correctly, the architecture looks very different from the old world. Storage, query engine, and control plane (aka REST catalog) are now unbundled.

- Your Parquet files sit in object storage.
- You pick a query engine that best fits your use case.
- Metadata and governance are managed by the Iceberg control plane (REST catalog).

This separation changed the game: no longer is the debate "X vs. Y" about speed or cost. Instead, the real value of query engines is starting to show in new ways.

## Iceberg as a Blessing — Query Engine Independence & Easy Switching

For customers, Iceberg has been nothing short of a blessing. By unbundling storage, query engines, and the control plane (REST catalog), it finally gives organizations true independence and flexibility.

Imagine the world before Iceberg: switching query engines was a major project. Every tool came with its own quirks, integrations, and performance characteristics. You were often locked into a specific stack—not only because of integration, governance, and pipeline rewrites, but mostly due to heavy data migration requirements. Moving petabytes of data safely and consistently was a massive barrier.

With Iceberg, that friction is gone:

- Your data stays in open, standardized formats like Parquet.
- You can pick the query engine that best suits a given workload—whether it's low-latency dashboards, large-scale batch processing, or ML pipelines.
- Governance, schema evolution, and metadata are managed consistently in the Iceberg control plane (REST catalog).

Even some query engines, like Trino, have started to embrace this separation, positioning themselves as pure query engines rather than tightly coupled stacks.

Why is this game-changing? Customers no longer have to start from the tool and justify it to the business. Instead, they focus on the use case, talk to stakeholders about the desired outcome, and pick a best-of-breed approach to achieve it. No more "we use X, end of discussion"—now the decision is driven by business value, not inertia or fear of migration.

The result? Switching costs drop dramatically, experimentation becomes safe, and customers can finally treat their query engines as interchangeable tools rather than high-stakes bets. You can adopt a new engine, test it, or optimize for cost and performance—all without touching your underlying data.

In short: Iceberg empowers customers to compose the best tools for their needs, instead of being locked into a single, vertically integrated query stack.

## Vendor Perspective — Iceberg as a Blessing for Query Engines

While Iceberg has been a blessing for customers, many query engine vendors initially misunderstood its impact. Some saw openness and standardization as a threat, worried that if data could be queried anywhere, their product would lose its value. Even today, there is a persistent fear that Iceberg could diminish both the perceived importance of their tool and the company's economic growth.

In reality, Iceberg is a blessing for vendors too. It removes the pressure to be a "Jack of all trades." Vendors no longer need to build a single tool that handles every possible workload—from batch analytics and BI dashboards to streaming pipelines and ML preprocessing. They can now focus on what they do best, innovate deeply in their core strength, and deliver more value to customers.

This focus is highly impactful:

1. Vendors avoid spreading themselves too thin and losing focus on their differentiating strengths.
2. Deep specialization drives innovation, which can grow the total addressable market (TAM) by creating new value propositions for customers. Instead of competing in a red ocean of undifferentiated engines, innovation opens new opportunities for growth and increases ARR.

Think of it like construction: you don't rely on one tool to hammer nails, drill holes, and move tons of soil. You use specialized tools—hammers, drills, excavators—each optimized for a specific task.

Or consider tires: you can design one that works "okay" for both summer and winter. But in the mountains, or on a construction site, that compromise can slow you down—or even cause a failure. Specialized tools win in the real world.

Iceberg enables this modular, best-of-breed approach in the data world. Vendors can innovate in their domain without trying to cover everything, and customers can compose the right combination of engines for their needs. In short, Iceberg shifts the focus from "do-it-all" products to real specialization, innovation, and sustainable growth.

## Critique of the Old Model — Why Vertical, "Jack of All Trades" Query Engines No Longer Fit

The classic approach to query engines was vertical and monolithic: one tool that claimed to do everything—batch processing, low-latency analytics, ML prep, governance, and cost optimization. In other words, a "Jack of all trades."

This model made sense when integration and data migration were painful, and when standardization was scarce. Customers had no choice but to adopt a single stack and hope it covered most use cases.

But today, data challenges are multi-dimensional and highly diverse. Workloads vary dramatically, governance requirements differ, and performance expectations are no longer one-size-fits-all. Trying to make a single query engine excel at every scenario inevitably leads to compromises:

- Features become bloated but shallow.
- Performance may be good in one scenario but mediocre in another.
- Costs may rise as the tool tries to do everything.

Worse, vendors in this model often think like monopolists. In the short term, this can create predictable revenue streams and lock-in advantages. But in the mid and long term, it has several negative effects:

1. Reduced customer flexibility – Customers can't innovate freely or adopt tools optimized for specific workloads.
2. Slower vendor innovation – Spreading development resources across a bloated stack means none of the features truly excel.
3. Stifled ecosystem growth – By locking users into a single stack, the vendor limits third-party integrations and complementary innovations.
4. Market vulnerability – Historically, monopolistic products often lose relevance when standards emerge or modular competitors enter. Examples include proprietary database systems losing ground to open SQL engines, or closed analytic suites giving way to modular cloud ecosystems.

The vertical, all-in-one model cannot keep up with modern, modular architectures. Open formats like Iceberg allow customers to mix and match engines, letting each tool focus on its strengths. This approach improves efficiency, lowers risk, and creates space for innovation in every specialized area.

In short: monopolistic thinking in vertical query engines limits both customer value and long-term vendor growth. The future lies in modular, best-of-breed architectures.

## Closing — Iceberg Enables a Modular Future

Iceberg is more than just a table format—it's a catalyst for a modular, best-of-breed data ecosystem. By unbundling storage, query engines, and the control plane (REST catalog), it empowers both customers and vendors to operate in ways that were previously impossible.

For customers, Iceberg removes lock-in and heavy migration burdens. They can focus on business outcomes, pick the query engines that best serve each use case, and compose a stack optimized for their specific workloads. Experimentation is safe, switching is feasible, and innovation becomes a practical choice rather than a risky gamble.

For vendors, Iceberg removes the pressure to be a "Jack of all trades" and frees them to focus on their differentiating strengths. Specialization drives deeper innovation, improves product quality, and expands the total addressable market by creating new value propositions. No longer constrained by red-ocean competition on price alone, vendors can grow sustainably and thrive in a modular ecosystem.

In short, Iceberg reshapes the data landscape: it turns monolithic, do-it-all query engines into modular, specialized tools; it shifts decision-making from vendor lock-in to customer choice; and it transforms the market from zero-sum competition into a space for real innovation and growth.

The future is modular. The future is specialized. The future is Iceberg.
