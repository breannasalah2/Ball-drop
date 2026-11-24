# Ball-drop — notes for agents

This repository is an [Agent Skills](https://agentskills.io) package. The product is the skill at `skills/balldrop/`, not a CLI.

## Structure

- `skills/balldrop/SKILL.md` — canonical skill definition the model reads when Ball-drop is invoked
- `skills/balldrop/references/protocol.md` — full five-phase continuity protocol and design rationale
- `skills/balldrop/references/templates.md` — session entry, decision log, pause/resume prompt templates
- `skills/balldrop/references/security.md` — what must never be recorded
- `templates/HANDOFF.example.md` — copy-paste handoff block for end-user projects
- `README.md` — human-facing overview and install
- `CONTRIBUTING.md` — how to change this package
- `LICENSE` — MIT © Breanna Salah 2026

## Orientation

- Keep `SKILL.md` short; put detail in `references/` and route to it from the skill.
- The public package must stay **generic**: no personal Notion/Drive/email links, no private names beyond the copyright holder, no secrets, no employer/client confidential material.
- Version is `0.1.0`. When bumping, update `SKILL.md` frontmatter `metadata.version` and the README version row together.
- Do not invent a runtime or scripts for v0.1.0 — this skill is protocol and templates only.

## Commands

```bash
# From repo root — install a local checkout into the host skill store
npx skills add . --skill balldrop

# Re-sync after editing the skill
npx skills add . --skill balldrop
```

## Rules for edits

1. **SKILL.md first.** Any protocol change that agents must follow belongs in `SKILL.md` or a file it explicitly routes to.
2. **No secrets.** Never commit `.env`, tokens, cookies, or real handoff content from a private workspace.
3. **Sanitize examples.** Example text uses placeholders (`[topic]`, `[project]`, `[link]`).
4. **Keep license MIT.** Do not relicense without the copyright holder.
5. **One concern per file.** Protocol narrative stays in `protocol.md`; copy-paste templates stay in `templates.md`.

## Testing a change

1. Install or re-install the skill from the working tree.
2. Start a fresh agent session on a throwaway markdown project.
3. Run Start → Checkpoint → Pause → resume in a second session → Close → Verify.
4. Confirm the second session can pick up from the handoff without private context.
