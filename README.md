# Estudai 2.0

Aplicativo mobile para organizacao academica com foco em tarefas, agenda de estudos e produtividade.

![Logo do projeto](src/img/Logo%20EstudAI%20(1).png)

## Visao geral

O Estudai 2.0 foi pensado para centralizar a rotina de estudo em um unico app:

- autenticacao de usuario
- cadastro e acompanhamento de tarefas
- agenda semanal e calendario mensal
- controle de materias, horarios e configuracoes
- indicadores de progresso academico

## Stack principal

- Expo 54
- React Native 0.81
- React 19
- TypeScript
- Supabase
- Expo Linear Gradient
- React Native Safe Area Context

## Funcionalidades

- Login e cadastro com Supabase
- Gestao de tarefas com busca e filtros
- Acoes em lote para tarefas selecionadas
- Cartoes de tarefas concluidas recolhidos por padrao
- Agenda com visao semanal e seletor mensal
- Modais para editar perfil, materias e horarios
- Configuracoes de notificacao e preferencias

## Estrutura do projeto

```text
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
  seed-test-data-nathan.sql
```

## Como executar localmente

### 1. Requisitos

- Node.js 18+
- npm 9+
- Expo CLI (via npx expo)

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar ambiente

Crie o arquivo .env com as variaveis do Supabase:

```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

### 4. Rodar o app

```bash
npm run start
```

Comandos rapidos:

- Android: npm run android
- iOS: npm run ios
- Web: npm run web

## Banco de dados

Os scripts SQL estao em [SUPABASE/setup-database.sql](SUPABASE/setup-database.sql) e [SUPABASE/seed-test-data-nathan.sql](SUPABASE/seed-test-data-nathan.sql).

## Scripts disponiveis

- start: inicia o servidor Expo
- android: abre no Android
- ios: abre no iOS
- web: abre no navegador

## Proximos passos sugeridos

- adicionar testes de interface para fluxos criticos
- criar pipeline CI para lint e build
- publicar release beta para validacao com usuarios

## Licenca

Uso academico e interno do projeto Estudai.
