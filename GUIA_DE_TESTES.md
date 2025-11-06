# 🧪 Guia de Testes - EstudAI + Supabase

Este documento descreve os testes essenciais para validar a integração do aplicativo EstudAI com o Supabase.

---

## 📋 Pré-requisitos

1. ✅ Banco de dados Supabase criado e configurado (SQL executado)
2. ✅ Arquivo `.env` com as credenciais do Supabase
3. ✅ Dependências instaladas (`npm install`)
4. ✅ App rodando no emulador ou dispositivo físico

---

## 🔐 Testes de Autenticação

### 1. Cadastro de Novo Usuário

**Passos:**
1. Abra o aplicativo
2. Na tela de login, toque em "Criar Conta"
3. Preencha:
   - Nome: "João da Silva"
   - Email: "joao.teste@example.com"
   - Senha: "senha123" (mínimo 6 caracteres)
4. Toque em "Criar Conta"

**Resultado Esperado:**
- ✅ Mensagem de sucesso
- ✅ Redirecionamento automático para a tela principal
- ✅ Perfil criado no Supabase (tabela `profiles`)
- ✅ Configurações padrão criadas (tabela `configuracoes`)

**Verificação no Supabase:**
```sql
SELECT * FROM profiles WHERE email = 'joao.teste@example.com';
SELECT * FROM configuracoes WHERE user_id = (SELECT id FROM profiles WHERE email = 'joao.teste@example.com');
```

---

### 2. Login

**Passos:**
1. Faça logout (Conta → Sair da Conta)
2. Na tela de login, insira:
   - Email: "joao.teste@example.com"
   - Senha: "senha123"
3. Toque em "Entrar"

**Resultado Esperado:**
- ✅ Login bem-sucedido
- ✅ Redirecionamento para tela principal
- ✅ Dados do perfil carregados (nome aparece na tela Conta)

---

### 3. Persistência de Sessão

**Passos:**
1. Faça login no app
2. **Feche completamente o app** (force stop ou remova da lista de apps recentes)
3. Abra o app novamente

**Resultado Esperado:**
- ✅ Usuário continua logado
- ✅ Não precisa fazer login novamente
- ✅ Dados carregam automaticamente

---

## 📚 Testes de Matérias

### 4. Criar Matéria

**Passos:**
1. Vá para a aba "Conta"
2. Toque em "Matérias"
3. Toque em "+ Adicionar Matéria"
4. Preencha:
   - Nome: "Cálculo I"
   - Código: "MAT101"
   - Professor: "Prof. Maria Santos"
   - Cor: Selecione uma cor (ex: azul)
5. Toque em "Adicionar"

**Resultado Esperado:**
- ✅ Alerta "Matéria adicionada com sucesso!"
- ✅ Matéria aparece na lista imediatamente
- ✅ Formulário é limpo e fechado

**Verificação no Supabase:**
```sql
SELECT * FROM materias WHERE nome = 'Cálculo I';
```

---

### 5. Excluir Matéria

**Passos:**
1. Na lista de matérias, toque em "Excluir" em uma matéria
2. Confirme a exclusão no alerta

**Resultado Esperado:**
- ✅ Confirmação de exclusão solicitada
- ✅ Matéria removida da lista após confirmação
- ✅ Alerta "Matéria removida com sucesso!"

**Verificação no Supabase:**
```sql
-- A matéria não deve mais existir
SELECT * FROM materias WHERE nome = 'Cálculo I';
```

---

### 6. Persistência de Matérias

**Passos:**
1. Adicione 2-3 matérias
2. Feche o modal de matérias
3. **Feche completamente o app**
4. Abra o app novamente
5. Vá em Conta → Matérias

**Resultado Esperado:**
- ✅ Todas as matérias aparecem na lista
- ✅ Dados mantidos (nome, professor, código, cor)

---

## 🕒 Testes de Horários

### 7. Criar Horário

**Passos:**
1. Certifique-se de ter pelo menos 1 matéria cadastrada
2. Vá para Conta → Horários
3. Toque em "+ Adicionar Horário"
4. Preencha:
   - Matéria: Selecione "Cálculo I"
   - Dia da Semana: "Segunda"
   - Início: "08:00"
   - Fim: "10:00"
   - Local: "Sala 201"
   - Observações: "Trazer calculadora"
5. Toque em "Adicionar"

**Resultado Esperado:**
- ✅ Alerta "Horário adicionado com sucesso!"
- ✅ Horário aparece agrupado por dia da semana
- ✅ Cor da matéria aparece na borda esquerda

**Verificação no Supabase:**
```sql
SELECT h.*, m.nome as materia_nome 
FROM horarios h 
JOIN materias m ON h.materia_id = m.id 
WHERE h.dia_semana = 1;  -- Segunda-feira
```

---

### 8. Excluir Horário

**Passos:**
1. Na lista de horários, toque em "Excluir"
2. Confirme a exclusão

**Resultado Esperado:**
- ✅ Confirmação solicitada
- ✅ Horário removido da lista
- ✅ Alerta "Horário removido com sucesso!"

---

### 9. Validação de Horários

**Passos:**
1. Tente criar um horário sem selecionar matéria
2. Tente criar com hora inválida (ex: "25:00")
3. Tente criar com hora no formato errado (ex: "8:0")

**Resultado Esperado:**
- ✅ Alerta "Selecione uma matéria"
- ✅ Alerta "Use o formato HH:MM para os horários"
- ✅ Validação impede salvamento

---

### 10. Horários Agrupados por Dia

**Passos:**
1. Adicione horários em diferentes dias (Segunda, Terça, Quarta)
2. Adicione 2 horários na mesma Segunda-feira (ex: 08:00-10:00 e 14:00-16:00)

**Resultado Esperado:**
- ✅ Horários aparecem separados por dia da semana
- ✅ Dentro de cada dia, estão ordenados por hora de início
- ✅ Contador mostra quantidade (ex: "Segunda (2)")

---

### 11. Persistência de Horários

**Passos:**
1. Adicione 3-4 horários em dias diferentes
2. Feche o modal
3. **Feche completamente o app**
4. Abra o app novamente
5. Vá em Conta → Horários

**Resultado Esperado:**
- ✅ Todos os horários aparecem
- ✅ Agrupamento por dia mantido
- ✅ Ordenação correta

---

## ✅ Testes de Tarefas

### 12. Criar Tarefa

**Passos:**
1. Vá para a aba "Tarefas"
2. Toque em "Criar"
3. Preencha:
   - Título: "Resolver lista de exercícios"
   - Tipo: "ATIVIDADE"
   - Matéria: "Cálculo I"
   - Data: "15/11/2025 14:30"
   - Dificuldade: "Médio"
   - Descrição: "Exercícios do capítulo 3"
4. Toque em "Salvar"

**Resultado Esperado:**
- ✅ Modal fecha
- ✅ Tarefa aparece na lista
- ✅ Badge com o tipo correto (cor verde para ATIVIDADE)

**Verificação no Supabase:**
```sql
SELECT t.*, m.nome as materia_nome 
FROM tarefas t 
LEFT JOIN materias m ON t.materia_id = m.id 
WHERE t.titulo = 'Resolver lista de exercícios';
```

---

### 13. Marcar Tarefa como Concluída

**Passos:**
1. Na lista de tarefas, toque no checkbox ao lado de uma tarefa

**Resultado Esperado:**
- ✅ Checkbox marca/desmarca
- ✅ Campo `completed` atualizado no banco

**Verificação no Supabase:**
```sql
SELECT titulo, completed FROM tarefas WHERE titulo = 'Resolver lista de exercícios';
```

---

### 14. Editar Tarefa

**Passos:**
1. Toque em "Editar" na navegação superior
2. Toque em uma tarefa da lista
3. Altere o título para "Resolver lista COMPLETA de exercícios"
4. Toque em "Salvar"

**Resultado Esperado:**
- ✅ Alteração salva
- ✅ Novo título aparece na lista

---

### 15. Excluir Tarefa

**Passos:**
1. Em modo edição, toque no ícone de lixeira de uma tarefa
2. Confirme a exclusão

**Resultado Esperado:**
- ✅ Tarefa removida da lista
- ✅ Removida do banco de dados

---

### 16. Persistência de Tarefas

**Passos:**
1. Crie 3-4 tarefas
2. Marque 1-2 como concluídas
3. **Feche completamente o app**
4. Abra o app novamente

**Resultado Esperado:**
- ✅ Todas as tarefas aparecem
- ✅ Status de conclusão mantido

---

## 👤 Testes de Perfil

### 17. Editar Perfil

**Passos:**
1. Vá para Conta → Editar Conta
2. Altere:
   - Nome: "João Silva Santos"
   - Instituição: "UNISO"
   - Curso: "Engenharia de Software"
3. Toque em "Salvar"

**Resultado Esperado:**
- ✅ Alerta "Perfil atualizado com sucesso!"
- ✅ Nome atualizado no card de perfil
- ✅ Alterações persistem após reabrir o app

**Verificação no Supabase:**
```sql
SELECT nome, instituicao, curso FROM profiles WHERE email = 'joao.teste@example.com';
```

---

## ⚙️ Testes de Configurações

### 18. Alterar Configurações

**Passos:**
1. Vá para Conta → Configurações
2. Ative/desative algumas opções:
   - Notificações Ativas: ON
   - Tema Escuro: OFF
   - Mostrar Concluídas: ON
3. Toque em "Salvar"

**Resultado Esperado:**
- ✅ Alerta "Configurações atualizadas!"
- ✅ Configurações mantidas após reabrir

**Verificação no Supabase:**
```sql
SELECT * FROM configuracoes WHERE user_id = (SELECT id FROM profiles WHERE email = 'joao.teste@example.com');
```

---

## 🔒 Testes de Segurança (RLS)

### 19. Isolamento de Dados entre Usuários

**Passos:**
1. Crie um usuário A e adicione matérias e tarefas
2. Faça logout
3. Crie um usuário B
4. Verifique se as matérias/tarefas do usuário A aparecem

**Resultado Esperado:**
- ✅ Usuário B NÃO vê dados do usuário A
- ✅ Cada usuário vê apenas seus próprios dados

**Verificação no Supabase:**
Execute no SQL Editor (sem estar logado no app):
```sql
-- Deve retornar erro ou vazio (RLS bloqueia acesso direto)
SELECT * FROM tarefas;
SELECT * FROM materias;
SELECT * FROM horarios;
```

---

## 🚨 Testes de Erro

### 20. Erros de Conexão

**Passos:**
1. Desative a internet do dispositivo/emulador
2. Tente criar uma tarefa ou matéria
3. Reative a internet
4. Tente novamente

**Resultado Esperado:**
- ✅ Mensagem de erro clara quando offline
- ✅ Funciona normalmente quando online

---

### 21. Campos Obrigatórios

**Passos:**
1. Tente criar matéria sem preencher o nome
2. Tente criar horário sem selecionar matéria
3. Tente criar tarefa sem título

**Resultado Esperado:**
- ✅ Alertas informativos sobre campos obrigatórios
- ✅ Salvamento bloqueado até preencher corretamente

---

## 📊 Checklist Completo

Use esta lista para validar todos os testes:

### Autenticação
- [ ] Cadastro de novo usuário
- [ ] Login com usuário existente
- [ ] Logout
- [ ] Persistência de sessão

### Matérias
- [ ] Criar matéria
- [ ] Listar matérias
- [ ] Excluir matéria
- [ ] Persistência após fechar app

### Horários
- [ ] Criar horário (requer matéria)
- [ ] Listar horários agrupados por dia
- [ ] Excluir horário
- [ ] Validação de formato de hora
- [ ] Persistência após fechar app

### Tarefas
- [ ] Criar tarefa
- [ ] Listar tarefas
- [ ] Marcar como concluída
- [ ] Editar tarefa
- [ ] Excluir tarefa
- [ ] Persistência após fechar app

### Perfil e Configurações
- [ ] Editar perfil
- [ ] Alterar configurações
- [ ] Persistência de alterações

### Segurança
- [ ] Isolamento de dados (RLS)
- [ ] Validação de campos obrigatórios
- [ ] Tratamento de erros de conexão

---

## 🐛 Reportando Problemas

Se encontrar algum problema:

1. **Anote o erro exato** que apareceu
2. **Liste os passos** para reproduzir
3. **Verifique o console** do Metro Bundler (terminal onde o app está rodando)
4. **Consulte o Supabase** usando as queries SQL fornecidas acima

---

## ✅ Status da Integração

**Última atualização:** 06/11/2025

### Concluído:
- ✅ Autenticação (signup, login, logout, sessão persistente)
- ✅ CRUD de Perfil
- ✅ CRUD de Matérias (com sincronização imediata)
- ✅ CRUD de Horários (novo!)
- ✅ CRUD de Tarefas (com tipos e dificuldades)
- ✅ CRUD de Configurações
- ✅ Row Level Security (RLS)
- ✅ Validações de formulário
- ✅ Feedback visual (alerts, loading states)

### Pendente:
- ⏳ Notificações push
- ⏳ Sincronização em tempo real (real-time updates)
- ⏳ Upload de avatar
- ⏳ Filtros avançados de tarefas
- ⏳ Estatísticas e gráficos

---

**Boa sorte nos testes! 🚀**


## ✅ Checklist de Implementação

### ✔️ Etapa 1: Configuração do Banco (CONCLUÍDA)
- [x] Script SQL criado (`SUPABASE/setup-database.sql`)
- [x] Tabelas: profiles, materias, tarefas, horarios, configuracoes
- [x] Row Level Security configurado
- [x] Triggers e funções criadas
- [x] Views otimizadas criadas

### ✔️ Etapa 2: Integração no App (CONCLUÍDA)
- [x] Dependências instaladas (`@supabase/supabase-js`, etc.)
- [x] Configuração do Supabase (`src/config/supabase.config.ts`)
- [x] Tipos TypeScript criados (`src/types/database.types.ts`)
- [x] Serviço de API criado (`src/services/supabase.service.ts`)
- [x] Contexto de autenticação (`src/contexts/AuthContext.tsx`)
- [x] Tela de login integrada
- [x] Tela de conta integrada
- [x] Funcionalidade de logout

---

## 🧪 Testes Manuais

### 1. Testar Cadastro de Usuário

```
1. Abra o app
2. Clique em "Crie Sua Conta"
3. Preencha:
   - Nome: Seu Nome
   - Email: teste@uniso.br
   - Senha: 123456
4. Clique em "CRIAR →"
5. ✅ Deve mostrar "Conta criada com sucesso"
6. ✅ Deve voltar para tela de login
```

**Verificar no Supabase:**
- Vá em Authentication > Users
- Deve ter o novo usuário cadastrado
- Vá em Table Editor > profiles
- Deve ter o perfil criado automaticamente

### 2. Testar Login

```
1. Na tela de login, digite:
   - Email: teste@uniso.br
   - Senha: 123456
2. Clique em "ENTRAR →"
3. ✅ Deve entrar no app (tela de Tarefas)
4. ✅ Navegação inferior deve aparecer
```

### 3. Testar Perfil

```
1. Vá para aba "Conta" (botão inferior)
2. ✅ Deve mostrar "Olá, Seu Nome"
3. Clique no card de perfil
4. ✅ Modal de edição deve abrir
5. Altere:
   - Instituição: UNISO
   - Curso: Ciência da Computação
6. Clique em "Salvar"
7. ✅ Deve mostrar "Perfil atualizado com sucesso!"
```

**Verificar no Supabase:**
- Vá em Table Editor > profiles
- Deve ter instituição e curso atualizados

### 4. Testar Matérias

```
1. Na aba "Conta", clique em "Matérias"
2. Clique em "+ Adicionar Matéria"
3. Preencha:
   - Nome: Programação Mobile
   - Professor: João Silva
   - Código: CC301
   - Cor: Azul
4. Clique em "Adicionar"
5. ✅ Matéria deve aparecer na lista
6. Clique em "Salvar Alterações"
```

**Verificar no Supabase:**
- Vá em Table Editor > materias
- Deve ter a nova matéria cadastrada

### 5. Testar Configurações

```
1. Na aba "Conta", clique em "Configurações"
2. Altere algumas opções:
   - Desative "Notificações"
   - Mude "Horas de antecedência" para 48
3. Clique em "Salvar"
4. ✅ Deve mostrar "Configurações atualizadas!"
5. Feche e abra o modal novamente
6. ✅ Deve manter as configurações salvas
```

**Verificar no Supabase:**
- Vá em Table Editor > configuracoes
- Deve ter as configurações atualizadas

### 6. Testar Logout

```
1. Na aba "Conta", role até o botão "Sair da Conta"
2. Clique no botão vermelho
3. ✅ Deve aparecer confirmação
4. Clique em "Sair"
5. ✅ Deve voltar para tela de login
6. ✅ Ao entrar novamente, deve manter os dados salvos
```

---

## 🔍 Verificações no Supabase Dashboard

### Authentication
```
1. Vá em Authentication > Users
2. Deve ter os usuários cadastrados
3. Clique em um usuário
4. Verificar:
   - ✅ Email confirmado (ou não, conforme configuração)
   - ✅ Metadata com nome e username
```

### Table Editor

**Tabela: profiles**
```sql
SELECT * FROM profiles;
```
- ✅ Deve ter um registro por usuário
- ✅ Campos preenchidos: nome, email, username

**Tabela: materias**
```sql
SELECT * FROM materias;
```
- ✅ Matérias criadas devem aparecer
- ✅ user_id deve corresponder ao usuário logado

**Tabela: configuracoes**
```sql
SELECT * FROM configuracoes;
```
- ✅ Uma linha por usuário
- ✅ Configurações padrão ou personalizadas

### SQL Editor - Queries de Teste

**Contar usuários:**
```sql
SELECT COUNT(*) as total FROM profiles;
```

**Ver matérias com usuário:**
```sql
SELECT 
  p.nome as usuario,
  m.nome as materia,
  m.professor,
  m.codigo
FROM materias m
JOIN profiles p ON m.user_id = p.id
ORDER BY p.nome, m.nome;
```

**Ver tarefas (quando implementado):**
```sql
SELECT 
  p.nome as usuario,
  t.titulo,
  t.tipo,
  t.data_entrega,
  m.nome as materia
FROM tarefas t
JOIN profiles p ON t.user_id = p.id
LEFT JOIN materias m ON t.materia_id = m.id
ORDER BY t.data_entrega;
```

---

## 🐛 Testes de Erro

### 1. Teste de Email Duplicado
```
1. Tente criar conta com email já cadastrado
2. ✅ Deve mostrar erro apropriado
```

### 2. Teste de Senha Fraca
```
1. Tente criar conta com senha < 6 caracteres
2. ✅ Deve mostrar "A senha deve ter pelo menos 6 caracteres"
```

### 3. Teste de Login Inválido
```
1. Tente fazer login com senha errada
2. ✅ Deve mostrar erro de autenticação
```

### 4. Teste de Campos Vazios
```
1. Tente fazer login sem preencher campos
2. ✅ Deve mostrar "Preencha todos os campos"
```

---

## 📊 Queries Úteis para Debug

### Ver todos os dados de um usuário:

```sql
-- Substitua 'email@exemplo.com' pelo email do usuário de teste
WITH user_info AS (
  SELECT id FROM auth.users WHERE email = 'teste@uniso.br'
)
SELECT 'Profile' as tipo, row_to_json(p.*) as dados
FROM profiles p, user_info
WHERE p.id = user_info.id
UNION ALL
SELECT 'Materias' as tipo, row_to_json(m.*) as dados
FROM materias m, user_info
WHERE m.user_id = user_info.id
UNION ALL
SELECT 'Configuracoes' as tipo, row_to_json(c.*) as dados
FROM configuracoes c, user_info
WHERE c.user_id = user_info.id;
```

### Limpar dados de teste:

```sql
-- CUIDADO: Isso deleta TODOS os dados do usuário!
-- Substitua o email antes de executar
DELETE FROM profiles WHERE email = 'teste@uniso.br';
```

---

## ✅ Checklist Final

Antes de considerar a implementação completa, verifique:

- [ ] ✅ Usuário consegue criar conta
- [ ] ✅ Usuário consegue fazer login
- [ ] ✅ Usuário consegue editar perfil
- [ ] ✅ Usuário consegue criar matérias
- [ ] ✅ Usuário consegue visualizar matérias criadas
- [ ] ✅ Usuário consegue editar configurações
- [ ] ✅ Usuário consegue fazer logout
- [ ] ✅ Dados persistem após logout/login
- [ ] ✅ Dados são isolados por usuário (RLS)
- [ ] ⏳ Tarefas sincronizadas (próximo passo)
- [ ] ⏳ Horários sincronizados (próximo passo)

---

## 📱 Comandos Úteis

### Limpar cache do Expo:
```bash
npm start -- --clear
```

### Reinstalar dependências:
```bash
rm -rf node_modules
npm install
```

### Ver logs do app:
```bash
# Após npm start
# Pressione 'j' para abrir o React DevTools
```

### Ver erros do Supabase:
```javascript
// No código, adicione logs
const result = await supabaseService.login(email, password);
console.log('Login result:', result);
if (!result.success) {
  console.error('Login error:', result.error);
}
```

---

## 🎉 Próximos Passos

Após completar todos os testes acima:

1. **Integrar Tarefas com Supabase**
   - Atualizar `TasksContext` para usar o banco
   - Implementar sincronização de tarefas
   - Adicionar filtros por matéria

2. **Integrar Agenda/Horários**
   - Carregar horários do banco
   - Permitir criação/edição de horários
   - Mostrar horários do dia

3. **Melhorias de UX**
   - Loading states em todas as operações
   - Mensagens de erro mais descritivas
   - Feedback visual em todas as ações

4. **Features Avançadas**
   - Upload de avatar
   - Recuperação de senha
   - Real-time updates
   - Notificações push

---

**Dúvidas? Consulte:**
- `INTEGRACAO_SUPABASE.md` - Guia de integração
- `SUPABASE/INSTRUCOES.md` - Documentação completa do banco
- `SUPABASE/README.md` - Visão geral da estrutura

**EstudAI - UNISO 2025** 🎓
