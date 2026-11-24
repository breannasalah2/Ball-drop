# Ball-drop security (v0.1.0)

Ball-drop improves continuity. It must not become a side channel for secrets or private life data.

## Never record

- API keys, tokens, passwords, session cookies, private keys
- Full contents of credentials files (`.env`, keychains, wallet seeds)
- Health, HR, financial account numbers, government IDs, or similar personal sensitive data
- Confidential employer/client material the human has not authorized for that store
- The agent’s private chain-of-thought or hidden system prompts

## Prefer

- **Links or paths** to sensitive documents instead of pasting their contents
- **Redaction**: `sk-…REDACTED`, `***@example.com`
- **Ask first** before saving anything that might be sensitive, even if routine checkpoints are silent
- **Separate private stores** when the human maintains a private area agents should not mirror into public logs

## Verify without leaking

When verifying a save, confirm the expected heading or field is present. Do not dump entire private pages into the chat to “prove” the write.

## Public package rule

Contributions to this GitHub repository must stay free of personal workspace URLs, private data, and secrets. Use placeholders in examples.

## Incident response

If a secret is accidentally written into a handoff or session log:

1. Rotate the secret immediately.
2. Remove it from the store (or supersede the entry with a redacted replacement).
3. Do not commit the secret to git; if it was committed, treat the key as burned and rotate.
