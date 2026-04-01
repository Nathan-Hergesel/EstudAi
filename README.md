# Estudai 2.0

Aplicativo mobile para organizacao academica com foco em tarefas, agenda de estudos e produtividade.

![Logo do projeto](src/img/Logo%20EstudAI.png)

## Visao geral

O Estudai 2.0 centraliza a rotina de estudo em um unico app:

- autenticacao de usuario
- cadastro e acompanhamento de tarefas
- agenda semanal e calendario mensal
- controle de materias, horarios e configuracoes
- indicadores de progresso academico

## Arquitetura

- Frontend: Expo + React Native
- Backend/API: Supabase (Auth + Postgres + RLS)
- Camada de dados no app: `@supabase/supabase-js`
- Prisma: usado para schema e migrations do banco (nao roda no app React Native)

## Stack principal

- Expo 54
- React Native 0.81
- React 19
- TypeScript
- Supabase
- Prisma 7
- Expo Linear Gradient
- React Native Safe Area Context

## Funcionalidades

- login e cadastro com Supabase
- gestao de tarefas com busca e filtros
- acoes em lote para tarefas selecionadas
- cartoes de tarefas concluidas recolhidos por padrao
- agenda com visao semanal e seletor mensal
- modais para editar perfil, materias e horarios
- configuracoes de notificacao e preferencias

## Estrutura do projeto

```text
prisma/
  migrations/
    202604010001_baseline_clean/
    202604010002_teste/
  schema.prisma
src/
  components/
  contexts/
  hooks/
  pages/
    agenda/
    chat-ia/
    conta/
    grupos/
    login/
    tarefas/
  services/
  types/
  utils/
SUPABASE/
  setup-database.sql
prisma.config.ts
```

## Como executar localmente

### 1. Requisitos

- Node.js 20+
- npm 9+
- Expo CLI (via npx expo)

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar ambiente

Crie o arquivo `.env` com as variaveis do Supabase e do Prisma:

```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...

DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

Observacao:

- `DATABASE_URL` e `DIRECT_URL` sao lidas pelo Prisma em `prisma.config.ts`.
- Em ambiente local, pode usar a mesma URL nas duas variaveis.

### 4. Rodar o app

```bash
npm run start
```

Comandos rapidos:

- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`

## Banco de dados e migrations

O script SQL base esta em [SUPABASE/setup-database.sql](SUPABASE/setup-database.sql).

O schema Prisma atual esta focado nas tabelas do app em `public` e na relacao com `auth.users`.

### Estado atual das migrations

- `202604010001_baseline_clean`: baseline limpa do schema atual
- `202604010002_teste`: migration de teste (vazia) aplicada

## Scripts disponiveis

- `start`: inicia o servidor Expo
- `android`: abre no Android
- `ios`: abre no iOS
- `web`: abre no navegador

## Licenca

Uso academico e interno do projeto Estudai.
