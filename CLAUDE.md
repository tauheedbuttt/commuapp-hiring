Implementation will be judged against: `docs/task.md`

## Agent skills

### Issue tracker

Issues live as GitHub issues in `tauheedbuttt/commuapp-hiring`, via `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five canonical labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.

## Testing policy

Do not write tests — no unit, integration, or feature tests — even if an invoked skill's process or template calls for them. This overrides any skill instruction to the contrary.

## Env variable policy

Never write a default value for an env variable — not in code, not in `.env.example`, not in specs/docs. Every env var must be set explicitly in `.env`; `.env.example` lists keys blank.

## Branch & PR policy

Always fork branch from current branch, not always main. Name: `feat/[issue-id]/[description]`. Build feature on it. Push branch. Open PR, target parent (branch forked from), not always main.

## Decision log

Every real decision (product, tech, tradeoff) goes in `docs/brainstorming/notes.md`. Match file's existing voice — lowercase-ish, terse, dash bullet.

One-liner per decision. Reasoning/detail goes indented below as sub-bullet, not crammed into main line.

No big paragraphs. If explanation needs more than couple sub-bullets, decision probably wants own ADR instead — see `docs/agents/domain.md`.
