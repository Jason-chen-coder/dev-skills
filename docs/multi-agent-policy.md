# Multi-Agent Policy — dev-skills

Status: Adopted v1

This document defines how `dev-skills` should work when the host agent supports multi-agent execution. It does not turn the skills into an automatic orchestration runtime. The goal is to keep the current "one skill, one responsibility" model, while making selected skills safe to run as delegated specialist agents.

---

## Purpose

`dev-skills` already splits engineering work into clear SDD phases:

```text
design context -> spec -> plan -> implement / fix -> verify -> review -> commit -> finish
```

Multi-agent support should make those phases easier to parallelize and cross-check. It should not make the workflow less controllable.

The primary design goal is:

> The main agent orchestrates. SDD artifacts define the contract. Sub-agents execute bounded, evidence-producing tasks.

---

## Non-goals

This proposal does not add a new native agent type.

It also does not make `dev-auto` automatically invoke other skills. `dev-auto` remains a guide and recommender. It can recommend the next step, but the main agent decides whether to delegate and how to integrate the results.

Do not build a hidden chain where skills call each other without user-visible control.

---

## Role Model

### Main agent

The main agent owns:

- user communication and clarification
- workflow routing
- task decomposition
- delegation prompts
- final integration
- git operations
- high-risk decisions
- final completion claims

The main agent must not blindly accept a sub-agent result. It should inspect the result, integrate it, and run or request verification before claiming success.

### Sub-agents

Sub-agents are specialist execution lanes. They should receive a narrow assignment and return evidence.

Common behavioral roles:

| Role | Typical Codex agent_type | Use for |
|---|---|---|
| explorer | `explorer` | codebase lookup, dependency tracing, similar implementation search |
| planner | `default` or `worker` | implementation plan critique or option analysis |
| worker | `worker` | bounded code changes with clear file ownership |
| verifier | `worker` | independent verification commands and requirement checks |
| reviewer | `worker` | independent diff review before commit |
| design explorer | `explorer` | design-system and UI convention discovery |

These are behavioral roles, not necessarily native runtime types. If a runtime only exposes `default`, `explorer`, and `worker`, use the closest fit and put the role contract in the prompt.

---

## Delegation Gates

Delegate only when all of these are true:

- The subtask is bounded.
- The expected output is clear.
- The assigned files or responsibility area are clear.
- The subtask can run without blocking the main agent's immediate next step.
- The result can be verified by code review, tests, commands, or a concrete checklist.

Do not delegate when:

- the next step requires user clarification
- file ownership is unclear
- two agents would edit the same files
- the task involves final git operations
- the task involves destructive cleanup or branch discard
- the subtask is mainly a product decision rather than execution

---

## Ownership Contract

Every delegated task should include:

```text
Objective:
Source artifact:
Write scope:
Read scope:
Do not edit:
Verification expected:
Output required:
```

For code-writing work, the sub-agent must be told:

- you are not alone in the codebase
- do not revert edits made by others
- do not edit outside your assigned ownership
- list every changed file in the final answer
- report commands run and their results
- report residual risks

---

## SDD Contract Between Agents

When `.claude/artifacts/` contains a matching spec, plan, or fix artifact, treat it as the coordination contract for delegated work.

| Artifact | Delegation use |
|---|---|
| `.claude/artifacts/designs/<slug>.md` | Use for product intent, in scope, out of scope, assumptions, risks, and acceptance criteria. |
| `.claude/artifacts/plans/<slug>.md` | Use for implementation ownership, ADR, chosen option, risks, and verification plan. |
| `.claude/artifacts/fixes/<slug>.md` | Use for bug symptom, repro, confirmed root cause, regression test, and fix evidence. |

Delegation rules:

- The main agent selects the relevant artifact and slug. Sub-agents do not guess among multiple active artifacts.
- Workers must cite which acceptance criteria, plan step, or root-cause path they implemented.
- Verifiers must map commands or direct inspection back to the artifact checklist.
- Reviewers should treat clear divergence from spec / ADR / fix evidence as a functional finding.
- If a sub-agent discovers artifact drift, it should report the drift instead of silently expanding scope.

Do not use SDD artifacts to override explicit user instructions or current code evidence. If artifact and code disagree, report the mismatch and let the main agent decide whether to update the artifact or change the implementation.

---

## Skill Agent Profiles

### Recommended for sub-agents

| Skill | Recommended role | Notes |
|---|---|---|
| `dev-plan` | planner | useful for option analysis or architecture critique after a spec exists |
| `dev-tdd` | worker | suitable when behavior and file ownership are clear |
| `dev-fix` | bug investigator / worker | suitable for bounded reproduction, root-cause tracing, and regression-test work |
| `dev-verify` | verifier | strong fit for independent completion evidence |
| `dev-code-review` | reviewer | strong fit for independent pre-commit review |
| `dev-design-context` | design explorer | useful for discovering UI conventions before main-agent synthesis |

### Main-agent first

| Skill | Reason |
|---|---|
| `dev-auto` | router only; it should not become an orchestrator |
| `dev-grill-docs` | usually requires user clarification, scope negotiation, and durable-doc judgment |
| `dev-spec` | compatibility alias for `dev-grill-docs --spec-only`; keep user clarification in the main agent |
| `dev-commit-writer` | a narrow single-step tool, not worth delegation |
| `dev-finish` | branch finishing, PR, merge, keep, and discard choices should remain under main-agent control |

---

## Standard Multi-Agent Profile Block

Agent-capable skills should include a section like this:

```md
## Multi-Agent Profile

Recommended agent_type: worker

Use when:
- The task is bounded and can run independently.
- File ownership is clear.
- The result can be verified by commands or diff review.

Do:
- Work only inside the assigned scope.
- Report changed files.
- Report verification commands and results.
- Report residual risks.

Do not:
- Revert unrelated changes.
- Edit outside assigned ownership.
- Claim completion without evidence.

Output:
- Summary
- Changed files
- Verification
- Risks / follow-ups
```

Each skill should customize the recommended role and boundaries. For example, `dev-code-review` should emphasize read-only review unless the user explicitly asks for fixes, while `dev-tdd` should emphasize the red-green-refactor loop and assigned file ownership.

---

## Workflow Patterns

### Feature or enhancement

```text
main agent
  -> optional dev-design-context
  -> dev-grill-docs
  -> optional planner sub-agent for dev-plan critique
  -> one or more worker sub-agents for disjoint dev-tdd implementation slices
  -> verifier sub-agent using dev-verify
  -> reviewer sub-agent using dev-code-review
  -> main agent integrates, commits, and runs dev-finish if needed
```

Use multiple workers only when the write scopes are disjoint.

### Bug or incident

```text
main agent
  -> optional explorer for failure-path lookup
  -> bug investigator / worker using dev-fix
  -> verifier using dev-verify
  -> reviewer using dev-code-review
  -> main agent commits and finishes
```

Do not add a second `dev-tdd` phase after `dev-fix`. `dev-fix` already owns reproduction, root-cause repair, and regression-test work.

### Small hotfix

```text
main agent
  -> dev-tdd directly, usually local
  -> dev-verify
  -> dev-code-review
  -> commit
```

Small hotfixes usually do not need sub-agents unless verification or review can run independently.

---

## Prompt Template

Use this shape when assigning a sub-agent:

```text
You are acting as the {role} for this dev-skills workflow.

Objective:
{one bounded task}

Source artifact:
{relevant .claude/artifacts path, or "none"}

Write scope:
{files/modules the agent may edit, or "read-only"}

Read scope:
{files/modules the agent should inspect}

Do not edit:
{explicit exclusions}

Workflow:
Use {skill-name} rules where applicable.

Verification expected:
{commands/checklist, mapped to source artifact when present}

Output required:
- Summary
- Changed files
- Verification commands and results
- Risks or follow-ups
```

---

## Repository Integration

This policy is integrated across these repository surfaces:

| File | Integration |
|---|---|
| `docs/sdd-workflow.md` | SDD artifact and workflow contract |
| `docs/multi-agent-policy.md` | canonical policy |
| `skills/dev-plan/SKILL.md` | `## Multi-Agent Profile` |
| `skills/dev-tdd/SKILL.md` | `## Multi-Agent Profile` |
| `skills/dev-fix/SKILL.md` | `## Multi-Agent Profile` |
| `skills/dev-verify/SKILL.md` | `## Multi-Agent Profile` |
| `skills/dev-code-review/SKILL.md` | `## Multi-Agent Profile` |
| `skills/dev-design-context/SKILL.md` | `## Multi-Agent Profile` |
| `skills/dev-auto/SKILL.md` | `## Multi-Agent Note` |
| `skills/dev-grill-docs/SKILL.md` | `## Multi-Agent Note` |
| `skills/dev-spec/SKILL.md` | `## Multi-Agent Note` |
| `skills/dev-commit-writer/SKILL.md` | `## Multi-Agent Note` |
| `skills/dev-finish/SKILL.md` | `## Multi-Agent Note` |
| `AGENTS.md.template` | short always-on multi-agent protocol |
| `CLAUDE.md.template` | same short protocol |
| `README.md` | user-facing multi-agent section |
| `docs/onboarding.md` | setup and usage notes |
| `scripts/validate-repo.sh` | sync validation |

---

## Validation Rules

The repository validator checks:

- `docs/sdd-workflow.md` exists and is linked from README / onboarding.
- `docs/multi-agent-policy.md` exists.
- every agent-capable skill has `## Multi-Agent Profile`.
- every main-agent-first skill has `## Multi-Agent Note`.
- `dev-auto` still says it does not automatically invoke other skills.
- `README.md` links to the multi-agent policy.
- `docs/onboarding.md` mentions multi-agent setup and usage.
- `AGENTS.md.template` and `CLAUDE.md.template` contain the same short protocol.

Suggested commands:

```bash
bash scripts/validate-repo.sh
git diff --check
```

---

## Rollout State

### Phase 1 — Document the policy

Done.

### Phase 2 — Add skill profiles

Done. `## Multi-Agent Profile` exists in:

- `dev-plan`
- `dev-tdd`
- `dev-fix`
- `dev-verify`
- `dev-code-review`
- `dev-design-context`

Done. `## Multi-Agent Note` exists in:

- `dev-auto`
- `dev-grill-docs`
- `dev-spec`
- `dev-commit-writer`
- `dev-finish`

### Phase 3 — Update user-facing docs

Done. README, onboarding, and always-on templates now point to this policy.

### Phase 4 — Enforce with validation

Done. `scripts/validate-repo.sh` validates policy coverage.

---

## Open Questions

- Should `dev-code-review` remain strictly read-only when delegated, or allow an optional "review and fix" mode?
- Should `dev-plan` get separate planner, architect, and critic profile variants, or keep a single planner profile for v1?
