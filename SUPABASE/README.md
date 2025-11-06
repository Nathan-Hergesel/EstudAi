# 🗄️ Configuração do Banco de Dados Supabase - EstudAI

Este diretório contém todos os arquivos necessários para configurar e gerenciar o banco de dados do EstudAI no Supabase.

## 📁 Estrutura de Arquivos

```
SUPABASE/
├── setup-database.sql          # Script principal de setup do banco
├── queries-uteis.sql           # Queries SQL úteis para consultas
├── INSTRUCOES.md              # Guia detalhado de setup e uso
├── my-supabase-project/
│   └── src/
│       ├── config/
│       │   └── supabase.config.ts    # Configuração do cliente Supabase
│       ├── types/
│       │   └── database.types.ts     # Tipos TypeScript do banco
│       └── services/
│           └── supabase.service.ts   # Funções prontas para usar
```

## 🚀 Início Rápido

### 1. Configure o Supabase

```bash
# 1. Crie um projeto em supabase.com
# 2. Execute o script setup-database.sql no SQL Editor
# 3. Copie as credenciais (URL e anon key)
```

### 2. Configure o Projeto

```bash
# Copie o arquivo .env.example
cp ../.env.example ../.env

# Edite o .env com suas credenciais do Supabase
# SUPABASE_URL=https://seu-projeto.supabase.co
# SUPABASE_ANON_KEY=sua-chave-aqui
```

### 3. Use no Código

```typescript
import supabaseService from './SUPABASE/my-supabase-project/src/services/supabase.service';

// Login
const result = await supabaseService.login('email@exemplo.com', 'senha123');
if (result.success) {
  console.log('Usuário logado:', result.user);
}

// Criar tarefa
const novaTarefa = await supabaseService.criarTarefa(userId, {
  titulo: 'Estudar React Native',
  tipo: 'Atividade',
  dificuldade: 'Médio',
  data_entrega: '2025-11-15',
  completed: false,
  prioridade: 1,
  materia_id: 1,
  descricao: 'Revisar hooks e navigation',
  hora_entrega: '14:00',
});
```

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

| Tabela | Descrição | Colunas Principais |
|--------|-----------|-------------------|
| **profiles** | Perfis dos usuários | id, nome, email, instituicao, curso |
| **materias** | Disciplinas/matérias | id, user_id, nome, professor, cor |
| **tarefas** | Tarefas e atividades | id, user_id, titulo, tipo, data_entrega, completed |
| **horarios** | Grade de horários | id, user_id, materia_id, dia_semana, hora_inicio |
| **configuracoes** | Preferências do usuário | user_id, notificacoes_ativas, tema_escuro |

### Views (Consultas Otimizadas)

- **tarefas_completas**: Tarefas com informações da matéria relacionada
- **horarios_completos**: Horários com informações da matéria relacionada

### Funções RPC

- **get_tarefas_pendentes(user_id)**: Retorna tarefas pendentes ordenadas
- **get_horarios_dia(user_id, dia)**: Retorna horários de um dia específico

## 🔐 Segurança

Todas as tabelas possuem **Row Level Security (RLS)** habilitado:

- ✅ Usuários só podem acessar seus próprios dados
- ✅ Todas as operações são validadas pelo Supabase
- ✅ Políticas automáticas de INSERT, SELECT, UPDATE e DELETE

## 📝 Exemplos de Uso

### Autenticação

```typescript
// Registrar
const { success, user } = await supabaseService.registrarUsuario(
  'aluno@uniso.br',
  'senha123',
  'João Silva'
);

// Login
const { success, user, session } = await supabaseService.login(
  'aluno@uniso.br',
  'senha123'
);

// Logout
await supabaseService.logout();
```

### Matérias

```typescript
// Listar matérias
const { data: materias } = await supabaseService.listarMaterias(userId);

// Criar matéria
const { data: novaMateria } = await supabaseService.criarMateria(userId, {
  nome: 'Programação Mobile',
  professor: 'Prof. João',
  codigo: 'CC301',
  cor: '#2563EB'
});

// Atualizar matéria
await supabaseService.atualizarMateria(materiaId, {
  professor: 'Prof. Maria'
});

// Remover matéria
await supabaseService.removerMateria(materiaId);
```

### Tarefas

```typescript
// Listar tarefas
const { data: tarefas } = await supabaseService.listarTarefas(userId);

// Criar tarefa
const { data: novaTarefa } = await supabaseService.criarTarefa(userId, {
  titulo: 'Trabalho Final',
  descricao: 'Desenvolver app mobile',
  tipo: 'Trabalho',
  dificuldade: 'Difícil',
  data_entrega: '2025-12-15',
  hora_entrega: '23:59',
  completed: false,
  prioridade: 3,
  materia_id: 1
});

// Marcar como concluída
await supabaseService.toggleTarefaConcluida(tarefaId, true);

// Obter tarefas pendentes
const { data: pendentes } = await supabaseService.obterTarefasPendentes(userId);
```

### Horários

```typescript
// Listar todos os horários
const { data: horarios } = await supabaseService.listarHorarios(userId);

// Horários de segunda-feira (dia 1)
const { data: horarios } = await supabaseService.obterHorariosDia(userId, 1);

// Criar horário
const { data: novoHorario } = await supabaseService.criarHorario(userId, {
  materia_id: 1,
  dia_semana: 1, // Segunda-feira
  hora_inicio: '08:00',
  hora_fim: '10:00',
  local: 'Sala 101',
  observacoes: null
});
```

### Real-time (Atualizações em Tempo Real)

```typescript
// Escutar mudanças nas tarefas
const channel = supabaseService.escutarTarefas(userId, (payload) => {
  console.log('Mudança detectada:', payload);
  // Atualizar UI
});

// Cancelar escuta
channel.unsubscribe();
```

## 🛠️ Manutenção

### Queries Úteis

Veja o arquivo `queries-uteis.sql` para:
- Estatísticas de produtividade
- Relatórios mensais
- Limpeza de dados antigos
- Verificações de integridade

### Backup

```sql
-- Execute no SQL Editor para exportar dados
SELECT * FROM public.profiles WHERE id = 'seu-uuid';
SELECT * FROM public.materias WHERE user_id = 'seu-uuid';
SELECT * FROM public.tarefas WHERE user_id = 'seu-uuid';
SELECT * FROM public.horarios WHERE user_id = 'seu-uuid';
```

## 📚 Documentação Adicional

- **INSTRUCOES.md**: Guia completo de configuração e uso
- **setup-database.sql**: Comentários detalhados no próprio script
- **queries-uteis.sql**: Exemplos de queries complexas

## 🆘 Solução de Problemas

### Erro: "Row Level Security"
- Verifique se o usuário está autenticado
- Confirme que o RLS está habilitado nas tabelas

### Erro: "Invalid JWT"
- Token expirado, faça login novamente
- Verifique se as credenciais do .env estão corretas

### Erro: "Constraint Violation"
- Verifique se a matéria_id existe antes de criar tarefa
- Confirme que os valores enum estão corretos (tipo, dificuldade)

## 🔄 Atualizações Futuras

Para adicionar novas features ao banco:

1. Crie uma migration SQL
2. Execute no SQL Editor
3. Atualize os tipos em `database.types.ts`
4. Adicione funções em `supabase.service.ts`

## 📞 Suporte

- [Documentação Supabase](https://supabase.com/docs)
- [React Native + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/react-native)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

---

**EstudAI - Desenvolvido na UNISO** 🎓
