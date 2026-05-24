begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text not null unique,
  instituicao text,
  curso text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.materias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  nome text not null,
  codigo text,
  professor text,
  cor text default '#2563EB',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tarefas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  materia_id uuid references public.materias(id) on delete set null,
  tipo text not null check (tipo in ('Atividade', 'Leitura', 'Trabalho', 'Prova', 'Outro')),
  dificuldade text not null check (dificuldade in ('Facil', 'Medio', 'Dificil')),
  titulo text not null,
  descricao text not null,
  data_entrega timestamptz not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tarefas drop constraint if exists tarefas_tipo_check;
alter table public.tarefas
add constraint tarefas_tipo_check
check (tipo in ('Atividade', 'Leitura', 'Trabalho', 'Prova', 'Outro'));

create table if not exists public.horarios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  materia_id uuid not null references public.materias(id) on delete cascade,
  dia_semana int not null check (dia_semana between 0 and 6),
  hora_inicio time not null,
  hora_fim time not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (hora_fim > hora_inicio)
);

create table if not exists public.configuracoes (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  notificacoes_ativas boolean not null default true,
  lembrete_tarefas boolean not null default true,
  alerta_vencimento boolean not null default true,
  horas_antecedencia int not null default 24 check (horas_antecedencia in (24, 48, 72)),
  mostrar_concluidas boolean not null default true,
  sincronizacao_auto boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.grupos_estudo (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  nome text not null,
  descricao text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.grupos_estudo
alter column owner_id set default auth.uid();

create table if not exists public.grupos_membros (
  grupo_id uuid not null references public.grupos_estudo(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  papel text not null default 'member' check (papel in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (grupo_id, user_id)
);

create table if not exists public.tarefas_compartilhadas_grupo (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references public.grupos_estudo(id) on delete cascade,
  tarefa_id uuid not null references public.tarefas(id) on delete cascade,
  compartilhado_por uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (grupo_id, tarefa_id)
);

create table if not exists public.tarefas_salvas_grupo (
  tarefa_compartilhada_id uuid not null references public.tarefas_compartilhadas_grupo(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tarefa_compartilhada_id, user_id)
);

create table if not exists public.reunioes_grupo (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references public.grupos_estudo(id) on delete cascade,
  criado_por uuid not null references public.profiles(id) on delete cascade,
  titulo text not null,
  descricao text,
  data_reuniao timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.configuracoes
drop column if exists tema_escuro;

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at_column();

drop trigger if exists trg_materias_updated_at on public.materias;
create trigger trg_materias_updated_at
before update on public.materias
for each row
execute function public.update_updated_at_column();

drop trigger if exists trg_tarefas_updated_at on public.tarefas;
create trigger trg_tarefas_updated_at
before update on public.tarefas
for each row
execute function public.update_updated_at_column();

drop trigger if exists trg_horarios_updated_at on public.horarios;
create trigger trg_horarios_updated_at
before update on public.horarios
for each row
execute function public.update_updated_at_column();

drop trigger if exists trg_configuracoes_updated_at on public.configuracoes;
create trigger trg_configuracoes_updated_at
before update on public.configuracoes
for each row
execute function public.update_updated_at_column();

drop trigger if exists trg_grupos_estudo_updated_at on public.grupos_estudo;
create trigger trg_grupos_estudo_updated_at
before update on public.grupos_estudo
for each row
execute function public.update_updated_at_column();

drop trigger if exists trg_reunioes_grupo_updated_at on public.reunioes_grupo;
create trigger trg_reunioes_grupo_updated_at
before update on public.reunioes_grupo
for each row
execute function public.update_updated_at_column();

create or replace function public.handle_grupo_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.grupos_membros (grupo_id, user_id, papel)
  values (new.id, new.owner_id, 'owner')
  on conflict (grupo_id, user_id) do update
    set papel = 'owner';

  return new;
end;
$$;

drop trigger if exists trg_grupos_owner_membership on public.grupos_estudo;
create trigger trg_grupos_owner_membership
after insert on public.grupos_estudo
for each row
execute function public.handle_grupo_owner_membership();

insert into public.grupos_membros (grupo_id, user_id, papel)
select g.id, g.owner_id, 'owner'
from public.grupos_estudo g
on conflict (grupo_id, user_id) do update
  set papel = 'owner';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nome, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do update
    set nome = excluded.nome,
        email = excluded.email,
        updated_at = now();

  insert into public.configuracoes (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace view public.tarefas_completas
with (security_invoker = true) as
select
  t.id,
  t.user_id,
  t.materia_id,
  t.tipo,
  t.dificuldade,
  t.titulo,
  t.descricao,
  t.data_entrega,
  t.completed,
  t.created_at,
  t.updated_at,
  m.nome as materia_nome
from public.tarefas t
left join public.materias m on m.id = t.materia_id;

create or replace view public.horarios_completos
with (security_invoker = true) as
select
  h.id,
  h.user_id,
  h.materia_id,
  h.dia_semana,
  h.hora_inicio,
  h.hora_fim,
  h.created_at,
  h.updated_at,
  m.nome as materia_nome
from public.horarios h
join public.materias m on m.id = h.materia_id;

create or replace view public.grupos_do_usuario
with (security_invoker = true) as
select
  gm.user_id,
  gm.grupo_id,
  gm.papel,
  g.nome,
  g.descricao,
  g.owner_id,
  g.created_at,
  g.updated_at
from public.grupos_membros gm
join public.grupos_estudo g on g.id = gm.grupo_id;

create or replace view public.tarefas_compartilhadas_completas
with (security_invoker = true) as
select
  tcg.id,
  tcg.grupo_id,
  g.nome as grupo_nome,
  tcg.tarefa_id,
  tcg.compartilhado_por,
  p.nome as compartilhado_por_nome,
  tcg.created_at as compartilhado_em,
  t.tipo,
  t.titulo,
  t.descricao,
  t.data_entrega,
  t.completed,
  t.materia_id,
  m.nome as materia_nome
from public.tarefas_compartilhadas_grupo tcg
join public.grupos_estudo g on g.id = tcg.grupo_id
join public.tarefas t on t.id = tcg.tarefa_id
left join public.materias m on m.id = t.materia_id
left join public.profiles p on p.id = tcg.compartilhado_por;

create or replace view public.reunioes_grupo_completas
with (security_invoker = true) as
select
  rg.id,
  rg.grupo_id,
  g.nome as grupo_nome,
  rg.criado_por,
  p.nome as criado_por_nome,
  rg.titulo,
  rg.descricao,
  rg.data_reuniao,
  rg.created_at,
  rg.updated_at
from public.reunioes_grupo rg
join public.grupos_estudo g on g.id = rg.grupo_id
left join public.profiles p on p.id = rg.criado_por;

create or replace function public.get_tarefas_pendentes(usuario_id uuid)
returns setof public.tarefas_completas
language sql
stable
as $$
  select *
  from public.tarefas_completas
  where user_id = usuario_id
    and completed = false
  order by data_entrega asc;
$$;

create or replace function public.get_horarios_dia(usuario_id uuid, dia int)
returns setof public.horarios_completos
language sql
stable
as $$
  select *
  from public.horarios_completos
  where user_id = usuario_id
    and dia_semana = dia
  order by hora_inicio asc;
$$;

create or replace function public.listar_integrantes_grupo(
  grupo_uuid uuid
)
returns table(user_id uuid, papel text, nome text, email text)
language plpgsql
security definer
set search_path = public
as $$
declare
  solicitante uuid := auth.uid();
begin
  if solicitante is null then
    raise exception 'Usuário não autenticado';
  end if;

  if grupo_uuid is null then
    raise exception 'Grupo inválido';
  end if;

  if not exists (
    select 1
    from public.grupos_membros gm
    where gm.grupo_id = grupo_uuid
      and gm.user_id = solicitante
  ) then
    raise exception 'Sem permissão para acessar integrantes deste grupo';
  end if;

  return query
  select
    gm.user_id,
    gm.papel,
    p.nome,
    p.email
  from public.grupos_membros gm
  left join public.profiles p on p.id = gm.user_id
  where gm.grupo_id = grupo_uuid
  order by case when gm.papel = 'owner' then 0 else 1 end, lower(coalesce(p.nome, p.email, ''));
end;
$$;

create or replace function public.convidar_membros_grupo_por_email(
  grupo_uuid uuid,
  emails_lista text[]
)
returns table(email text, status text, user_id uuid)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_solicitante uuid := auth.uid();
  v_email_item text;
  v_email_normalizado text;
  v_target_user_id uuid;
  v_target_email text;
  v_target_nome text;
begin
  if v_solicitante is null then
    raise exception 'Usuário não autenticado';
  end if;

  if grupo_uuid is null then
    raise exception 'Grupo inválido';
  end if;

  if not exists (
    select 1
    from public.grupos_estudo as g
    where g.id = grupo_uuid
      and g.owner_id = v_solicitante
  ) then
    raise exception 'Sem permissão para convidar membros neste grupo';
  end if;

  if emails_lista is null or coalesce(array_length(emails_lista, 1), 0) = 0 then
    return;
  end if;

  foreach v_email_item in array emails_lista loop
    v_email_normalizado := lower(trim(v_email_item));

    if v_email_normalizado = '' then
      continue;
    end if;

    v_target_user_id := null;
    v_target_email := null;
    v_target_nome := null;

    select
      u.id,
      lower(u.email),
      coalesce(u.raw_user_meta_data ->> 'nome', split_part(u.email, '@', 1))
    into v_target_user_id, v_target_email, v_target_nome
    from auth.users as u
    where lower(u.email) = v_email_normalizado
    limit 1;

    if v_target_user_id is null then
      return query
      select v_email_normalizado as email, 'nao_encontrado'::text as status, null::uuid as user_id;
      continue;
    end if;

    insert into public.profiles (id, nome, email)
    values (
      v_target_user_id,
      coalesce(v_target_nome, split_part(v_target_email, '@', 1), split_part(v_email_normalizado, '@', 1)),
      coalesce(v_target_email, v_email_normalizado)
    )
    on conflict (id) do update
      set email = excluded.email,
          updated_at = now();

    if exists (
      select 1
      from public.grupos_membros as gm
      where gm.grupo_id = grupo_uuid
        and gm.user_id = v_target_user_id
    ) then
      return query
      select v_email_normalizado as email, 'ja_eh_membro'::text as status, v_target_user_id as user_id;
      continue;
    end if;

    insert into public.grupos_membros (grupo_id, user_id, papel)
    values (grupo_uuid, v_target_user_id, 'member')
    on conflict on constraint grupos_membros_pkey do nothing;

    return query
    select v_email_normalizado as email, 'convidado'::text as status, v_target_user_id as user_id;
  end loop;
end;
$$;

create index if not exists idx_materias_user_id on public.materias(user_id);
create index if not exists idx_tarefas_user_id on public.tarefas(user_id);
create index if not exists idx_tarefas_materia_id on public.tarefas(materia_id);
create index if not exists idx_tarefas_data_entrega on public.tarefas(data_entrega);
create index if not exists idx_tarefas_completed on public.tarefas(completed);
create index if not exists idx_horarios_user_id on public.horarios(user_id);
create index if not exists idx_horarios_dia_semana on public.horarios(dia_semana);
create unique index if not exists idx_grupos_estudo_owner_nome on public.grupos_estudo(owner_id, nome);
create index if not exists idx_grupos_membros_user_id on public.grupos_membros(user_id);
create index if not exists idx_tarefas_comp_grupo_grupo_id on public.tarefas_compartilhadas_grupo(grupo_id);
create index if not exists idx_tarefas_comp_grupo_tarefa_id on public.tarefas_compartilhadas_grupo(tarefa_id);
create index if not exists idx_tarefas_salvas_user_id on public.tarefas_salvas_grupo(user_id);
create index if not exists idx_reunioes_grupo_grupo_id on public.reunioes_grupo(grupo_id);
create index if not exists idx_reunioes_grupo_data on public.reunioes_grupo(data_reuniao);

alter table public.profiles enable row level security;
alter table public.materias enable row level security;
alter table public.tarefas enable row level security;
alter table public.horarios enable row level security;
alter table public.configuracoes enable row level security;
alter table public.grupos_estudo enable row level security;
alter table public.grupos_membros enable row level security;
alter table public.tarefas_compartilhadas_grupo enable row level security;
alter table public.tarefas_salvas_grupo enable row level security;
alter table public.reunioes_grupo enable row level security;

-- Usuários veem o próprio perfil + perfis de co-membros em grupos compartilhados
-- (necessário para views tarefas_compartilhadas_completas e reunioes_grupo_completas)
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_select_group_member on public.profiles;
create policy profiles_select_group_member
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or exists (
    select 1
    from public.grupos_membros gm1
    join public.grupos_membros gm2 on gm1.grupo_id = gm2.grupo_id
    where gm1.user_id = auth.uid()
      and gm2.user_id = profiles.id
  )
);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists materias_all_own on public.materias;
create policy materias_all_own
on public.materias
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists tarefas_all_own on public.tarefas;
create policy tarefas_all_own
on public.tarefas
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists horarios_all_own on public.horarios;
create policy horarios_all_own
on public.horarios
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists configuracoes_all_own on public.configuracoes;
create policy configuracoes_all_own
on public.configuracoes
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists grupos_estudo_select_member on public.grupos_estudo;
create policy grupos_estudo_select_member
on public.grupos_estudo
for select
to authenticated
using (
  owner_id = auth.uid()
  or exists (
    select 1
    from public.grupos_membros gm
    where gm.grupo_id = grupos_estudo.id
      and gm.user_id = auth.uid()
  )
);

drop policy if exists grupos_estudo_insert_owner on public.grupos_estudo;
create policy grupos_estudo_insert_owner
on public.grupos_estudo
for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists grupos_estudo_update_owner on public.grupos_estudo;
create policy grupos_estudo_update_owner
on public.grupos_estudo
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists grupos_estudo_delete_owner on public.grupos_estudo;
create policy grupos_estudo_delete_owner
on public.grupos_estudo
for delete
to authenticated
using (owner_id = auth.uid());

-- Membros podem ver todas as linhas de grupos em que participam
-- (necessário para o fallback direto em listarIntegrantesGrupo e para a view grupos_do_usuario)
drop policy if exists grupos_membros_select_self on public.grupos_membros;
drop policy if exists grupos_membros_select_group_member on public.grupos_membros;
create policy grupos_membros_select_group_member
on public.grupos_membros
for select
to authenticated
using (
  exists (
    select 1
    from public.grupos_membros gm_self
    where gm_self.grupo_id = grupos_membros.grupo_id
      and gm_self.user_id = auth.uid()
  )
);

drop policy if exists grupos_membros_insert_owner on public.grupos_membros;
create policy grupos_membros_insert_owner
on public.grupos_membros
for insert
to authenticated
with check (
  exists (
    select 1
    from public.grupos_estudo g
    where g.id = grupos_membros.grupo_id
      and g.owner_id = auth.uid()
  )
);

drop policy if exists grupos_membros_update_owner on public.grupos_membros;
create policy grupos_membros_update_owner
on public.grupos_membros
for update
to authenticated
using (
  exists (
    select 1
    from public.grupos_estudo g
    where g.id = grupos_membros.grupo_id
      and g.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.grupos_estudo g
    where g.id = grupos_membros.grupo_id
      and g.owner_id = auth.uid()
  )
);

drop policy if exists grupos_membros_delete_owner on public.grupos_membros;
create policy grupos_membros_delete_owner
on public.grupos_membros
for delete
to authenticated
using (
  exists (
    select 1
    from public.grupos_estudo g
    where g.id = grupos_membros.grupo_id
      and g.owner_id = auth.uid()
  )
);

drop policy if exists grupos_membros_delete_self_member on public.grupos_membros;
create policy grupos_membros_delete_self_member
on public.grupos_membros
for delete
to authenticated
using (
  user_id = auth.uid()
  and papel = 'member'
);

drop policy if exists tarefas_comp_grupo_select_member on public.tarefas_compartilhadas_grupo;
create policy tarefas_comp_grupo_select_member
on public.tarefas_compartilhadas_grupo
for select
to authenticated
using (
  exists (
    select 1
    from public.grupos_membros gm
    where gm.grupo_id = tarefas_compartilhadas_grupo.grupo_id
      and gm.user_id = auth.uid()
  )
);

drop policy if exists tarefas_comp_grupo_insert_member on public.tarefas_compartilhadas_grupo;
create policy tarefas_comp_grupo_insert_member
on public.tarefas_compartilhadas_grupo
for insert
to authenticated
with check (
  compartilhado_por = auth.uid()
  and exists (
    select 1
    from public.grupos_membros gm
    where gm.grupo_id = tarefas_compartilhadas_grupo.grupo_id
      and gm.user_id = auth.uid()
  )
);

drop policy if exists tarefas_comp_grupo_delete_owner_or_author on public.tarefas_compartilhadas_grupo;
create policy tarefas_comp_grupo_delete_owner_or_author
on public.tarefas_compartilhadas_grupo
for delete
to authenticated
using (
  compartilhado_por = auth.uid()
  or exists (
    select 1
    from public.grupos_estudo g
    where g.id = tarefas_compartilhadas_grupo.grupo_id
      and g.owner_id = auth.uid()
  )
);

drop policy if exists tarefas_salvas_select_own on public.tarefas_salvas_grupo;
create policy tarefas_salvas_select_own
on public.tarefas_salvas_grupo
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists tarefas_salvas_insert_own on public.tarefas_salvas_grupo;
create policy tarefas_salvas_insert_own
on public.tarefas_salvas_grupo
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.tarefas_compartilhadas_grupo tcg
    join public.grupos_membros gm on gm.grupo_id = tcg.grupo_id
    where tcg.id = tarefas_salvas_grupo.tarefa_compartilhada_id
      and gm.user_id = auth.uid()
  )
);

drop policy if exists tarefas_salvas_delete_own on public.tarefas_salvas_grupo;
create policy tarefas_salvas_delete_own
on public.tarefas_salvas_grupo
for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists reunioes_grupo_select_member on public.reunioes_grupo;
create policy reunioes_grupo_select_member
on public.reunioes_grupo
for select
to authenticated
using (
  exists (
    select 1
    from public.grupos_membros gm
    where gm.grupo_id = reunioes_grupo.grupo_id
      and gm.user_id = auth.uid()
  )
);

drop policy if exists reunioes_grupo_insert_member on public.reunioes_grupo;
create policy reunioes_grupo_insert_member
on public.reunioes_grupo
for insert
to authenticated
with check (
  criado_por = auth.uid()
  and exists (
    select 1
    from public.grupos_membros gm
    where gm.grupo_id = reunioes_grupo.grupo_id
      and gm.user_id = auth.uid()
  )
);

drop policy if exists reunioes_grupo_update_owner_or_author on public.reunioes_grupo;
create policy reunioes_grupo_update_owner_or_author
on public.reunioes_grupo
for update
to authenticated
using (
  criado_por = auth.uid()
  or exists (
    select 1
    from public.grupos_estudo g
    where g.id = reunioes_grupo.grupo_id
      and g.owner_id = auth.uid()
  )
)
with check (
  criado_por = auth.uid()
  or exists (
    select 1
    from public.grupos_estudo g
    where g.id = reunioes_grupo.grupo_id
      and g.owner_id = auth.uid()
  )
);

drop policy if exists reunioes_grupo_delete_owner_or_author on public.reunioes_grupo;
create policy reunioes_grupo_delete_owner_or_author
on public.reunioes_grupo
for delete
to authenticated
using (
  criado_por = auth.uid()
  or exists (
    select 1
    from public.grupos_estudo g
    where g.id = reunioes_grupo.grupo_id
      and g.owner_id = auth.uid()
  )
);

grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
grant execute on all functions in schema public to authenticated;
grant execute on function public.convidar_membros_grupo_por_email(uuid, text[]) to authenticated;

alter default privileges in schema public
grant select, insert, update, delete on tables to authenticated;

alter default privileges in schema public
grant execute on functions to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'tarefas_compartilhadas_grupo'
    ) then
      alter publication supabase_realtime add table public.tarefas_compartilhadas_grupo;
    end if;

    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'tarefas_salvas_grupo'
    ) then
      alter publication supabase_realtime add table public.tarefas_salvas_grupo;
    end if;

    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'reunioes_grupo'
    ) then
      alter publication supabase_realtime add table public.reunioes_grupo;
    end if;

    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'grupos_membros'
    ) then
      alter publication supabase_realtime add table public.grupos_membros;
    end if;
  end if;
exception
  when undefined_table then null;
  when undefined_object then null;
end;
$$;

commit;
