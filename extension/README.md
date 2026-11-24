# Ball-drop Swipe — Chrome extension

MV3 side-panel extension for talk-then-swipe commands (approve · drop · next · undo).

## Load unpacked

1. Open Chrome and go to `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked**.
4. Select this folder: `extension/` (the directory that contains `manifest.json`).
5. Pin **Ball-drop Swipe** from the puzzle menu, then click the icon to open the side panel.

## Swipe map

| Gesture / key | Command |
| --- | --- |
| ↑ Up | Approve |
| ↓ Down | Drop |
| → Right | Next |
| ← Left | Undo |

## Live PWA

If the side panel cannot open, the action falls back to the hosted app:

https://khyejqvutrjwxljuhmot.supabase.co/functions/v1/swipe-app/

## Source

UI is shipped beside the repo as `../swipe/` (PWA assets + `schema.sql`). The side panel loads the same swipe UI with Ball-drop branding.
