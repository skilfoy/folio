create table if not exists folio_accounts (
  id text primary key,
  user_id text not null,
  email text not null,
  host text not null default 'www.amazon.com',
  auto_sync boolean not null default true,
  last_sync_at text,
  sync_error text,
  created_at timestamptz not null default now()
);

create unique index if not exists folio_accounts_user_email_idx on folio_accounts (user_id, email);
create index if not exists folio_accounts_user_idx on folio_accounts (user_id);

create table if not exists folio_orders (
  id text primary key,
  user_id text not null,
  account_id text not null references folio_accounts (id) on delete cascade,
  placed_at text not null,
  status text not null,
  items text not null
);

create index if not exists folio_orders_user_idx on folio_orders (user_id);
