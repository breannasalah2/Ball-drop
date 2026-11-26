# Swipe Tables

Swipe through **any table** in a Supabase database and follow the tables linked to it.

- **Cards:** one row per card. Swipe or use the arrow keys:

  | Gesture / key | Does |
  | --- | --- |
  | → Right | Next row |
  | ← Left | Previous row |
  | ↑ Up | Open the highlighted link (drill down or roll up) |
  | ↓ Down | Back up one level |

- **Links:** every foreign key becomes a link. On a card, *Belongs to* rolls up to the
  parent record; *Linked here* drills down into the child rows, with a count.
- **Tree:** the same rows as an outline. Expand a row to see its linked tables, expand a
  linked table to see its rows, and so on (six levels deep).
- **Breadcrumbs** show the path; tap any step to roll back up to it.

Browsing is read-only. Rows are read with the project's public (anon) key, so Row Level
Security decides what shows: a table with no read policy for the public key does not appear.

**Sign in** (top right) shows your private tables. It emails a one-time sign-in link; the
account must be listed in `public.app_owners`, and that account gets read-only access through
an "owner can read" policy on each table (`private.is_owner()`). Other signed-in accounts see
only what the public key sees.

## Parts

| Path | What it is |
| --- | --- |
| `index.html` | The page (static; host anywhere, e.g. Vercel). `DATABASES` lists the projects it can browse. |
| `supabase/functions/swipe-tables/` | Edge function: `config.json` (project URL + public key) and `schema.json` (tables you can read, columns, primary keys, foreign keys: the public key's view, or the owner's view when called with an owner's sign-in token). Reads the catalog only, never rows. |
| `schema.sql` | The catalog query, readable. `build.py` embeds it into the function. |

## Point it at another database

1. Run `python3 swipe/tables/build.py`.
2. Deploy `supabase/functions/swipe-tables` (both `.ts` files) to that project, with JWT verification off.
3. Add the project to `DATABASES` in `index.html` with base `https://<project-ref>.supabase.co/functions/v1/swipe-tables/`.
4. For sign-in, give that project the same `app_owners` table, `private.is_owner()` and "owner can read" policies.

The function uses only the secrets every Supabase project has
(`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_DB_URL`).

## Plan: fold into the swipe app on Vercel (draft, not live)

1. Host the whole `swipe/` folder from this Vercel project: `/` is the review swipe pad, `/tables/` is this page, with a tab between them.
2. Point the review pad at the DallaVia database (the old swipe-app project is paused) and give it the same sign-in, so task review runs as the owner instead of the public key.
3. Once the pad reads and writes as the owner, remove the public read/update rules on `ai_tasks` (today any holder of the public key can read and change tasks that are "In review").
4. Point the Chrome extension's fallback link at the Vercel address.
5. Nothing goes live until Breanna says so.
