-- Swipe Tables: catalog query used by the swipe-tables edge function.
-- Read-only. $1 is the database role the page will read as: 'anon' (public
-- key) or 'authenticated' (a signed-in owner). Lists only relations in the
-- public schema that role can read: SELECT granted, and for tables either RLS
-- off or a permissive SELECT/ALL policy for that role or public. Rows are never
-- read here; the browser fetches rows itself, so RLS decides what shows.
with rel as (
  select c.oid,
         c.relname::text as name,
         c.relkind::text as kind,
         c.relrowsecurity as rls,
         obj_description(c.oid, 'pg_class') as comment,
         case when c.relkind in ('r', 'p') then
           (not c.relrowsecurity) or exists (
             select 1 from pg_policy p
             where p.polrelid = c.oid
               and p.polcmd in ('r', '*')
               and p.polpermissive
               and (p.polroles @> array[0::oid] or p.polroles @> array[$1::text::regrole::oid]))
         else true end as readable
  from pg_class c
  where c.relnamespace = 'public'::regnamespace
    and c.relkind in ('r', 'p', 'v', 'm')
    and has_table_privilege($1::text::name, c.oid, 'SELECT')
), vis as (
  select * from rel where readable
)
select json_build_object(
  'tables', coalesce((
    select json_agg(json_build_object(
      'name', v.name,
      'kind', case when v.kind in ('v', 'm') then 'view' else 'table' end,
      'rls', v.rls,
      'comment', v.comment,
      'columns', (
        select json_agg(json_build_object('name', a.attname, 'type', format_type(a.atttypid, a.atttypmod)) order by a.attnum)
        from pg_attribute a
        where a.attrelid = v.oid and a.attnum > 0 and not a.attisdropped
          and has_column_privilege($1::text::name, v.oid, a.attnum, 'SELECT')),
      'pk', (
        select json_agg(a.attname order by k.ord)
        from pg_index i
        cross join lateral unnest(i.indkey::int2[]) with ordinality k(attnum, ord)
        join pg_attribute a on a.attrelid = i.indrelid and a.attnum = k.attnum
        where i.indrelid = v.oid and i.indisprimary)
    ) order by v.name)
    from vis v), '[]'::json),
  'links', coalesce((
    select json_agg(json_build_object(
      'name', con.conname,
      'from', fr.name,
      'to', tr.name,
      'from_cols', (
        select json_agg(a.attname order by k.ord)
        from unnest(con.conkey) with ordinality k(n, ord)
        join pg_attribute a on a.attrelid = con.conrelid and a.attnum = k.n),
      'to_cols', (
        select json_agg(a.attname order by k.ord)
        from unnest(con.confkey) with ordinality k(n, ord)
        join pg_attribute a on a.attrelid = con.confrelid and a.attnum = k.n)
    ) order by con.conname)
    from pg_constraint con
    join vis fr on fr.oid = con.conrelid
    join vis tr on tr.oid = con.confrelid
    where con.contype = 'f'), '[]'::json)
) as schema;
