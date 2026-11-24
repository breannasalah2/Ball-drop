# Ball-drop templates (v0.1.0)

Copy and fill. Replace bracketed placeholders. Do not leave secrets in filled copies that will be committed or shared.

## Handoff block

```markdown
## Handoff

- **Purpose:** [one sentence]
- **Status:** [e.g. Active / Blocked / In review]
- **Requirements:** [bullets or “see [link]”]
- **Research:** [short findings or “n/a”]
- **Decisions:** [one-liners or pointers to decision log #ids]
- **Open questions:** [pointers to question ids/links]
- **Next:** [single next step]
- **Last update:** [agent or human] · [ISO date or local date]
```

A fuller example lives at `templates/HANDOFF.example.md` in the repo root.

## Session entry

```markdown
## [YYYY-MM-DD HH:MM tz] · [Agent] · [Model if known] · [Topic]

- **Chat / path:** [link or file path]

### Checkpoint · [HH:MM] · Checkpoint|Pause|Close

- **Where we are:** [1–2 sentences]
- **Human said:** “[quote when wording matters]”
- **Decided:** [what] — why: [reason] — reversible: [yes/no]
- **Changed:** [pages/files touched + links/paths]
- **Open:** [question ids/links or “none”]
- **Next:** [one line]
- **Resume prompt:** [Pause/Close only — see below]
```

Append new `### Checkpoint` sections to the same session entry; newest last.

## Decision log entry

```markdown
| # | Date | Decision | Why | Alternatives | Reversible | Decided by | Status | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | YYYY-MM-DD | We will… | … | A; B | yes/no | Human / Agent (proposed) | Proposed / Accepted / Superseded by #N | [session path or link] |
```

## Open question row

```markdown
- **Q:** [question]
- **Owner:** [human or role]
- **Needed by:** [date or “none”]
- **Context:** [one line + session pointer]
- **Status:** Open / Answered / Dropped
```

## Prompts (use word-for-word when helpful)

### Resume (human pastes into any agent)

```text
Read the Handoff and the newest session entry for [topic], plus open questions.
Tell me in 3 lines where we left off and the next step. Don't start new work until I confirm.
```

### Pause (agent behavior)

1. Persist the Pause checkpoint and verify.
2. Reply:

```text
Saved: [path or link]. To pick up, paste: Resume [topic] from the [date] pause.
```

### Checkpoint self-check (agent, every few turns)

```text
Has anything been decided, changed, created, or asked since the last checkpoint? If yes, write it now.
```

### Save failure (agent)

```text
I couldn't save to [store] ([reason]). Here is the checkpoint to paste:

[full checkpoint block]
```

### Audit line (optional, for material external changes)

```text
[who] · [when] · [what changed: before → after] · approved by: [name or “n/a”] · undo: [how]
```
