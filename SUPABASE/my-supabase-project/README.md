# My Supabase Project

Este projeto é uma aplicação que utiliza o Supabase como banco de dados. Abaixo estão as instruções para instalação, configuração e uso.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Conta no Supabase

## Instalação

1. Clone o repositório:

   ```
   git clone <URL_DO_REPOSITORIO>
   cd my-supabase-project
   ```

2. Instale as dependências:

   ```
   npm install
   ```

   ou

   ```
   yarn install
   ```

3. Crie um arquivo `.env` na raiz do projeto e copie as variáveis do arquivo `.env.example`:

   ```
   SUPABASE_URL=<sua_url_do_supabase>
   SUPABASE_ANON_KEY=<sua_chave_anonima_do_supabase>
   ```

## Estrutura do Projeto

- `src/lib/supabase.ts`: Configuração e exportação da instância do cliente Supabase.
- `src/types/database.types.ts`: Definição dos tipos TypeScript para as tabelas do banco de dados.
- `src/app.ts`: Ponto de entrada da aplicação, inicializa o servidor e configura rotas.
- `src/config/supabase.config.ts`: Contém a configuração do Supabase.

## Uso

Para iniciar a aplicação, execute:

```
npm start
```

ou

```
yarn start
```

A aplicação estará disponível em `http://localhost:3000`.

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Faça um fork do repositório e envie um pull request.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.