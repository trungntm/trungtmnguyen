# Editorial Principles

## Purpose

The purpose of every article is not merely to explain a technology.

The purpose is to help software engineers think more clearly, make better engineering decisions, and gain practical insights they can apply in real projects.

Every article should leave readers with at least one idea they are likely to remember long after they finish reading.

The best articles do not simply answer questions.

They change how readers think.

---

## Teach Ideas, Not Features

Documentation explains features.

Articles explain ideas.

Avoid writing articles that simply answer:

- What is it?
- What commands exist?
- What APIs are available?
- What configuration options does it support?

Instead, explain:

- Why does it exist?
- What problem does it solve?
- Why was it designed this way?
- What tradeoffs does it introduce?
- What assumptions does it make?
- When should engineers choose it?
- When should they avoid it?

Readers should finish the article understanding the reasoning behind the technology, not merely its functionality.

---

## Start with the Problem

Begin by introducing the engineering problem before introducing the solution.

Readers should first understand:

- what hurts
- why existing approaches are insufficient
- what engineering constraint exists

Only then introduce the technology, pattern, or practice.

People remember solutions much better when they first understand the problem they solve.

---

## Build Around One Big Idea

Every article should revolve around one central argument.

Before writing, clearly identify:

- the primary question the article answers
- the biggest insight readers should remember
- the engineering decision the article helps readers make

Every section should strengthen that central idea.

If a section does not contribute directly to the central argument, remove it.

A focused article is usually more valuable than a comprehensive one.

---

## Create Memorable Insights

Do not merely explain a topic.

Help readers see it differently.

Whenever appropriate, identify:

- the biggest misconception
- an unexpected tradeoff
- a useful mental model
- an engineering principle that extends beyond the current topic
- a reusable decision framework

The best technical articles change how readers think.

They do not simply increase what readers know.

Aim to include at least one insight that readers are likely to remember and reuse in future engineering decisions.

---

## Explain Why Before How

Implementation is important.

Understanding is more important.

Whenever introducing a solution, explain:

1. Why the solution exists.
2. Why simpler alternatives are insufficient.
3. Why this particular design was chosen.
4. Only then explain how it works.

Readers should understand the reasoning before the implementation details.

---

## Prefer Engineering Judgment Over Recipes

Avoid presenting technologies as universally correct.

Instead, explain the conditions under which a recommendation makes sense.

Discuss factors such as:

- team size
- project complexity
- operational maturity
- maintenance cost
- scalability
- security
- performance
- developer experience

The goal is to improve engineering judgment rather than provide rigid rules.

---

## Prefer Principles Over Rules

Instead of saying:

> Always do X.

Explain:

- why X is usually preferred
- when X becomes a poor choice
- what assumptions make X successful

Principles help readers solve future problems that differ from the examples shown in the article.

---

## Depth Over Breadth

Do not attempt to cover every aspect of a topic.

Depth comes from:

- explaining motivations
- exploring tradeoffs
- discussing production implications
- connecting related ideas
- examining failure modes
- explaining consequences

Depth does not come from writing longer articles.

A focused deep dive is usually more valuable than an exhaustive overview.

---

## Every Section Must Teach Something

Each major section should answer at least one meaningful question.

Examples:

- Why was this design chosen?
- What misconception does this correct?
- What engineering lesson does this reveal?
- What practical decision does this influence?
- What production issue does this prevent?

Avoid sections that merely define terminology or repeat documentation.

If removing a section would not reduce the reader's understanding, the section probably does not belong.

---

## Connect Ideas

The best technical articles do more than explain isolated topics.

Whenever appropriate:

- relate concepts to other technologies
- compare similar engineering decisions
- highlight recurring design patterns
- connect the current topic to broader software engineering principles

Readers should leave with reusable knowledge rather than isolated facts.

---

## Synthesize, Don't Summarize

Research tells you what is true.

Your job is to explain why it matters.

Do not simply present independent facts.

Look for opportunities to connect ideas.

Whenever appropriate:

- reveal hidden relationships
- connect concepts from different domains
- explain why multiple observations lead to the same conclusion
- relate implementation details to broader engineering principles
- show how one engineering decision influences another

Readers rarely remember isolated facts.

They remember meaningful connections.

A strong article should leave readers thinking:

> "I've never connected those ideas before."

---

## Show the Evolution of Ideas

Whenever appropriate, explain how an idea evolved.

Help readers understand:

- what came before
- why the previous approach became insufficient
- what engineering problem motivated the next approach
- what new tradeoffs appeared

Technologies rarely appear out of nowhere.

Most are responses to limitations in earlier solutions.

Understanding that evolution helps readers reason about future technologies instead of memorizing today's implementations.

---

## Build Understanding Gradually

Do not overwhelm readers with implementation details too early.

Whenever introducing a complex topic, progressively increase the level of abstraction.

A useful progression is:

- engineering problem
- intuition
- mental model
- architecture
- implementation
- production considerations
- tradeoffs
- decision framework

Readers should feel that each section naturally prepares them for the next.

Good technical writing reduces cognitive load by introducing one new idea at a time.

---

## Use Mental Models

Whenever possible, introduce a simple mental model that helps readers reason about the topic.

Examples include:

- comparisons
- analogies
- decision trees
- layered models
- responsibility boundaries
- lifecycle diagrams

A good mental model is often remembered longer than implementation details.

---

## Create Aha Moments

Every article should contain at least one moment where readers are likely to think:

> "I've never looked at it that way."

Good aha moments often come from:

- challenging a common assumption
- introducing a memorable analogy
- simplifying a complex concept
- revealing an unexpected tradeoff
- presenting a reusable engineering framework
- connecting two familiar ideas in a new way

Do not force cleverness.

Aha moments should emerge naturally from sound engineering reasoning.

A memorable insight is often more valuable than an additional page of explanation.

---

## Explain Tradeoffs Honestly

Every meaningful engineering decision involves tradeoffs.

Avoid presenting recommendations as universally beneficial.

Always discuss:

- advantages
- disadvantages
- operational costs
- maintenance implications
- scalability considerations
- situations where another approach is preferable

Engineering articles should improve decision-making rather than promote technologies.

---

## Prefer Production Thinking

Whenever practical, move beyond toy examples.

Discuss topics such as:

- deployment
- testing strategy
- observability
- maintainability
- scalability
- compatibility
- operational risk
- long-term ownership

Production thinking creates articles that remain valuable even as technologies evolve.

---

## Prefer Insight Over Information

More information does not automatically produce a better article.

Ask:

- Does this section help readers think differently?
- Does it improve engineering judgment?
- Does it introduce a reusable idea?
- Does it remove ambiguity?
- Does it help readers make better decisions?

If not, consider removing it.

---

## Stop Before Becoming a Handbook

A deep dive should be comprehensive enough to answer its central question.

It should not attempt to document everything.

Prefer:

- one excellent explanation
- one memorable insight
- one practical framework

over:

- exhaustive checklists
- encyclopedic coverage
- feature-by-feature descriptions

Leave readers wanting to explore further, not exhausted by unnecessary detail.

---

## Respect the Reader

Assume readers are intelligent software engineers.

Avoid:

- filler
- marketing language
- obvious statements
- unnecessary repetition
- generic advice

Every paragraph should earn its place.

Readers should consistently feel that continuing to the next section is worth their time.

---

## Think Like a Technical Author

Do not write like documentation.

Do not write like a tutorial unless the topic requires one.

Think like an experienced engineer helping another experienced engineer understand a difficult idea.

Your goal is not to answer every possible question.

Your goal is to explain the most important idea so clearly that readers can apply it to future problems they have never seen before.

---

## The Final Test

Before considering an article complete, ask:

- What is the single most valuable idea in this article?
- Will readers still remember that idea a week later?
- Does the article change how readers think about the topic?
- Does it improve engineering judgment?
- Does it contain at least one reusable mental model?
- Does it contain at least one practical decision framework?
- Does it contain at least one memorable insight?
- Could this article have been written by any generic AI assistant?

If the answer to the last question is **yes**, the article needs stronger insights before it is ready for publication.

The best technical articles are not remembered because they explain everything.

They are remembered because they permanently change how readers think about software engineering.
