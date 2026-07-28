# Editorial Patterns

This document contains reusable editorial patterns used when writing technical articles.

These are **thinking patterns**, not templates.

Choose the pattern that best fits the topic rather than forcing every article into the same structure.

The goal is to help readers understand _why the topic matters_ before explaining _how it works_.

---

# Opening Patterns

The introduction determines whether readers continue reading.

A good opening does not explain the topic.

It creates curiosity by introducing an engineering problem, misconception, tradeoff, or observation.

Avoid generic openings such as:

> In today's rapidly evolving technology landscape...

> Software engineering is constantly changing...

> Whether you're a beginner or an experienced developer...

These introductions waste the reader's attention.

Instead, begin with something worth thinking about.

---

# Pattern 1 — Start With The Engineering Problem

## When to use

Use when the technology exists to solve a clear engineering problem.

Examples:

- Terraform State
- AGENTS.md
- Redis
- Kafka
- Feature Flags
- OpenTelemetry
- CQRS

## Why it works

People rarely care about a technology.

They care about the problem the technology solves.

Understanding the pain first makes the solution much easier to appreciate.

## Structure

Engineering problem

↓

Why current approaches fail

↓

Introduce the technology

↓

State the article's central thesis

## Example

Instead of:

> AGENTS.md is a Markdown file that provides instructions for AI coding agents.

Write:

> AI coding agents are remarkably good at writing code. What they struggle with is understanding how your team expects code to be written. Build commands, architectural boundaries, testing workflows, and repository conventions are rarely obvious from source code alone. AGENTS.md exists to make that hidden knowledge explicit.

The reader now understands why the technology exists before learning what it is.

## Common mistakes

Avoid describing the solution before explaining the problem.

Avoid inventing artificial problems that engineers rarely encounter.

---

# Pattern 2 — Challenge A Misconception

## When to use

Use when the topic is widely misunderstood.

Examples:

- Clean Architecture
- Microservices
- Kubernetes
- SOLID
- AI Coding Agents
- Event Sourcing

## Why it works

Readers enjoy discovering that something they believed is incomplete or incorrect.

Correcting misconceptions creates memorable learning moments.

## Structure

Common belief

↓

Explain why it is incomplete

↓

Introduce a better perspective

↓

State the article's thesis

## Example

Instead of:

> Kubernetes is a container orchestration platform.

Write:

> Many teams believe Kubernetes solves scaling. In reality, Kubernetes solves standardization. Scaling is only one consequence of that design. Understanding this distinction changes how you evaluate whether Kubernetes is appropriate for your system.

The article immediately becomes about engineering decisions rather than definitions.

## Common mistakes

Do not manufacture controversial opinions simply to attract attention.

Challenge ideas only when there is meaningful engineering reasoning behind them.

---

# Pattern 3 — Start With An Observation

## When to use

Use when the topic reflects a broader industry trend.

Examples:

- AI-assisted development
- Platform engineering
- Internal developer platforms
- Observability
- DevSecOps
- GitOps

## Why it works

Readers naturally become curious when they recognize something they have already experienced.

An observation creates familiarity before introducing deeper analysis.

## Structure

Interesting observation

↓

Why it matters

↓

Underlying engineering problem

↓

Central thesis

## Example

> A few years ago, most developers used AI to autocomplete code. Today, many teams ask AI to review pull requests, refactor services, generate migrations, and even explore entire repositories. The challenge is no longer whether AI can write code. The challenge is helping AI understand the context in which that code should be written.

The observation smoothly introduces the article's real subject.

## Common mistakes

Avoid observations that are too broad or too obvious.

Readers should feel that the observation leads somewhere meaningful.

---

# Pattern 4 — Start With A Tradeoff

## When to use

Use when the article focuses on architectural decisions.

Examples:

- Monolith vs Microservices
- REST vs GraphQL
- PostgreSQL vs MongoDB
- Terraform vs Pulumi
- Docker Compose vs Kubernetes

## Why it works

Experienced engineers rarely look for "the best" technology.

They look for the right tradeoff.

Starting with the tradeoff immediately signals that the article values engineering judgment.

## Structure

Decision

↓

Competing priorities

↓

Hidden tradeoff

↓

Article thesis

## Example

> Choosing GraphQL over REST is rarely about reducing endpoints. More often, it is a decision about where complexity should live. GraphQL moves complexity from the client-server contract into the server implementation. Whether that tradeoff is worthwhile depends far more on your organization than on the protocol itself.

The introduction teaches readers how to think before discussing implementation.

## Common mistakes

Avoid presenting one side as universally correct.

Tradeoffs exist because both options have strengths.

---

# Pattern 5 — Start With A Simple Mental Model

## When to use

Use when the topic is conceptually difficult.

Examples:

- Terraform State
- DNS
- Virtual Threads
- Event Streaming
- Kubernetes Controllers
- Message Brokers

## Why it works

A good mental model reduces cognitive load before technical details appear.

Readers understand complex systems much faster when they first receive a useful abstraction.

## Structure

Simple analogy

↓

Limitations of the analogy

↓

Transition into the real system

↓

Article thesis

## Example

> Think of Terraform State as an inventory rather than a deployment script. Terraform is less interested in how resources were created than in what currently exists. That inventory becomes the foundation for every future decision Terraform makes.

Readers now have a framework for interpreting everything that follows.

## Common mistakes

Avoid analogies that become inaccurate later in the article.

A mental model should simplify the topic, not distort it.

---

# Choosing The Right Opening

Not every introduction should use the same pattern.

As a general guideline:

| Article Type     | Recommended Opening |
| ---------------- | ------------------- |
| Deep Dive        | Engineering Problem |
| Best Practices   | Misconception       |
| Architecture     | Tradeoff            |
| Comparison       | Tradeoff            |
| Production Guide | Observation         |
| Migration        | Engineering Problem |
| Opinion          | Misconception       |
| Fundamentals     | Mental Model        |

The opening should naturally lead readers toward the article's central thesis.

Do not choose a pattern simply because it sounds dramatic.

Choose the one that best helps readers understand why the topic matters.

# Article Flow Patterns

A great article is not a collection of sections.

It is a progression of ideas.

Readers should feel that each section naturally creates the need for the next one.

Avoid writing articles that resemble documentation:

Definition

↓

Features

↓

Examples

↓

Summary

Instead, every article should tell the story of an engineering idea.

---

# Pattern 1 — Problem → Solution

## When to use

Use when the technology was created to solve a specific engineering problem.

Examples:

- Terraform
- Redis
- Kafka
- AGENTS.md
- OpenTelemetry
- Flyway

## Flow

Problem

↓

Why existing solutions become insufficient

↓

Introduce the new approach

↓

Explain how it works

↓

Tradeoffs

↓

Production guidance

↓

Decision framework

## Why it works

Readers naturally understand solutions once they appreciate the problem.

Without the problem, implementation details feel arbitrary.

---

# Pattern 2 — Misconception → Better Mental Model

## When to use

Use when engineers commonly misunderstand the topic.

Examples:

- Clean Architecture
- Microservices
- Kubernetes
- SOLID
- AI Coding Agents

## Flow

Common belief

↓

Explain why it is incomplete

↓

Introduce a better mental model

↓

Explain consequences

↓

Production implications

↓

Decision framework

## Why it works

Changing how readers think creates longer-lasting learning than teaching another API.

---

# Pattern 3 — Observation → Principle

## When to use

Industry trends.

Architecture evolution.

New tooling.

Examples:

- AI Engineering
- Platform Engineering
- Internal Developer Platforms
- GitOps

## Flow

Interesting observation

↓

Identify the underlying pattern

↓

Explain the engineering principle

↓

Discuss tradeoffs

↓

Apply to production

## Example

Observation:

AI agents are becoming better at writing code.

Principle:

The bottleneck is shifting from code generation to context engineering.

The article becomes much deeper than simply introducing another tool.

---

# Pattern 4 — Evolution

## When to use

When explaining why a technology exists.

Examples:

- Containers
- Kubernetes
- Infrastructure as Code
- CI/CD
- GraphQL

## Flow

Previous generation

↓

Its limitations

↓

New solution

↓

New tradeoffs

↓

Modern best practices

## Why it works

Readers understand evolution much better than isolated technologies.

---

# Pattern 5 — Decision Guide

## When to use

Architecture articles.

Comparison articles.

Technology evaluation.

Examples:

- REST vs GraphQL

- Terraform vs Pulumi

- Spring MVC vs WebFlux

- PostgreSQL vs MongoDB

## Flow

Decision

↓

Evaluation criteria

↓

Tradeoffs

↓

Situations where A wins

↓

Situations where B wins

↓

Engineering recommendation

Never answer:

Which is better?

Answer:

When should each be used?

---

# Pattern 6 — Internal Mechanism

## When to use

Deep dives.

Examples:

- Terraform State

- JVM

- Kafka

- Kubernetes Scheduler

- DNS

## Flow

Problem

↓

Mental model

↓

Internal architecture

↓

Lifecycle

↓

Failure modes

↓

Production considerations

Readers should finish understanding both:

How it works

and

Why it was designed this way.

---

# Pattern 7 — Best Practices

## When to use

Operational articles.

Examples:

- AGENTS.md

- Terraform

- Spring Boot

- Docker

- Git

## Flow

Why best practices exist

↓

Underlying engineering principle

↓

Recommended practice

↓

Tradeoffs

↓

Common mistakes

↓

Production checklist

Avoid producing long checklists without explaining the reasoning behind each recommendation.

---

# Pattern 8 — Migration

## When to use

Migration guides.

Examples:

- Spring Boot 2 → 3

- Java 17 → 21

- Terraform → Terragrunt

## Flow

Why migrate

↓

Compatibility concerns

↓

Migration strategy

↓

Common failures

↓

Production rollout

↓

Rollback strategy

Migration articles should reduce engineering risk.

---

# Pattern 9 — Production Deep Dive

## When to use

Advanced topics.

Examples:

- Observability

- Distributed Transactions

- Event Sourcing

- Multi-tenancy

## Flow

Engineering problem

↓

Architecture

↓

Tradeoffs

↓

Failure modes

↓

Operational concerns

↓

Lessons learned

Production articles should always discuss failure.

Systems become interesting when they stop working.

---

# Pattern 10 — Framework

Some articles should leave readers with a reusable framework rather than a conclusion.

Examples:

How to evaluate a caching solution.

↓

Latency

Consistency

Operational complexity

Cost

Failure recovery

Instead of saying:

Use Redis.

Teach readers:

How to decide whether Redis is appropriate.

---

# Choosing The Right Flow

Do not force every topic into the same structure.

Use the flow that best supports the article's central argument.

| Article Type   | Recommended Flow     |
| -------------- | -------------------- |
| Deep Dive      | Internal Mechanism   |
| Fundamentals   | Problem → Solution   |
| Best Practices | Best Practices       |
| Comparison     | Decision Guide       |
| Migration      | Migration            |
| Opinion        | Misconception        |
| Architecture   | Decision Guide       |
| Production     | Production Deep Dive |

The flow exists to strengthen the editorial direction.

Not every section must appear.

Remove sections that do not support the central thesis.

---

# Section Progression

A reader should never ask:

Why am I reading this section?

Each section should naturally create the need for the next.

A useful progression is:

Problem

↓

Context

↓

Insight

↓

Explanation

↓

Tradeoffs

↓

Production

↓

Decision Framework

↓

Conclusion

Avoid:

Definition

↓

Features

↓

Examples

↓

Summary

The second structure resembles documentation.

The first resembles thoughtful engineering writing.

---

# Information Density

Every section should either:

- introduce a new idea
- deepen an existing idea
- connect two ideas
- improve engineering judgment

Avoid sections that merely restate information using different words.

Readers should consistently feel they are learning something new.

---

# Editorial Compression

Before finalizing an article, ask:

Can two sections become one?

Can one paragraph replace three?

Can this example teach more effectively?

Can this explanation become a diagram?

The best articles rarely feel long because every section contributes something valuable.

Always optimize for insight density rather than word count.

# Mental Models & Engineering Insight Patterns

Great technical articles are memorable because they teach readers a better way to think.

Facts are forgotten.

Mental models are reused.

Whenever possible, teach readers a reusable model they can apply beyond the current topic.

The goal is not to help readers solve today's problem.

The goal is to help them solve future problems.

---

# Mental Model 1 — Hidden Complexity

## When to use

Use when a technology appears simple but hides significant complexity.

Examples:

- Kubernetes
- Kafka
- Terraform
- GraphQL
- Event Sourcing

## Structure

What appears simple

↓

Where the complexity actually lives

↓

Why the tradeoff exists

↓

Engineering lesson

## Example

GraphQL does not eliminate API complexity.

It relocates complexity from the client-server contract into schema design, query planning, caching, authorization, and observability.

The lesson is larger than GraphQL:

Engineering rarely removes complexity.

It moves complexity somewhere else.

Whenever a new technology promises simplicity, ask:

> Where did the complexity go?

---

# Mental Model 2 — Explicit vs Implicit

## When to use

Whenever comparing designs.

Examples:

- Dependency Injection
- Terraform State
- AGENTS.md
- Type Systems
- Configuration Management

## Structure

Implicit behavior

↓

Explicit behavior

↓

Tradeoffs

↓

Engineering decision

## Example

AGENTS.md does not create engineering standards.

It makes existing standards explicit.

Software systems become easier to maintain as important assumptions become explicit.

Whenever evaluating a design, ask:

"What knowledge is currently implicit?"

Making it explicit often improves maintainability more than introducing another tool.

---

# Mental Model 3 — Shift, Don't Eliminate

Many engineering solutions do not eliminate work.

They relocate it.

Examples:

Containers

↓

Less environment inconsistency

↓

More orchestration complexity

Terraform

↓

Less manual infrastructure

↓

More state management

Microservices

↓

Less coupling

↓

More distributed systems problems

GraphQL

↓

Less endpoint management

↓

More schema governance

Teach readers to ask:

"What new responsibility replaces the old one?"

---

# Mental Model 4 — Local Optimization vs System Optimization

Many engineering decisions optimize one component while harming the overall system.

Examples:

Adding caching

↓

Lower latency

↓

Higher consistency complexity

Adding microservices

↓

Independent deployments

↓

Higher operational cost

Adding abstractions

↓

Cleaner APIs

↓

Harder debugging

Always discuss the system impact rather than only the local improvement.

---

# Mental Model 5 — Constraints Shape Architecture

Architecture is rarely driven by preferences.

It is driven by constraints.

Common constraints include:

- team size
- release frequency
- latency
- compliance
- cost
- scalability
- operational maturity

Whenever recommending a technology, explain which constraints justify it.

Different constraints lead to different "best" solutions.

---

# Mental Model 6 — Optimize For The Bottleneck

Many articles optimize the wrong thing.

Examples:

Before optimizing queries

↓

Measure where time is actually spent.

Before introducing Kubernetes

↓

Identify whether deployment is truly the bottleneck.

Before introducing CQRS

↓

Confirm whether read/write scaling is actually the problem.

Optimization without identifying the bottleneck usually increases complexity.

---

# Mental Model 7 — Every Abstraction Has A Cost

Abstractions create leverage.

They also create distance from reality.

Examples:

ORM

↓

Less SQL

↓

Harder query optimization

Framework

↓

Less boilerplate

↓

More framework knowledge

Shared library

↓

Code reuse

↓

Coupling

Whenever introducing an abstraction, discuss both the leverage it provides and the complexity it introduces.

---

# Mental Model 8 — Optimize For Change

Good architecture is not optimized for today's requirements.

It is optimized for tomorrow's changes.

Examples:

Interfaces

↓

Support changing implementations.

Feature flags

↓

Support gradual rollout.

Terraform modules

↓

Support infrastructure growth.

The real question is rarely:

"Does this solve today's problem?"

It is:

"Does this make tomorrow's changes easier?"

---

# Mental Model 9 — Information Flow

Many technologies exist to improve information flow rather than computation.

Examples:

Logging

↓

Information

Metrics

↓

Aggregation

Tracing

↓

Relationships

Events

↓

Communication

AGENTS.md

↓

Repository knowledge

Understanding what information flows through a system often explains its architecture better than understanding its APIs.

---

# Mental Model 10 — Feedback Loops

Healthy engineering systems create feedback.

Examples:

CI

↓

Immediate validation

Tests

↓

Behavior verification

Code review

↓

Knowledge sharing

Observability

↓

Production feedback

AGENTS.md

↓

Repository guidance

Whenever discussing tooling, explain which feedback loop it improves.

---

# Engineering Insight Patterns

The best articles include at least one engineering insight.

An engineering insight is not a fact.

It is a way of seeing the problem differently.

Examples:

Instead of:

Terraform manages infrastructure.

Write:

Terraform manages desired state.

Infrastructure creation is only one consequence.

---

Instead of:

Kubernetes orchestrates containers.

Write:

Kubernetes continuously reconciles reality with the desired state.

Scheduling containers is merely one implementation detail.

---

Instead of:

AGENTS.md stores instructions.

Write:

AGENTS.md externalizes engineering knowledge that previously existed only inside the team.

The file matters because it changes how repository knowledge is transferred.

---

# Decision Framework Pattern

Readers should finish with a reusable decision framework.

Examples:

Instead of:

Use Redis.

Teach:

Consider:

- latency
- consistency
- operational complexity
- persistence
- failure recovery
- cost

Then decide.

---

Instead of:

Use GraphQL.

Teach:

Evaluate:

- client flexibility
- caching
- tooling
- schema governance
- team expertise

Then choose.

Decision frameworks continue creating value long after implementation details become outdated.

---

# Strong Conclusion Pattern

Avoid ending articles with summaries.

Readers already know what they have read.

Instead:

Reconnect to the central thesis.

Reinforce the most important engineering insight.

Leave readers with a reusable way of thinking.

Good conclusions answer:

"So what?"

Examples:

"This isn't really an article about AGENTS.md.

It's an article about making engineering knowledge explicit."

or

"Terraform isn't valuable because it provisions infrastructure.

It's valuable because it lets teams reason about infrastructure as code."

The final paragraph should leave readers thinking rather than merely finishing.

---

# The Editorial Test

Before publishing, ask:

If readers forget every command...

every API...

every configuration example...

what idea will they still remember?

If there isn't one clear answer, strengthen the article.

Great technical writing teaches engineers how to think.

The technology is simply the vehicle.

# Storytelling Patterns

Technical writing is not fiction.

However, every great technical article still tells a story.

The story is not about people.

It is about ideas.

Readers should feel that each section naturally creates curiosity for the next.

The goal is to reduce cognitive effort while increasing understanding.

Never write articles that feel like independent sections stitched together.

Every article should have narrative momentum.

---

# Pattern 1 — Build Curiosity

Do not answer every question immediately.

Reveal information gradually.

Good writing creates small unanswered questions that naturally encourage readers to continue.

Instead of:

Terraform uses a State file.

Write:

Terraform appears to know which infrastructure should be created, updated, or destroyed.

But how?

That question naturally leads into the next section.

Curiosity is created by delaying explanations—not by hiding information.

---

# Pattern 2 — Every Section Should Create The Next One

Readers should never wonder:

"Why am I reading this section?"

Each section should naturally introduce the next.

Example:

Problem

↓

Current approaches

↓

Their limitations

↓

New idea

↓

How it works

↓

Tradeoffs

↓

Production implications

↓

Decision framework

Every transition should answer the implicit question created by the previous section.

---

# Pattern 3 — Ask Better Questions

Questions are powerful when they expose uncertainty.

Weak questions:

- What is Kubernetes?
- What is Redis?

Strong questions:

- Why was Kubernetes designed this way?
- Why does Redis remain valuable despite modern databases?
- What engineering problem made this architecture necessary?
- What assumptions make this design successful?

The article should answer meaningful questions rather than obvious ones.

---

# Pattern 4 — Delay Definitions

Avoid defining terminology immediately.

Readers care more about problems than vocabulary.

Instead of:

"Terraform State is..."

First explain:

Why Terraform needs memory.

Only then introduce:

Terraform State.

Definitions become much easier to understand after motivation exists.

---

# Pattern 5 — Introduce One New Idea At A Time

Avoid introducing multiple unfamiliar concepts in one paragraph.

Poor progression:

Terraform

↓

State

↓

Providers

↓

Backends

↓

Resources

↓

Modules

↓

Outputs

↓

Variables

Better progression:

Terraform

↓

Desired State

↓

State File

↓

Resources

↓

Planning

↓

Execution

Each concept builds upon the previous one.

---

# Pattern 6 — Create Small "Aha" Moments

Readers remember discoveries more than explanations.

An article should contain several moments where readers think:

"I've never looked at it that way."

Examples:

Terraform doesn't primarily create infrastructure.

It reconciles desired state.

---

GraphQL doesn't reduce backend complexity.

It moves complexity elsewhere.

---

Microservices don't eliminate coupling.

They change where coupling exists.

These insights create memorable learning.

---

# Pattern 7 — Alternate Between Abstract And Concrete

Too much theory becomes exhausting.

Too many examples become shallow.

Alternate between:

Principle

↓

Example

↓

Principle

↓

Example

↓

Production

↓

Summary

Readers should constantly move between understanding and application.

---

# Pattern 8 — Increase Depth Gradually

Avoid beginning with implementation details.

Increase depth over time.

Example:

Problem

↓

Concept

↓

Mental model

↓

Architecture

↓

Implementation

↓

Production

↓

Failure modes

↓

Tradeoffs

Readers should never feel overwhelmed.

---

# Pattern 9 — Repeat The Central Thesis

The thesis should appear naturally throughout the article.

Not by repeating the same sentence.

But by reinforcing the same idea from different perspectives.

For example:

Opening:

AGENTS.md exists because repository knowledge is difficult to infer.

Middle:

Every recommendation reduces hidden repository knowledge.

Ending:

The real value of AGENTS.md is making implicit engineering knowledge explicit.

One idea.

Three perspectives.

---

# Pattern 10 — Finish With A Bigger Idea

Do not end by summarizing.

Instead, zoom out.

Connect the topic to a broader engineering principle.

Example:

"This article isn't really about AGENTS.md.

It's about making engineering knowledge transferable."

Readers should leave thinking about the principle rather than the technology.

---

# Paragraph Rhythm

Good technical writing has rhythm.

Alternate between:

Short paragraph

↓

Medium paragraph

↓

List

↓

Diagram

↓

Explanation

↓

Example

↓

Insight

Avoid long sequences of paragraphs with identical structure.

Variation improves readability.

---

# Information Pacing

Do not front-load information.

Distribute complexity throughout the article.

Early sections should create confidence.

Middle sections should provide depth.

Later sections should provide wisdom.

A useful progression is:

Understanding

↓

Knowledge

↓

Insight

↓

Judgment

---

# Transition Patterns

Avoid mechanical transitions such as:

- Next...
- Now...
- Finally...
- In conclusion...

Instead connect ideas naturally.

Examples:

"This raises another question..."

"That sounds reasonable until..."

"The tradeoff becomes clearer when..."

"Understanding this explains why..."

"At first glance this seems..."

"The interesting part isn't..."

Good transitions make articles feel continuous rather than segmented.

---

# Reader Engagement

Assume readers are intelligent but busy.

Earn their attention continuously.

Every few sections, introduce something unexpected:

- a misconception
- an engineering insight
- a surprising tradeoff
- an industry pattern
- a mental model
- a production lesson

Do not let readers feel they already know what comes next.

---

# The "One More Paragraph" Test

Before finishing an article, ask:

"Would an experienced engineer voluntarily read one more paragraph?"

If the answer is no:

The next paragraph probably doesn't deserve to exist.

---

# Storytelling Principle

Technical storytelling is not about drama.

It is about intellectual momentum.

Readers continue because every section creates a better question than the previous one.

The best technical articles do not merely transfer knowledge.

They continuously reward curiosity.

# Editorial Playbook

Great technical articles are rarely created in a single pass.

They are refined.

Professional technical writers spend as much time editing as writing.

Treat every first draft as incomplete.

Writing generates ideas.

Editing reveals the article.

---

# The Layering Principle

Do not try to achieve every objective in the same paragraph.

Instead, build the article in layers.

Layer 1

Technical correctness.

↓

Layer 2

Logical organization.

↓

Layer 3

Editorial clarity.

↓

Layer 4

Engineering insight.

↓

Layer 5

Reader experience.

Each editing pass should improve one layer without damaging another.

---

# Information Hierarchy

Not every idea deserves equal attention.

Organize information into three levels.

## Primary Ideas

The central thesis.

The engineering problem.

The reusable insight.

These ideas should appear multiple times throughout the article.

---

## Supporting Ideas

Tradeoffs.

Architecture.

Implementation.

Examples.

These strengthen the primary ideas.

---

## Reference Information

Commands.

Configuration.

APIs.

Links.

Examples.

These support understanding but should never dominate the article.

Readers remember primary ideas.

Reference information exists only to support them.

---

# One Paragraph, One Purpose

Every paragraph should have exactly one job.

Possible purposes include:

- introduce a problem
- explain a concept
- challenge a misconception
- provide evidence
- explain a tradeoff
- introduce an example
- connect two ideas
- reinforce the thesis

Avoid paragraphs that attempt to accomplish multiple unrelated goals.

---

# Build Toward Insight

Information alone rarely creates memorable articles.

Each major section should gradually increase understanding.

Useful progression:

Observation

↓

Explanation

↓

Insight

↓

Engineering lesson

↓

Reusable principle

Readers should continuously feel that they understand the topic more deeply than they did a few minutes ago.

---

# Avoid Predictable Structure

Readers quickly recognize formulaic writing.

Avoid repeating:

Definition

↓

Example

↓

Summary

↓

Next section

Instead vary the rhythm.

Examples:

Question

↓

Answer

↓

Tradeoff

↓

Production implication

or

Observation

↓

Misconception

↓

Mental model

↓

Architecture

Variation keeps readers engaged.

---

# Information Compression

Every sentence should justify its existence.

Whenever editing, ask:

Can this sentence become shorter?

Can two paragraphs become one?

Can one diagram replace five paragraphs?

Can one example explain three concepts?

Compression increases information density.

It should never reduce clarity.

---

# Editorial Escalation

Every few sections, increase the intellectual depth.

Example:

Start with:

"What does Terraform do?"

Progress toward:

"Why does Terraform require State?"

Eventually reach:

"What engineering assumptions make declarative infrastructure possible?"

Readers should feel that the discussion becomes increasingly valuable.

---

# Avoid Artificial Balance

Do not force every topic into a perfectly balanced discussion.

Some engineering decisions genuinely have stronger recommendations.

If one approach is usually preferable, explain why.

Still discuss:

- assumptions
- tradeoffs
- exceptions

Honest nuance is more valuable than artificial neutrality.

---

# Connect Sections

Sections should not exist independently.

Each should naturally answer the question created by the previous one.

Useful transitions include:

"This introduces another problem..."

"Understanding this explains why..."

"That design decision leads to..."

"The tradeoff becomes more obvious when..."

Transitions should create continuity rather than simply moving the reader forward.

---

# Use Contrast

Contrast improves understanding.

Examples:

Instead of explaining one solution in isolation, compare it with:

- the previous generation
- a common alternative
- a simpler approach
- a production implementation
- a common misconception

Contrast highlights why a design exists.

---

# Engineering Vocabulary

Prefer precise engineering language.

Instead of:

better

use:

more maintainable

Instead of:

faster

use:

lower latency

Instead of:

simple

use:

lower operational complexity

Instead of:

good architecture

use:

appropriate architecture for the stated constraints

Precision builds trust.

---

# Respect Reader Attention

Assume every paragraph costs attention.

Do not waste it.

Avoid:

- repeating previous ideas
- explaining obvious concepts
- unnecessary historical background
- feature lists without insight
- filler transitions

Every paragraph should reward the reader.

---

# The Bookmark Test

The highest compliment for a technical article is not:

"I finished reading it."

It is:

"I bookmarked it."

Before publishing, ask:

Would this article still be worth revisiting six months from now?

If not, strengthen the insights.

---

# The Share Test

Ask:

Why would an experienced engineer share this article with a teammate?

Possible answers:

- useful mental model
- excellent explanation
- production lesson
- reusable decision framework
- clarified misconception

If no clear answer exists, the article probably lacks sufficient editorial value.

---

# The Rewrite Rule

Never become attached to the first structure.

If a better flow appears while writing:

Rewrite.

If a stronger opening appears:

Rewrite.

If a clearer mental model appears:

Rewrite.

If a more memorable conclusion appears:

Rewrite.

Professional writing is iterative.

---

# Editorial North Star

The goal is not to produce the longest article.

The goal is not to produce the most comprehensive article.

The goal is not to produce the most SEO-optimized article.

The goal is to produce an article that an experienced software engineer reads and thinks:

"I understand this topic more clearly than I did before."

That is the standard every article should aim to achieve.
