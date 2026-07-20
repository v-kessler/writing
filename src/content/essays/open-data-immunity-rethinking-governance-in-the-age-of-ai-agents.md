---
title: "Open Data Immunity: Rethinking Governance for the Age of AI Agents"
description: "Open file formats and open compute are not enough. Governance must be portable, auditable, and enforced at agent speed. Introduces Open Data Immunity for the AI-agent lakehouse."
publishDate: 2026-02-18
tags: ["data-governance", "apache-iceberg", "ai-agents", "lakehouse", "security"]
series: "Agnostic Data"
draft: false
canonicalURL: "https://www.linkedin.com/pulse/open-data-immunity-rethinking-governance-age-ai-agents-vakamo-com-y2c6e/"
---

Every data architect I know is obsessed with Apache Iceberg. We argue over partition evolution, sub-second query performance in StarRocks, or federated access patterns with Trino. We are building a high-performance body.

But we are building it without an immune system. And in the age of AI agents, an immunocompromised data stack is not a technical debt problem — it is an operational liability.

## The "Open" Illusion: A Proprietary Filling

We talk extensively about Open Data Architecture, but a closer inspection reveals a familiar pattern: open layers on the outside, proprietary logic in the middle.

- Open Storage: S3, Azure Blob
- Open File & Table Formats: Parquet, Apache Iceberg
- Open Compute: Trino, StarRocks, DuckDB, Clickhouse
- The Proprietary Filling: Access control, policy enforcement, and governance

Governance is consistently treated as a plug-in — something bolted on after the "real" architecture is designed. In a world where human analysts run queries on a schedule, this is tolerable. In a world where AI agents autonomously traverse your data graph at scale, it is systemic organ failure.

## Why Your Architecture Is Immunocompromised

Traditional RBAC and proprietary catalogs that fail to implement open governance standards function like firewalls: rigid perimeter defenses that assume the threat is always external. Once a compromised credential or an over-privileged agent is inside, the perimeter offers nothing. And when your catalog doesn't expose governance primitives through standardized interfaces, your access control logic becomes unreachable to external policy engines, unauditable by standard tooling, and unenforced across heterogeneous compute engines.

Three specific failure modes define the immunocompromised stack:

**Autoimmune Drift.** Security logic is manually reconstructed in multiple SQL dialects across multiple engines. When Trino grants access to a resource that StarRocks denies — for the same user, against the same underlying data — your Single Source of Truth has developed an autoimmune disorder. The inconsistency is not a bug in one engine; it is a structural flaw in how policy is distributed.

**The Logic Tax.** When access control logic lives inside a proprietary vendor's UI you do not own your architecture — you lease it. Migrating, auditing, or extending that logic requires buying access to the vendor's tooling. That is a tax on your own data.

**The AI Scaling Wall.** Human analysts wait for manual approval workflows. AI agents do not. They execute hundreds of queries in the time it takes a governance team to review one request. A policy model that depends on human-in-the-loop enforcement has no answer for this. The immune system needs to operate at the speed of the agent — neutralizing unauthorized requests in milliseconds, not minutes.

## The Threat Model: What Are We Defending Against?

Before designing defenses, we need to formalize the adversary. In an AI-agent-driven lakehouse, the threat model has expanded beyond traditional data warehouse concerns:

**Compromised Compute Engine.** An attacker gains code execution in a query engine (Trino, Spark) and attempts to bypass catalog authorization by directly accessing S3. Traditional "God-mode" storage access makes this trivial.

**Malicious or Compromised Agent.** An AI agent's credentials are stolen or the agent itself is subverted to exfiltrate data outside its authorization scope. The agent executes hundreds of queries before detection.

**Credential Replay Attack.** An attacker captures STS credentials from one query and attempts to reuse them for unauthorized data access in a different context or time window.

**Policy Drift Exploitation.** An attacker discovers that Trino and StarRocks interpret the same policy differently, and exploits the inconsistency to access data denied by one engine but allowed by another.

**Snapshot Tampering.** An attacker with catalog access attempts to modify Iceberg snapshots or manifests to expose data outside the authorized file set.

**Cross-Region Exfiltration.** An agent authorized for Region A data attempts to access Region B files by manipulating query predicates or exploiting overly broad S3 credentials.

The traditional perimeter model has no answer for these threats once the attacker is "inside." Open Data Immunity requires defenses that operate at each layer.

## The Trusted Compute Paradigm

The legacy model operates on an implicit assumption: the compute engine has broad, "God-mode" access to storage and is trusted to filter appropriately at query time. We accept this because the engine is managed software running in our own infrastructure. But that assumption breaks down the moment the compute layer becomes dynamic — when engines are ephemeral, agents are autonomous, and the blast radius of an over-privileged query is measured in data exfiltration, not wrong query results.

The Trusted Compute model inverts this. The compute engine — whether StarRocks, Trino, or anything else — is treated as a guest, not an administrator. It receives only the data it is explicitly authorized to access for a specific query, and that authorization is cryptographically proven, not assumed.

The Iceberg REST Catalog becomes the enforcer in this model. But enforcement goes well beyond a simple yes/no access gate.

## The Enforcement Gap: Where the Hard Problem Lives

Authorization logic is difficult to define. Mapping complex business rules — row-level security, column masking, cross-domain access conditions — into a policy language like Cedar requires significant engineering investment. But even once the logic is correctly defined, enforcement is a harder problem than authorization.

Consider a concrete example: you define a column masking rule in Cedar that says analysts in Region A cannot see raw PII in the customer_email field. How do you guarantee that StarRocks and Trino execute that masking identically, without relying on each engine's native, engine-specific implementation?

The honest answer today is that you largely cannot — not without either accepting vendor lock-in (AWS Lake Formation, Unity Catalog) or manually re-implementing the logic in each engine's SQL dialect, which is both error-prone and operationally unsustainable.

This is the real frontier. Three architectural directions are emerging to close the gap:

**Catalog-Driven UDFs: A Potential Future Solution.** One promising direction is for the Iceberg Catalog to serve portable UDF definitions that Trusted Compute engines could pull and apply locally during query execution. This would allow the policy definition and the policy implementation to live in the same place, version-controlled and engine-agnostic. However, this capability does not exist today - no standard currently defines how catalogs should expose UDFs or how engines should consume them in a portable way. The work to establish such a standard, and the engine modifications required to honor it, represent significant open problems in the space.

**Metadata-Level Redaction.** Sensitive column enforcement should not wait until a compute engine scans actual data. The immune system must operate at the Manifest level — redacting sensitive columns from the Iceberg snapshot before the engine ever sees the schema. If an agent is not authorized to observe that a column exists, it should not appear in the schema returned from the catalog.

**Predicate Pushdown at the Metadata Layer.** Row-level security must be injected at the Metadata Filtering stage, not at query execution. If a user is not permitted to access records tagged Region: EMEA, the Parquet files containing those records should not appear in the Iceberg snapshot served to the engine at all. The row exclusion should be structural, not a filter applied at scan time, which an improperly configured engine could bypass.

## The Cryptographic Contract: JWT, Credential Vending, and the Trusted Handshake

The mechanism that makes Trusted Compute operational — rather than theoretical — is the combination of identity injection, short-lived credential vending, and a cryptographically enforced query contract. Each component plays a specific role:

**Identity Injection via JWT.** Every query context carries a signed JWT issued by your identity provider. The token encodes the caller's identity claims: team membership, data classification clearance, regional scope, and any other attributes relevant to your policy model. The Iceberg REST Catalog validates the JWT before any catalog interaction proceeds. This is not a session cookie — it is a machine-verifiable, tamper-evident statement of who is asking and what they are permitted to do.

**Credential Vending: Scoped, Short-Lived, and Specific.** Once the catalog has validated the JWT and evaluated the relevant policies, it does not hand the compute engine a set of long-lived S3 credentials with broad bucket access. Instead, it vends ephemeral, scoped credentials — generated via AWS STS AssumeRole or equivalent — that grant access to precisely the set of Parquet files the authorized query requires, for a TTL measured in minutes. An agent that extracts those credentials from one query cannot reuse them for a different data set or a later query. The credential itself enforces scope.

The engineering implications of this are significant. It means your credential vending logic must be tightly coupled to your policy evaluation — the catalog must know which specific manifest files are in scope before it can generate correctly scoped credentials. This requires the catalog to perform policy-aware manifest resolution, not just pass through a snapshot.

**The Trusted Handshake: A Query Contract.** Beyond credentials, the catalog provides the compute engine with a structured contract for the query: the set of required predicates (row-level filters that must be applied), the set of UDFs that must wrap specified columns (masking functions), and a cryptographic commitment to the snapshot the engine is operating against. A Trusted Compute engine is expected to apply this contract faithfully and — in a fully realized model — to return a signed attestation that it did so.

Token scope, expiry, and revocation each introduce operational complexity that should be addressed explicitly in any implementation:

- **Scope:** Credentials should be scoped to file-level granularity where possible, not bucket or prefix. Overly broad scoping partially defeats the purpose.
- **Expiry:** TTLs should be short enough to limit the damage from a leaked credential but long enough to survive the duration of a legitimate long-running query. A reasonable starting point for most workloads is 15–60 minutes, tuned to your p99 query duration.
- **Revocation:** STS-vended credentials can be revoked before expiry through IAM policy conditions (such as aws:TokenIssueTime to invalidate sessions issued before a specific timestamp) or by modifying role trust policies. However, these mechanisms affect all sessions using that role, not individual credential sets. The practical approach is to keep TTLs short (15-60 minutes), use unique roles per service/agent where blast radius matters, and design agents to vend fresh credentials per logical task rather than caching credentials across operations.

## The Evolution Beyond Centralized Enforcement

Earlier governance systems, e.g. Apache Ranger and AWS Lake Formation were designed for human-scale query volumes and centralized data platforms. In that context, routing all access decisions through a single enforcement point was operationally reasonable. The query volumes were manageable, compute engines were relatively static, and human review workflows could keep pace with access requests.

The AI agent era changes the scale and autonomy assumptions those systems were built around. When agents execute hundreds of autonomous queries per minute, a centralized checkpoint becomes a bottleneck not because it is poorly designed, but because the volume exceeds what any synchronous enforcement model can handle. When compute engines are ephemeral and credentials must be short-lived, maintaining long-lived sessions in a centralized daemon introduces operational complexity that scales poorly.

The alternative is already operational. Lakekeeper, an open-source Iceberg REST Catalog implementation, demonstrates stateless, distributed defense in practice: no centralized enforcement daemon, no long-lived sessions, no broad credentials sitting in engine configuration. Each query interaction is independently authorized through JWT validation, credentials are scoped and vended per-request via STS, and authorization decisions are pushed down to the catalog layer where they can be enforced structurally. Critically, policies are defined in Cedar and managed as code in Git — making governance logic auditable, version-controlled, and portable across environments in the same way your table schemas are.

This is not an arbitrary architectural choice. The Iceberg REST Catalog is the only component in the lakehouse stack that can enforce this model because it sits at the unique intersection of metadata control, credential vending, and engine neutrality. The catalog controls which manifests and schemas engines receive. It vends the scoped S3 credentials that determine which files are physically accessible. It injects query contracts that engines must honor. It enforces structural redaction before engines see data. And critically, it remains engine-agnostic — every compute engine (Trino, StarRocks, Spark, DuckDB) must interact with the catalog to access Iceberg tables. No other component in the stack has this combination of authority and ubiquity. That is why Lakekeeper's implementation of open governance at the catalog layer is architecturally irreplaceable, not just one option among many.

What remains incomplete is the cross-engine enforcement layer — ensuring that the authorization decisions made by the catalog are honored identically by heterogeneous compute engines (Trino, StarRocks, Spark). The catalog can control file-level access and deny queries at the metadata layer, but catalog-driven column masking and row-level filtering that execute consistently across engines require further standardization. The foundational components exist: Iceberg REST Catalog primitives, STS credential vending, policy engines like Cedar or OPA, and compute engines being extended to consume catalog-issued contracts (UDFs). The integration patterns for portable enforcement are the active frontier.

## The Economic Case: Risk, Cost, and Operational Reality

The architectural arguments are compelling for engineers. But CTOs and CIOs evaluate platforms on risk reduction, cost predictability, and operational overhead. Open Data Immunity delivers measurable value on all three dimensions:

**Reduced Vendor Lock-In Cost.** When governance logic is trapped in proprietary systems, migration becomes prohibitively expensive. Every table, every policy, every access control rule must be manually re-implemented in the new vendor's format. With Cedar policies managed in Git and enforcement handled by an open catalog, governance becomes portable. The cost to switch compute engines or cloud providers drops from months of re-engineering to days of configuration.

**Audit Cost and Compliance Portability.** Regulatory audits require demonstrating who accessed what data, when, and why. When policies are scattered across engine-specific configurations and vendor UIs, assembling an audit trail is archeology. When policies are version-controlled in Git and authorization decisions are logged by the catalog, the audit trail is a Git history and structured log query. Compliance frameworks (SOC 2, GDPR, HIPAA) evaluate your governance implementation once, and it applies across all environments because the implementation is portable code, not vendor-specific configuration.

**Reduced Policy Drift Incidents.** Policy drift — where different engines grant different access to the same data — is not just a theoretical risk. It is a production incident waiting to happen. Every drift incident requires engineering time to diagnose, security review to assess exposure, and operational overhead to remediate. Centralizing policy evaluation in the catalog and enforcing it structurally eliminates an entire class of production incidents. The operational cost savings compound over time.

**Reduced Blast Radius.** When an agent or credential is compromised, the damage is limited by how much data that credential can access. Long-lived, broadly scoped credentials (the default in legacy architectures) maximize blast radius. Scoped, ephemeral credentials vended per-query minimize it. The delta between "access to the entire bucket" and "access to 47 specific Parquet files for 15 minutes" is the difference between a contained incident and a breach that makes headlines.

**Lower Governance Team Overhead.** In legacy architectures, governance teams manually implement policies in multiple SQL dialects, troubleshoot inconsistencies between engines, and respond to access requests that require human approval. In the Open Data Immunity model, policies are defined once in Cedar, applied consistently by the catalog, and enforced automatically at query time. Governance teams shift from reactive firefighting to proactive policy development. The operational leverage is significant — the same team can govern 10x the query volume.

The economic argument is not about idealism. It is about risk-adjusted total cost of ownership. Open governance reduces lock-in premiums, lowers operational overhead, and contains incident blast radius. For organizations operating at scale, these are not marginal improvements. They are structural cost advantages.

## The Philosophical Shift: Where Trust Lives

The deeper shift is philosophical. Traditional governance models assume trusted compute, long-lived credentials, and human-paced access review. The AI agent era breaks those assumptions. Compute is ephemeral, credentials must be short-lived, and enforcement must operate structurally rather than procedurally. Open Data Immunity is less about adding new tools and more about redesigning where trust lives in the architecture.

In the earlier model, trust lived in the compute engine — we granted it broad access to storage and trusted it to filter appropriately. In the new model, trust lives in the catalog and the contracts it issues. The compute engine becomes a guest that must prove its authorization for each query, not an administrator with standing privileges.

This is not a criticism of earlier systems. It is recognition that the threat model has fundamentally changed. When query volumes were measured in thousands per day and initiated by identified humans, centralized enforcement was sufficient. When query volumes are measured in millions per day and initiated by autonomous agents, enforcement must be distributed, structural, and cryptographically verifiable.

## Building a Stack That Lives

The core argument is simple: if your governance policies are not as portable, auditable, and version-controlled as your Iceberg tables, your architecture is not truly open. Open file formats and open compute are necessary but insufficient. The access control layer determines whether the openness is real or illusory.

In the AI agent era, the threat model has changed. The volume of queries is higher, the autonomy of the requesting entity is greater, and the window for human review is effectively zero. A static perimeter is not a governance model for this environment. What is required is an adaptive, biological response — policy that travels with the data, enforcement that operates at the speed of the query, and identity verification that is cryptographic rather than assumed.

We started by asking whether we were building a high-performance body without an immune system. The answer is still yes for most data architectures today. But the foundation is operational: Lakekeeper demonstrates that catalog-driven authorization, Git-managed policies, and scoped credentials work in production. What remains is standardizing the cross-engine enforcement layer so that masking and filtering execute identically across Trino, StarRocks, and Spark.

Think of the modern lakehouse as a child building immunity. A newborn has no defenses — it relies entirely on external protection. Over time, through careful immunization, the child develops adaptive responses that operate at cellular speed without conscious intervention. The lakehouse is in that immunization phase now. Lakekeeper provides the first critical vaccines: JWT-based identity, scoped credentials, policy-as-code. But full immunity requires more — portable UDFs, metadata-level redaction, consistent predicate pushdown. Each advancement strengthens the system's ability to defend itself autonomously. We must continue to nurture and develop these defenses, because in the AI agent era, the lakehouse will face threats that move faster than any human can respond to.
