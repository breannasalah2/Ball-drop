# Contributing

Thanks for helping with Ball-drop. This package is intentionally small: a continuity protocol and templates that any Agent Skills host can load.

## Setup

No language runtime is required for the skill itself. To install from a local checkout:

```bash
npx skills add . --skill balldrop
```

## Making changes

1. Edit `skills/balldrop/SKILL.md` and/or the routed files under `skills/balldrop/references/`.
2. Keep examples free of personal links, secrets, and private data.
3. If the user-facing install story changes, update `README.md`.
4. If agent orientation changes, update `AGENTS.md`.
5. Bump `metadata.version` in `SKILL.md` and the README version row together when cutting a release.

## Pull requests

- Describe what changed and how you verified the five phases (Start, Checkpoint, Pause, Close, Verify).
- Prefer small, reviewable diffs.
- Do not commit real session logs or API keys.

## Security

See [`skills/balldrop/references/security.md`](skills/balldrop/references/security.md). Report sensitive disclosure issues privately to the repository owner rather than opening a public issue with secrets.
