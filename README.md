# Ball-drop

**Don't Drop the Ball** — a continuity protocol for humans and AI agents working together across sessions.

Ball-drop is an [Agent Skills](https://agentskills.io) package. It teaches any compatible agent how to start, checkpoint, pause, close, and verify work so context does not vanish when a chat ends, a model switches, or a human steps away.

| | |
| --- | --- |
| **Version** | 0.1.0 |
| **License** | MIT © Breanna Salah 2026 |
| **Skill name** | `balldrop` |
| **Install** | `npx skills add breannasalah2/Ball-drop --skill balldrop` |

## Swipe (browser)

Talk, then swipe to send continuity commands from a phone PWA or Chrome side panel.

- **Live PWA:** [https://khyejqvutrjwxljuhmot.supabase.co/functions/v1/swipe-app/](https://khyejqvutrjwxljuhmot.supabase.co/functions/v1/swipe-app/)
- **Chrome extension:** load unpacked from [`extension/`](extension/) — see [`extension/README.md`](extension/README.md)
- **PWA source:** [`swipe/`](swipe/) (assets + [`swipe/schema.sql`](swipe/schema.sql))

**Swipe map**

| | |
| --- | --- |
| ↑ | approve |
| ↓ | drop |
| → | next |
| ← | undo |

## Why it exists

Long-running agent work fails most often at the edges: a session ends mid-task, a second agent starts cold, or a save is claimed but never verified. Ball-drop turns continuity into a small, repeatable protocol with fixed records and templates — not a vague “remember what we did.”

Inspired by patterns from long-running agent harnesses, session handoffs, and append-only decision logs. See [`skills/balldrop/references/protocol.md`](skills/balldrop/references/protocol.md) for sources and the full design.

## Quick start

1. Install the skill into your agent host (Claude Code, Cursor, Codex, Gemini CLI, Copilot, and other [Agent Skills](https://agentskills.io) hosts):

   ```bash
   npx skills add breannasalah2/Ball-drop --skill balldrop
   ```

2. Point the agent at your project’s living documents (handoff block, session log, decision log, open-questions list). Ball-drop does not require a particular product — markdown files, Notion, Linear, or a repo all work.

3. Invoke the skill when starting work, pausing, or handing off:

   - “Use balldrop to resume this project.”
   - “Ball-drop pause checkpoint — I have to go.”
   - “Close this session with a balldrop handoff.”

4. Copy [`templates/HANDOFF.example.md`](templates/HANDOFF.example.md) into your project and keep it current.

## What the skill does

Five phases, one job each:

| Phase | When | Outcome |
| --- | --- | --- |
| **Start (resume)** | Opening an existing topic | Read handoff + latest session + open questions; confirm next step before new work |
| **Checkpoint** | Decisions, new facts, material changes, or every few substantive turns | Update the living session entry |
| **Pause** | Human says pause / brb / later | Write a pause checkpoint first, then a one-line resume prompt |
| **Close** | Topic switch or end of substantial work | Final checkpoint, rewrite handoff, append decisions, file open questions |
| **Verify** | After every save | Re-read the saved spot; on failure, paste a full checkpoint in chat |

## Repo layout

```
Ball-drop/
├── README.md
├── AGENTS.md
├── CONTRIBUTING.md
├── LICENSE
├── extension/          # Chrome MV3 side-panel (Ball-drop Swipe)
├── swipe/              # PWA source + schema.sql
├── skills/balldrop/
│   ├── SKILL.md
│   └── references/
│       ├── protocol.md
│       ├── templates.md
│       └── security.md
└── templates/
    └── HANDOFF.example.md
```

## Security

Ball-drop records **work state**, not secrets. Never put API keys, tokens, passwords, personal health/HR details, or private account data into handoffs or session logs. Prefer links over copies of sensitive documents. Details: [`skills/balldrop/references/security.md`](skills/balldrop/references/security.md).

## Compatibility

Designed for any Agent Skills–compatible host. No runtime binaries or API keys required. Your chosen note store (files, wiki, issue tracker) must be readable and writable by the agent for verification to work.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`AGENTS.md`](AGENTS.md). Keep the public package free of personal links, private data, and secrets.

## License

[MIT](LICENSE) © Breanna Salah 2026.
