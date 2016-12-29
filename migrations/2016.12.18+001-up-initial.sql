create table if not exists services (
  id uuid primary key,
  name text unique not null,
  url text unique not null,
  comment text,
  slo boolean default false,
  sloType integer default 0,
  sloUrl text
);

comment on table services is 'services that are allowed to use the cas server';
comment on column services.slo is 'enable or disable SLO support';
comment on column services.sloType is 'reserved for future use';
comment on column services.sloUrl is 'the URL to post the SLO XML payload to';

create table ticket_granting_tickets (
  tid text primary key,
  userid text not null,
  valid boolean default true,
  created timestamptz default now(),
  expires timestamptz default (now() + interval '30 minutes')
);

comment on table ticket_granting_tickets is 'record of issued ticket granting tickets';

create table service_tickets (
  tid text primary key,
  service_id uuid not null references services (id),
  tgt_id text not null references ticket_granting_tickets (tid),
  valid boolean default true,
  created timestamptz default now(),
  expires timestamptz default (now() + interval '30 minutes')
);

create index service_tickets_service_id_index on service_tickets (service_id);
create index service_tickets_tgt_id_index on service_tickets (tgt_id);

create table tgt_service_tracking (
  tgt_tid text not null references ticket_granting_tickets (tid),
  st_tid text not null references service_tickets (tid),
  created timestamptz default now()
);

comment on table tgt_service_tracking is 'records uses of a tgt by services';

create index tgt_service_tracking_tgt_index on tgt_service_tracking (tgt_tid);
create index tgt_service_tracking_st_index on tgt_service_tracking (st_tid);
