begin;

insert into services (id, name, url, comment, slo, slourl)
  values (
    '448D1117-2AA7-49F2-B7C1-1CDAD0E5EB71',
    'foo-https',
    'https://foo.example.com/casHandler',
    'secure foo service',
    true,
    'https://foo.example.com/slo'
  );

insert into services (id, name, url, comment, slo)
  values (
    'F4428A41-DDEB-418A-AFAC-BC618D01A598',
    'foo-http',
    'http://foo.example.com/casHandler',
    'insecure foo service',
    true
  );

insert into services (id, name, url, comment)
  values (
    '06F67EE9-F8B8-40B2-B5D0-3EF12D8442FA',
    'bar-http',
    'http://bar.example.com/casHandler',
    'insecure foo service'
  );

insert into ticket_granting_tickets (tid, userid, expires)
  values (
    'TGT-015A7D08-D800-4134-8E87-2BA680B0721B',
    'fbar',
    now() + interval '1 year'
  );

-- a service with slo and a slourl
insert into service_tickets (tid, service_id, tgt_id, expires)
  values (
    'ST-46629AC6-A900-4085-B26E-691E5C7F787B',
    '448D1117-2AA7-49F2-B7C1-1CDAD0E5EB71',
    'TGT-015A7D08-D800-4134-8E87-2BA680B0721B',
    now() + interval '1 year'
  );
insert into tgt_service_tracking (tgt_tid, st_tid)
  values (
    'TGT-015A7D08-D800-4134-8E87-2BA680B0721B',
    'ST-46629AC6-A900-4085-B26E-691E5C7F787B'
  );

-- a service with slo but no slourl
insert into service_tickets (tid, service_id, tgt_id, expires)
  values (
    'ST-29601E67-A767-4843-B05D-03E59F7D88F7',
    'F4428A41-DDEB-418A-AFAC-BC618D01A598',
    'TGT-015A7D08-D800-4134-8E87-2BA680B0721B',
    now() + interval '1 year'
  );
insert into tgt_service_tracking (tgt_tid, st_tid)
  values (
    'TGT-015A7D08-D800-4134-8E87-2BA680B0721B',
    'ST-29601E67-A767-4843-B05D-03E59F7D88F7'
  );

-- a service without slo
insert into service_tickets (tid, service_id, tgt_id, expires)
  values (
    'ST-BBC3932E-94FB-4604-A724-420F28BC8548',
    '06F67EE9-F8B8-40B2-B5D0-3EF12D8442FA',
    'TGT-015A7D08-D800-4134-8E87-2BA680B0721B',
    now() + interval '1 year'
  );
insert into tgt_service_tracking (tgt_tid, st_tid)
  values (
    'TGT-015A7D08-D800-4134-8E87-2BA680B0721B',
    'ST-BBC3932E-94FB-4604-A724-420F28BC8548'
  );

commit;
