# Ball-drop protocol (v0.1.0)

This document expands the five phases in `SKILL.md`. Agents should follow `SKILL.md` first and open this file when they need the full design.

## Goal

Ensure **not a single conversation of material work is dropped**. Continuity is an audit trail of state, decisions, and next steps — readable by a human or another agent with no prior chat history.

## Problem Ball-drop addresses

| Failure mode | What goes wrong | Ball-drop counter |
| --- | --- | --- |
| End-only logging | Chat dies early → nothing written | Checkpoints during the session; Pause is mandatory |
| Overwritten handoffs | Old decisions vanish when the summary is rewritten | Append-only decision log; handoff is current state only |
| Claimed saves | Agent says “saved” but write failed | Verify by re-read; paste fallback on failure |
| Cold starts | New agent ignores last stop point | Start phase: read + 3-line brief + confirm |
| Silent mid-chat loss | Agents cannot detect idle disconnects | Regular checkpoints are the safety net |

## Design principles

1. **Write progress as you go**, not only at the end.
2. **Fixed sections** beat free-form essays (handoff fields; checkpoint tags).
3. **Decisions are append-only** with status: Proposed / Accepted / Superseded.
4. **Links over copies** for sensitive or large material.
5. **Prove the write** before claiming success.

## The four records

### Handoff (current state)

Purpose: under ~150 words so a stranger agent can orient in one screen.

Suggested fields (rewrite, do not append forever):

- Purpose
- Status
- Requirements
- Research / findings (short)
- Decisions (pointers or one-liners; detail lives in the decision log)
- Open questions (pointers)
- Next
- Last update (who · when)

### Session entry (one chat)

Purpose: living log of a single session. Header once; checkpoint lines newest last.

Tags: `Checkpoint` · `Pause` · `Close`

Each line covers: where we are · what the human said (when wording matters) · decided · changed · open · next · resume prompt (Pause/Close only).

### Decision log (project lifetime)

Purpose: settled questions stay settled.

Fields: `#` · Date · Decision (“We will…”) · Why · Alternatives · Reversible (yes/no) · Decided by · Status · Source (chat/session link or path)

Never edit an Accepted entry’s substance. To change course: add a new entry and mark the old one `Superseded by #N`.

### Open questions

Purpose: anything waiting on a human or external blocker. One owner, one next ask, link back to the session.

## Phase details

### Start (resume)

```
Read: handoff → newest session entry → open questions
Say:  3 lines (stand / open / next)
Wait: confirmation (unless user said to proceed)
Then: begin work
```

### Checkpoint triggers

Write when: decision · new preference · supplied fact · material create/change · ~every 3 substantive turns with novelty.

Do not write: filler chat, private reasoning, unchanged status checks.

### Pause

Order is load-bearing:

1. Persist Pause checkpoint
2. Verify
3. Then conversational reply + resume prompt

### Close

Order:

1. Close checkpoint
2. Rewrite handoff
3. Append decisions
4. Update open questions
5. Verify each write

### Verify and fallback

- Success: “Saved: [path or link].”
- Failure: “Could not save ([reason]). Checkpoint to paste:” + full block.

## Mapping to common stores

Ball-drop is store-agnostic. Examples:

| Store | Handoff | Session | Decisions | Questions |
| --- | --- | --- | --- | --- |
| Git repo | `HANDOFF.md` | `sessions/YYYY-MM-DD.md` | `DECISIONS.md` | `QUESTIONS.md` |
| Wiki / Notion-like | Project page top | Continuity / log page | Section or DB | Queue DB or page |
| Issue tracker | Epic description | Linked comment thread | ADR issues | Open issues labeled `question` |

Prefer whatever the project already uses. Do not create parallel systems without asking.

## External patterns (inspiration)

These informed the design; Ball-drop does not require their tooling:

- Long-running agent progress logs and “read state before acting” — [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- Session handoff section shapes — agentic playbook session-handoff patterns
- Append-only decisions with supersession — [Architecture Decision Records](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html)
- Audit trail as chain of custody (who / when / what / approval / undo) — industry AI audit-trail guidance

## Versioning

Protocol version matches the skill: **0.1.0**. Breaking template or phase changes bump the minor or major version in `SKILL.md` metadata and the README.
