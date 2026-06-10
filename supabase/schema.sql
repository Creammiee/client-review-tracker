-- Client Review Tracker — Database Schema
-- Run this in the Supabase SQL editor to set up the table.

create table if not exists review_requests (
  id           uuid primary key default gen_random_uuid(),
  client_name  text not null,
  product_asin text not null,
  status       text not null default 'Pending'
                 constraint status_check check (status in ('Pending', 'In Progress', 'Done')),
  created_at   timestamptz not null default now(),

  -- Prevent duplicate requests for the same client + ASIN
  constraint unique_client_asin unique (client_name, product_asin)
);

-- Optional: add an index to speed up status-based filtering
create index if not exists idx_review_requests_status on review_requests(status);
