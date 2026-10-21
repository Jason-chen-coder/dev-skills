# SDD Workflow Guide

Status: Adopted v1

This document explains how `dev-skills` applies SDD, or Spec-Driven Development, without adding a heavy runtime or a new state machine.

In this repo, SDD means:

> A clear contract defines intent, scope, and acceptance criteria; implementation, verification, and review use that contract. Keep durable artifacts when the work needs them.

It is a workflow contract, not a promise that code can be regenerated entirely from specs.

---

## Why This Fits dev-skills

`dev-skills` already separates the development path into stable phases:

```text
intent / context -> clarify / spec (when needed) -> plan (by risk) -> implement / fix -> verify -> review -> authorized delivery
```

SDD gives those phases a clearer responsibility:

- `dev-grill-docs` captures human intent before implementation and may preserve stable domain language in `CONTEXT.md` / ADR.
- `dev-spec` remains a compatibility alias for `dev-grill-docs --spec-only`.
- `dev-plan` turns aligned intent into a concrete implementation decision.
- `dev-tdd` and `dev-fix` turn requirements or bugs into executable proof.
- `dev-verify` checks completion claims against commands and requirements.
- `dev-code-review` checks the diff against the contract before commit.
- `dev-auto` recommends the next step but does not orchestrate hidden work.

The practical goal is to align intent before implementation. The current request is the contract for small work; relevant specs and plans provide durable references for larger work and handoffs.

---

## Adoption Levels

### 1. Direct, scoped work

Use this when the request is clear, the scope is small, and the change is low risk.

```text
current request -> implement with appropriate checks -> dev-verify -> dev-code-review (when required)
```

The conversation can hold the goal, boundaries, and acceptance criteria. Prefer meaningful tests for new behavior; use existing checks or direct inspection for low-impact edits. A separate intake, spec, or plan artifact is not required.

### 2. Spec-first

Use this when material domain, permission, or irreversible-operation choices remain unresolved, or the user requests a requirements document.

```text
dev-grill-docs -> dev-tdd -> dev-verify -> dev-code-review
```

The spec can be short. It names the goal, scope, assumptions, and acceptance criteria. Reuse a relevant existing spec rather than repeating intake.

### 3. Spec-anchored

Use this for complex or risky work, or when durable handoffs will help several agents coordinate.

```text
relevant spec (existing or dev-grill-docs) -> dev-plan -> dev-tdd -> dev-verify -> dev-code-review
```

The spec and plan live under `.claude/artifacts/` and act as long-lived references for implementation, verification, review, and commit messages.

### 4. Spec-as-source

This is not the default for `dev-skills`.

Spec-as-source treats implementation as mostly derived from specs. That requires much stricter schemas, generators, migration rules, and drift detection than this repo currently provides. Choose direct, Spec-first, or Spec-anchored work according to the task.

---

## Artifact Contract

| Artifact | Owner | Purpose |
|---|---|---|
| `.design-context.md` | `dev-design-context` | Project-level UI and product design context. |
| `.claude/artifacts/designs/<slug>.md` | `dev-grill-docs` (`dev-spec` compatibility alias) | Intent contract: goal, scope, assumptions, risks, acceptance criteria. |
| `CONTEXT.md` / `docs/adr/<nnnn>-<slug>.md` | `dev-grill-docs` | Durable domain language and cross-feature decisions, only when warranted. |
| `.claude/artifacts/plans/<slug>.md` | `dev-plan` | Implementation contract: options, ADR, steps, risks, verification plan. |
| `.claude/artifacts/fixes/<slug>.md` | `dev-fix` | Bug contract: symptom, repro, hypotheses, root cause, fix, regression evidence. |
| Chat evidence | `dev-tdd`, `dev-verify`, `dev-code-review` | Appropriate test/check evidence, verification commands, review verdict, commit message when requested. |

Use an existing project artifact convention when present; the paths above are defaults for compatibility. Small, clear work may keep its contract in the conversation. Existing artifacts are coordination evidence: check their status and relevance against the current request. A DRAFT file's existence does not establish approval.

Reuse decisions and authorization already supplied by the user. Ask only about unresolved material choices; do not require another approval of the same scope at each skill boundary.

---

## Feature Path

```text
dev-design-context (optional)
  -> dev-grill-docs (only for material gaps or a requested requirements document)
  -> dev-plan (optional, required for complex / high-risk work)
  -> dev-tdd
  -> dev-verify
  -> dev-code-review
  -> git commit
  -> dev-finish
```

Skip optional stages when the current request and existing evidence already provide the contract. Commit and branch operations need their corresponding authorization; authorization already given continues across skill boundaries.

Rules:

- `dev-grill-docs` must not leave scope implicit.
- `dev-plan` must consume the spec when one exists and preserve out-of-scope boundaries.
- `dev-tdd` should choose the smallest coherent behavior from the current request or relevant spec / plan, with checks proportional to risk.
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

Do not route bug work through a second `dev-tdd` phase after `dev-fix`. `dev-fix` already owns regression evidence. Red -> green is the usual proof; an additional fix reversal is useful only when test sensitivity remains uncertain, and must be isolated from the user's working tree and index.

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

When delegation is authorized by the user or applicable instructions, sub-agents receive bounded tasks that reference the current requirement and any relevant SDD artifacts:

```text
Objective:
Source requirement / artifact: current request, designs/<slug>.md, or plans/<slug>.md
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
| worker | current request, plan, or selected AC | changed files plus appropriate test/check evidence |
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
