# SDD Workflow Guide

Status: Adopted v1

This document explains how `dev-skills` applies SDD, or Spec-Driven Development, without adding a heavy runtime or a new state machine.

In this repo, SDD means:

> Stable artifacts define intent, scope, plan, tests, verification, and review criteria before AI-generated code is treated as done.

It is a workflow contract, not a promise that code can be regenerated entirely from specs.

---

## Why This Fits dev-skills

`dev-skills` already separates the development path into stable phases:

```text
design context -> spec -> plan -> implement / fix -> verify -> review -> commit -> finish
```

SDD gives those phases a clearer responsibility:

- `dev-spec` captures human intent before implementation.
- `dev-plan` turns aligned intent into a concrete implementation decision.
- `dev-tdd` and `dev-fix` turn requirements or bugs into executable proof.
- `dev-verify` checks completion claims against commands and requirements.
- `dev-code-review` checks the diff against the contract before commit.
- `dev-auto` recommends the next step but does not orchestrate hidden work.

The practical goal is to stop AI coding from becoming "generate first, explain later". The spec and plan become the shared reference for humans, the main agent, and any delegated agents.

---

## Adoption Levels

### 1. Spec-first

Use this for small or medium feature work.

```text
dev-spec -> dev-tdd -> dev-verify -> dev-code-review
```

The spec can be short. It must still name the goal, in scope, out of scope, assumptions, and acceptance criteria.

### 2. Spec-anchored

Use this for complex, risky, or multi-agent work.

```text
dev-spec -> dev-plan -> dev-tdd -> dev-verify -> dev-code-review
```

The spec and plan live under `.claude/artifacts/` and act as long-lived references for implementation, verification, review, and commit messages.

### 3. Spec-as-source

This is not the default for `dev-skills`.

Spec-as-source treats implementation as mostly derived from specs. That requires much stricter schemas, generators, migration rules, and drift detection than this repo currently provides. For now, keep `dev-skills` at Spec-first or Spec-anchored strength.

---

## Artifact Contract

| Artifact | Owner | Purpose |
|---|---|---|
| `.design-context.md` | `dev-design-context` | Project-level UI and product design context. |
| `.claude/artifacts/designs/<slug>.md` | `dev-spec` | Intent contract: goal, scope, assumptions, risks, acceptance criteria. |
| `.claude/artifacts/plans/<slug>.md` | `dev-plan` | Implementation contract: options, ADR, steps, risks, verification plan. |
| `.claude/artifacts/fixes/<slug>.md` | `dev-fix` | Bug contract: symptom, repro, hypotheses, root cause, fix, regression evidence. |
| Chat evidence | `dev-tdd`, `dev-verify`, `dev-code-review` | Red/green evidence, verification commands, review verdict, commit message. |

Artifact files are optional for tiny hotfixes, but once they exist they become the source of truth for the current work item.

---

## Feature Path

```text
dev-design-context (optional)
  -> dev-spec
  -> dev-plan (optional, required for complex / high-risk work)
  -> dev-tdd
  -> dev-verify
  -> dev-code-review
  -> git commit
  -> dev-finish
```

Rules:

- `dev-spec` must not leave scope implicit.
- `dev-plan` must consume the spec when one exists and preserve out-of-scope boundaries.
- `dev-tdd` should choose the smallest behavior from the spec acceptance criteria or the plan.
- `dev-verify` must check requirements against fresh command output or direct inspection.
- `dev-code-review` should treat clear divergence from spec or ADR as a real finding, not a style preference.

---

## Bug Path

```text
dev-fix
  -> dev-verify
  -> dev-code-review
  -> git commit
  -> dev-finish
```

Bug work is still SDD, but the "spec" is the failure contract:

- symptom
- expected behavior
- minimal repro
- hypotheses
- confirmed root cause
- regression test
- verification evidence

Do not route bug work through a second `dev-tdd` phase after `dev-fix`. `dev-fix` already owns the failing test and red -> green -> red proof.

---

## Multi-Agent Contract

When a runtime supports multiple agents, SDD is the coordination layer.

The main agent owns:

- user clarification and scope decisions
- artifact selection and slug choice
- task decomposition
- final integration
- git operations
- completion claims

Sub-agents receive bounded tasks that reference the SDD artifacts:

```text
Objective:
Source artifact: .claude/artifacts/designs/<slug>.md or plans/<slug>.md
Write scope:
Read scope:
Do not edit:
Acceptance / verification expected:
Output required:
```

Recommended mapping:

| Role | Source | Output |
|---|---|---|
| planner | spec | plan critique, options, ADR reservations |
| worker | plan or selected AC | changed files plus red/green evidence |
| verifier | spec, plan, or fix artifact | requirement checklist plus command evidence |
| reviewer | spec, plan, fix artifact, diff | independent verdict before commit |

Multiple workers are only safe when write scopes are disjoint. If two agents need to edit the same files, keep that work in the main agent or serialize the tasks.

---

## Drift Control

Spec drift is the main failure mode of SDD.

Use these rules:

- If implementation changes behavior beyond the spec, update the spec or explicitly call out the drift before review.
- If implementation deviates from an approved plan or ADR, update the plan or explain why the old decision no longer applies.
- If a bug fix discovers a larger design issue, mark the fix artifact accordingly and route to `dev-plan` instead of smuggling a refactor into the fix.
- If `dev-code-review` finds behavior that contradicts an existing artifact, it should flag the mismatch.

This keeps artifacts useful as future AI context instead of turning them into stale documentation.

---

## What Not To Add Yet

Do not add these until the lightweight SDD loop proves useful:

- a separate `.zero/` or `.sdd/` state directory
- automatic skill invocation from `dev-auto`
- mandatory spec for every typo or pure documentation change
- generated code from specs as the default implementation path
- hidden multi-agent chains that users cannot inspect

The current target is boring and useful: explicit artifacts, clear handoffs, fresh evidence, and review against the agreed contract.
