-- Alostra Milestone 3.5 — books, articles, captures with RLS
-- Ownership: user_id = auth.uid(). Captures may only reference owned sources.

create table public.books (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  author text not null default '',
  cover_url text,
  status text not null check (status in ('want-to-read', 'reading', 'finished')),
  current_page integer check (current_page is null or current_page >= 0),
  total_pages integer check (total_pages is null or total_pages > 0),
  progress_percent integer not null check (progress_percent between 0 and 100),
  created_at timestamptz not null,
  updated_at timestamptz not null,
  last_opened_at timestamptz
);

create index books_user_updated_at_idx on public.books (user_id, updated_at desc);

create table public.articles (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  url text not null,
  author text,
  site_name text,
  status text not null check (status in ('saved', 'reading', 'finished')),
  progress_percent integer check (
    progress_percent is null or progress_percent between 0 and 100
  ),
  created_at timestamptz not null,
  updated_at timestamptz not null,
  last_opened_at timestamptz
);

create index articles_user_updated_at_idx on public.articles (user_id, updated_at desc);

create table public.captures (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid references public.books (id) on delete cascade,
  article_id uuid references public.articles (id) on delete cascade,
  text text not null,
  note text,
  page_number integer check (page_number is null or page_number >= 0),
  created_at timestamptz not null,
  updated_at timestamptz not null,
  constraint captures_one_source check (
    (book_id is not null and article_id is null)
    or (book_id is null and article_id is not null)
  )
);

create index captures_user_updated_at_idx on public.captures (user_id, updated_at desc);
create index captures_user_book_id_idx on public.captures (user_id, book_id);
create index captures_user_article_id_idx on public.captures (user_id, article_id);

alter table public.books enable row level security;
alter table public.articles enable row level security;
alter table public.captures enable row level security;

-- Books
create policy books_select on public.books
  for select using (auth.uid() = user_id);

create policy books_insert on public.books
  for insert with check (auth.uid() = user_id);

create policy books_update on public.books
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy books_delete on public.books
  for delete using (auth.uid() = user_id);

-- Articles
create policy articles_select on public.articles
  for select using (auth.uid() = user_id);

create policy articles_insert on public.articles
  for insert with check (auth.uid() = user_id);

create policy articles_update on public.articles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy articles_delete on public.articles
  for delete using (auth.uid() = user_id);

-- Captures: own rows, and referenced source must belong to the same user
create policy captures_select on public.captures
  for select using (auth.uid() = user_id);

create policy captures_delete on public.captures
  for delete using (auth.uid() = user_id);

create policy captures_insert on public.captures
  for insert with check (
    auth.uid() = user_id
    and (
      (
        book_id is not null
        and article_id is null
        and exists (
          select 1 from public.books b
          where b.id = book_id and b.user_id = auth.uid()
        )
      )
      or (
        article_id is not null
        and book_id is null
        and exists (
          select 1 from public.articles a
          where a.id = article_id and a.user_id = auth.uid()
        )
      )
    )
  );

create policy captures_update on public.captures
  for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and (
      (
        book_id is not null
        and article_id is null
        and exists (
          select 1 from public.books b
          where b.id = book_id and b.user_id = auth.uid()
        )
      )
      or (
        article_id is not null
        and book_id is null
        and exists (
          select 1 from public.articles a
          where a.id = article_id and a.user_id = auth.uid()
        )
      )
    )
  );
