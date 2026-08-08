-- Table privileges for the Supabase `authenticated` role.
-- RLS policies alone are not enough: without GRANT, PostgREST returns
-- PostgreSQL 42501 "permission denied for table …".

grant select, insert, update, delete on table public.books to authenticated;
grant select, insert, update, delete on table public.articles to authenticated;
grant select, insert, update, delete on table public.captures to authenticated;
