---
title: "The 2025 State of the Apache Iceberg Ecosystem Survey Is Out — And There's a Lot to Unpack"
description: "A reaction to the 2025 State of the Apache Iceberg Ecosystem survey: Spark dominates, the catalog market is fragmented, and the next fight is the governance control plane."
publishDate: 2026-02-27
tags: ["apache-iceberg", "lakehouse", "data-governance", "lakekeeper", "survey"]
series: "Agnostic Data"
draft: false
canonicalURL: "https://www.linkedin.com/pulse/2025-state-apache-iceberg-ecosystem-survey-out-theres-lot-unpack-ybiae/"
---

## 📊 The 2025 State of the Apache Iceberg Ecosystem survey is out — and there's a lot to unpack.

But before I get into the data — a genuine thank you to the community. 🙏

Seeing Lakekeeper at 21% in this survey is not something we expected. On par with Apache Polaris. In a catalog market full of established names. You chose to build with us, test us, push us, and tell others. That number belongs to the community, not to us. Thank you.

## 👑 Let's start with what the data makes undeniable: Spark is king.

96.4% of respondents use Spark with Iceberg. Not dominant — king. Every other engine lives in a world where Spark sets the baseline. Trino at 60.7%, Flink at 32.1%, DuckDB at 28.6% — all real, all growing, but all operating in Spark's shadow. Iceberg is multi-engine by design, but Spark is where this ecosystem was built and where it still lives.

### 🔍 Other things worth noting:

1️⃣ AWS leads at 64.3%, but on-prem (28.6%) and multi-cloud (21.4%) are not edge cases — they're a real part of how people run this stuff

2️⃣ The catalog market is fragmented and nobody has won: Glue at 39.3%, Nessie at 28.6%, S3 Tables at 25%, Polaris and Lakekeeper both at 21.4%

3️⃣ Governance and optimization are what practitioners actually care about now — ACID guarantees are assumed, not a selling point

4️⃣ Materialized views (37%) and secondary indexes (22%) top the v4 wishlist — people want performance, not more format features

5️⃣ 51.9% give reliability a 4/5, but 29.6% only give it a 3/5 — good, not great, and worth being honest about

## 💬 A couple of things I'd push back on:

⚡ On Nessie and branching — the report links Nessie's 28.6% to "interest in branching workflows" and I think that conflates two different things. Branching is native to Apache Iceberg — it's built into the format via the Table API. You don't need Nessie for that. What Nessie actually adds is catalog-level branching: versioning across multiple tables at once. That's a much more specific capability.

🔎 On StarRocks and ClickHouse — StarRocks shows up at 17.9%, ClickHouse at 3.6%, and both get almost no coverage in the analysis. Frustrating, because the signal is clearly there. These engines are maturing fast on Iceberg REST catalog support and are starting to eat into the Trino/Spark query layer for high-concurrency, low-latency workloads. Next year's survey should dig into this properly.

## 🔭 Where this is all going: 2026 and 2027

This survey confirms Iceberg has won the format war. But the next fight is at a different layer — and most people haven't named it yet.

A catalog tells you where your tables are. That's step one, not the finish line.

What the ecosystem actually needs — and what AI is about to force — is a control plane. The layer that decides who can access what, from which engine, under which conditions, at which point in time. The thing that makes your lakehouse observable, auditable, and safe to hand to automated systems. AI agents don't ask permission. They query at scale, autonomously, across your entire data estate. The governance gaps teams have been kicking down the road are about to matter — a lot.

Lakekeeper is the control plane for that world. The 21% is a start. The real work starts now. 🚀

Great work by Alex Merced and Andrew Madson for pulling this together. 👏 This is the kind of community baseline we've needed.

ApacheIceberg DataLakehouse Lakekeeper OpenTableFormat DataEngineering Lakehouse DataGovernance AIData ControlPlane
