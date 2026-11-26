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

## Parts

| Path | What it is |
| --- | --- |
| `index.html` | The page (static; host anywhere, e.g. Vercel). Set `FUNCTION_BASE` to the function below. |
| `supabase/functions/swipe-tables/` | Edge function: `config.json` (project URL + public key) and `schema.json` (tables the public key can read, columns, primary keys, foreign keys). Reads the catalog only, never rows. |
| `schema.sql` | The catalog query, readable. `build.py` embeds it into the function. |

## Point it at another database

1. Run `python3 swipe/tables/build.py`.
2. Deploy `supabase/functions/swipe-tables` (both `.ts` files) to that project, with JWT verification off.
3. Change `FUNCTION_BASE` in `index.html` to `https://<project-ref>.supabase.co/functions/v1/swipe-tables/`.

The function uses only the secrets every Supabase project has
(`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_DB_URL`).
