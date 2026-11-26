// Swipe Tables — Supabase Edge Function
//
// Gives the Swipe Tables page (swipe/tables/index.html, hosted on Vercel) what
// it needs to browse this project: the public URL and public (anon) key, and a
// read-only catalog of the tables that key can read, with their columns,
// primary keys and foreign-key links. It never reads rows: the page fetches
// rows with the public key, so Row Level Security decides what anyone sees.
//
// Deploy the same function to any Supabase project and point the page at it.
// It uses only the default secrets every project has:
//   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_DB_URL
//
// Routes (under /functions/v1/swipe-tables):
//   /config.json  { url, anonKey }
//   /schema.json  the catalog. With a signed-in user's token in Authorization,
//                 and that user's email in public.app_owners, it lists what the
//                 'authenticated' role can read instead of what the public key can.
//
// (Supabase serves HTML from functions as plain text, so the page itself
// can't be hosted here.)

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import postgres from "npm:postgres@3.4.5";
import { SCHEMA_SQL } from "./schema_sql.ts";

const FUNCTION_NAME = "swipe-tables";

let sql: ReturnType<typeof postgres> | null = null;
function db() {
  if (!sql) {
    const url = Deno.env.get("SUPABASE_DB_URL");
    if (!url) throw new Error("SUPABASE_DB_URL is not set");
    sql = postgres(url, { max: 1, prepare: false, idle_timeout: 20, connect_timeout: 10 });
  }
  return sql;
}

function headers(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-cache",
    "X-Content-Type-Options": "nosniff",
  };
}

function route(req: Request): string {
  const path = new URL(req.url).pathname;
  const idx = path.lastIndexOf("/" + FUNCTION_NAME);
  return (idx >= 0 ? path.slice(idx + FUNCTION_NAME.length + 1) : path).replace(/^\/+/, "");
}

const cached: Record<string, { at: number; body: unknown }> = {};
const CACHE_MS = 30_000;

async function catalog(role: "anon" | "authenticated"): Promise<unknown> {
  const hit = cached[role];
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.body;
  const rows = await db().begin("read only", (tx) => tx.unsafe(SCHEMA_SQL, [role]));
  const body = rows[0]?.schema ?? { tables: [], links: [] };
  cached[role] = { at: Date.now(), body };
  return body;
}

// Who is asking: the signed-in user's email if the token checks out with Supabase Auth.
async function signedInEmail(req: Request): Promise<string | null> {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const url = Deno.env.get("SUPABASE_URL") ?? "";
  if (!token || token === anonKey || !url) return null;
  const res = await fetch(url.replace(/\/+$/, "") + "/auth/v1/user", {
    headers: { apikey: anonKey, Authorization: "Bearer " + token },
  });
  if (!res.ok) return null;
  const user = await res.json();
  return typeof user?.email === "string" ? user.email.toLowerCase() : null;
}

async function isOwner(email: string): Promise<boolean> {
  const rows = await db().begin("read only", (tx) =>
    tx.unsafe("select exists (select 1 from public.app_owners where email = lower($1)) as ok", [email])
  );
  return Boolean(rows[0]?.ok);
}

function reply(body: string | null, status = 200): Response {
  return new Response(body, { status, headers: headers() });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: headers() });
  if (req.method !== "GET" && req.method !== "HEAD") return reply(JSON.stringify({ error: "Method not allowed" }), 405);
  const head = req.method === "HEAD";
  const name = route(req);
  try {
    if (name === "config.json") {
      const body = JSON.stringify({ url: Deno.env.get("SUPABASE_URL") ?? "", anonKey: Deno.env.get("SUPABASE_ANON_KEY") ?? "" });
      return reply(head ? null : body);
    }
    if (name === "schema.json") {
      const email = await signedInEmail(req);
      const owner = email ? await isOwner(email) : false;
      const schema = await catalog(owner ? "authenticated" : "anon");
      const body = JSON.stringify({ ...(schema as object), signed_in: Boolean(email), owner });
      return reply(head ? null : body);
    }
  } catch (err) {
    console.error(err);
    return reply(JSON.stringify({ error: "Could not read the table list." }), 500);
  }
  return reply(JSON.stringify({ error: "Not found" }), 404);
});
