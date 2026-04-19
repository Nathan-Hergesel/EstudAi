# Estudai 2.0

Aplicativo de organizacao academica com foco em planejamento, execucao e acompanhamento da rotina de estudos.

![Logo do projeto](src/img/Logo%20EstudAI.png)

## Visao do produto

O Estudai 2.0 reune, em uma experiencia unica, os fluxos essenciais da vida academica:

- organizacao de tarefas por prioridade e contexto
- visao de agenda para apoiar distribuicao de carga de estudo
- colaboracao em grupos para compartilhamento de atividades
- gestao de materias, horarios e preferencias pessoais

O objetivo central do projeto e reduzir friccao no dia a dia do estudante, oferecendo clareza sobre o que precisa ser feito, quando fazer e como acompanhar progresso.

## Arquitetura tecnica

- Frontend mobile construído com Expo + React Native + TypeScript
- Backend e persistencia suportados por Supabase (Auth e Postgres)
- Controle de acesso baseado em RLS no banco
- Camada de dados no app concentrada em servicos tipados

## Dominios funcionais

### Tarefas

- criacao, edicao e conclusao de tarefas
- filtros e acoes em lote
- suporte a materias cadastradas e texto livre

### Agenda

- visualizacao semanal e mensal
- consolidacao de compromissos de estudo
- destaque de estado de execucao das tarefas

### Grupos

- criacao e administracao de grupos de estudo
- convite de integrantes por email
- compartilhamento de tarefas e reunioes
- visualizacao de integrantes e papeis

### Conta

- atualizacao de perfil e preferencias
- organizacao de materias e horarios

## Estrutura do repositorio

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
```

## Execucao local

- `npm start` inicia o Expo em modo LAN, sem depender do tunel ngrok.
- `npm run start:tunnel` continua disponivel quando for necessario expor o app por tunel.
- `npm run start:local` mantem o comando padrao do Expo para ajustes manuais de conexao.

## Banco de dados

O arquivo [SUPABASE/setup-database.sql](SUPABASE/setup-database.sql) descreve o modelo de dados do projeto, incluindo tabelas, views, funcoes, politicas de seguranca e grants utilizados pelo aplicativo.

## Direcao do projeto

O Estudai 2.0 prioriza:

- experiencia mobile direta e objetiva
- consistencia visual entre modulos
- seguranca de dados com politicas explicitas de acesso
- evolucao incremental guiada por necessidades reais de uso academico

## Licenca

Uso academico e interno do projeto Estudai.
