-- EstudAI 2.0 - Setup completo Supabase
-- Execute este arquivo no SQL Editor do Supabase.

begin;

create extension if not exists pgcrypto;

-- =========================================
-- Tabelas
-- =========================================

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
  tipo text not null check (tipo in ('Atividade', 'Trabalho', 'Prova', 'Outro')),
  dificuldade text not null check (dificuldade in ('Facil', 'Medio', 'Dificil')),
  titulo text not null,
  descricao text not null,
  data_entrega timestamptz not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  tema_escuro boolean not null default false,
  mostrar_concluidas boolean not null default true,
  sincronizacao_auto boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================
-- Triggers
-- =========================================

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

-- =========================================
-- Views
-- =========================================

create or replace view public.tarefas_completas as
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

create or replace view public.horarios_completos as
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

-- =========================================
-- RPCs
-- =========================================

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

-- =========================================
-- Indices
-- =========================================

create index if not exists idx_materias_user_id on public.materias(user_id);
create index if not exists idx_tarefas_user_id on public.tarefas(user_id);
create index if not exists idx_tarefas_materia_id on public.tarefas(materia_id);
create index if not exists idx_tarefas_data_entrega on public.tarefas(data_entrega);
create index if not exists idx_tarefas_completed on public.tarefas(completed);
create index if not exists idx_horarios_user_id on public.horarios(user_id);
create index if not exists idx_horarios_dia_semana on public.horarios(dia_semana);

-- =========================================
-- RLS + Policies
-- =========================================

alter table public.profiles enable row level security;
alter table public.materias enable row level security;
alter table public.tarefas enable row level security;
alter table public.horarios enable row level security;
alter table public.configuracoes enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles
for select
to authenticated
using (id = auth.uid());

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

-- Views executam com invoker, então RLS das tabelas-base é aplicada.

-- =========================================
-- Grants
-- =========================================

grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
grant execute on all functions in schema public to authenticated;

alter default privileges in schema public
grant select, insert, update, delete on tables to authenticated;

alter default privileges in schema public
grant execute on functions to authenticated;

commit;
