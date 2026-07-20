---
title: "Did We Forget the Lake?"
description: "Structured tables get all the attention while 75% of data is unstructured. A case for a volume-centric lakehouse control plane to govern the unstructured Nebula."
publishDate: 2026-03-13
tags: ["lakehouse", "unstructured-data", "data-governance", "data-architecture"]
series: "Agnostic Data"
draft: false
canonicalURL: "https://www.linkedin.com/pulse/did-we-forget-lake-vakamo-com-dgo8e/"
---

*The Iceberg in the Room*

## The Iceberg in the Room

We are currently living through the "Iceberg Era." If you listen to any data architect today, the conversation is dominated by table formats. We are obsessed with bringing OLTP-like reliability to the OLAP world—perfecting the "House" with governance, ACID transactions, and structured schemas.

My bet: Apache Iceberg owns 80% of the analytics market by next decade. We are getting incredibly good at managing the structured slice of the pie.

But we are focused on the Iceberg and ignoring the Nebula around it.

## The 2 Yottabyte Shock

Let's look at the brutal math of 2035. We are sitting on roughly 150 Zettabytes of data today. By 2035, that number explodes to 2,000 Zettabytes—or 2 Yottabytes. That is 2,000,000,000 Petabytes. 2 Billion Petabytes.

If we break down that future:

1. The Structured Slice (25%): One-third lives in OLTP systems—the operational heartbeat. Two-thirds flows into OLAP—the Iceberg kingdom.
2. The Nebula (75%): 1.5 Billion Petabytes of unstructured data. Images, PDFs, sensor logs, video, and audio—expanding faster than anything we've built to manage it.

Currently, our Lakehouse architectures treat the Nebula as "dark data." We throw it into S3 buckets and forget it. We've spent five years building a beautiful House while the Lake rises by 1,000%.

## Why the Lakehouse is Failing the Nebula

A Lakehouse that only manages structured tables isn't a Lakehouse—it's just a scalable warehouse built on cheap storage. The Nebula suffers from three fundamental gaps:

- The Access Gap: We rely on messy IAM policies or long-lived keys instead of scoped, temporary access.
- The Context Gap: A folder of PDFs has no "owner," "classification," or "retention policy" attached to it.
- The Standard Gap: There is no universal way to discover a collection of files across different tools.

## The Vision: Moving to Managed Volumes

To handle 1.5 Billion Petabytes, we have to stop treating the Nebula as storage exhaust and start treating it as a First-Class Citizen. Platforms like Databricks Unity Catalog and AWS Lake Formation are already pointing in this direction—but the industry hasn't fully committed.

The next evolution of the Lakehouse won't be a better table. It will be a Volume-centric architecture—a control plane for the Nebula that provides:

- Logical Discovery: Accessing data through logical Volumes (e.g., finance/raw-logs) instead of brittle, hardcoded physical S3 paths.
- Vended Credentials: Short-lived, scoped tokens handed out automatically. No more leaked access keys—just-in-time security for every file.
- Unified Governance: If a SQL row can have an "Owner" and a "PII tag," a 50GB video file should have the same.

## The Bottom Line

If 75% of the world's data is unstructured, the Nebula is the main event. We cannot manage a 2 Billion Petabyte future with 2010-era folder structures.

It's time to stop decorating the House and start engineering the Lake. The gap between Iceberg tables and the unmapped Nebula is the most important problem in data architecture that nobody is talking about.
