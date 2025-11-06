# 📚 Instruções de Configuração do Banco de Dados - EstudAI

## 🚀 Como Executar o Script no Supabase

### Passo 1: Acessar o Supabase Dashboard
1. Faça login em [supabase.com](https://supabase.com)
2. Selecione seu projeto EstudAI
3. No menu lateral, clique em **SQL Editor**

### Passo 2: Executar o Script
1. Clique em **New Query**
2. Abra o arquivo `setup-database.sql`
3. Copie **todo** o conteúdo do arquivo
4. Cole no editor SQL do Supabase
5. Clique em **Run** (ou pressione `Ctrl + Enter`)
6. Aguarde a execução (deve aparecer "Script executado com sucesso!")

### Passo 3: Configurar Autenticação
1. No menu lateral, clique em **Authentication** > **Settings**
2. Em **Email Auth**, certifique-se que está habilitado
3. Configure as opções:
   - ✅ Enable email confirmations (se quiser confirmar emails)
   - ✅ Enable email signup
   - ⚙️ Minimum password length: 6

### Passo 4: Obter Credenciais
1. Vá em **Settings** > **API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon/public key** (chave pública)
3. Cole essas informações no arquivo `.env` do projeto

---

## 📊 Estrutura do Banco de Dados

### Tabelas Criadas

#### 1. **profiles** - Perfis dos Usuários
Armazena informações complementares do usuário (estende `auth.users`):
```sql
- id (UUID) - Referência ao auth.users
- username (VARCHAR) - Nome de usuário único
- nome (VARCHAR) - Nome completo
- email (VARCHAR) - Email (único)
- instituicao (VARCHAR) - Nome da instituição
- curso (VARCHAR) - Curso que está fazendo
- avatar_url (TEXT) - URL da foto de perfil
- bio (TEXT) - Biografia/descrição
- created_at, updated_at (TIMESTAMP)
```

#### 2. **materias** - Disciplinas/Matérias
Armazena as matérias do usuário:
```sql
- id (BIGSERIAL) - ID único
- user_id (UUID) - ID do usuário
- nome (VARCHAR) - Nome da matéria
- professor (VARCHAR) - Nome do professor
- codigo (VARCHAR) - Código da disciplina (ex: CC301)
- cor (VARCHAR) - Cor em hexadecimal (ex: #2563EB)
- created_at, updated_at (TIMESTAMP)
```

#### 3. **tarefas** - Tarefas/Atividades
Armazena as tarefas dos usuários:
```sql
- id (BIGSERIAL) - ID único
- user_id (UUID) - ID do usuário
- materia_id (BIGINT) - ID da matéria relacionada
- titulo (VARCHAR) - Título da tarefa
- descricao (TEXT) - Descrição detalhada
- tipo (VARCHAR) - 'Atividade', 'Trabalho', 'Prova', 'Outro'
- dificuldade (VARCHAR) - 'Fácil', 'Médio', 'Difícil'
- data_entrega (DATE) - Data de entrega
- hora_entrega (TIME) - Hora de entrega
- completed (BOOLEAN) - Se está concluída
- prioridade (INTEGER) - Nível de prioridade
- created_at, updated_at (TIMESTAMP)
```

#### 4. **horarios** - Agenda/Horários
Armazena os horários das aulas:
```sql
- id (BIGSERIAL) - ID único
- user_id (UUID) - ID do usuário
- materia_id (BIGINT) - ID da matéria
- dia_semana (INTEGER) - 0=Domingo, 1=Segunda, ..., 6=Sábado
- hora_inicio (TIME) - Hora de início
- hora_fim (TIME) - Hora de término
- local (VARCHAR) - Sala/Local
- observacoes (TEXT) - Observações adicionais
- created_at, updated_at (TIMESTAMP)
```

#### 5. **configuracoes** - Configurações do Usuário
Armazena preferências do usuário:
```sql
- user_id (UUID) - ID do usuário
- notificacoes_ativas (BOOLEAN)
- lembrete_tarefas (BOOLEAN)
- alerta_vencimento (BOOLEAN)
- horas_antecedencia (INTEGER)
- tema_escuro (BOOLEAN)
- mostrar_concluidas (BOOLEAN)
- sincronizacao_auto (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

---

## 🔐 Segurança (RLS - Row Level Security)

Todas as tabelas possuem **Row Level Security** habilitado, garantindo que:
- ✅ Usuários só veem seus próprios dados
- ✅ Usuários só podem modificar seus próprios dados
- ✅ Dados são isolados por usuário automaticamente

---

## 📝 Exemplos de Uso no Código

### 1. Registro de Novo Usuário
```typescript
import { supabase } from './config/supabase.config';

async function registrarUsuario(email: string, senha: string, nome: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: senha,
    options: {
      data: {
        nome: nome,
        username: email.split('@')[0]
      }
    }
  });
  
  if (error) {
    console.error('Erro ao registrar:', error.message);
    return null;
  }
  
  return data.user;
}
```

### 2. Login de Usuário
```typescript
async function login(email: string, senha: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: senha,
  });
  
  if (error) {
    console.error('Erro ao fazer login:', error.message);
    return null;
  }
  
  return data.user;
}
```

### 3. Obter Perfil do Usuário
```typescript
async function obterPerfil(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Erro ao buscar perfil:', error.message);
    return null;
  }
  
  return data;
}
```

### 4. Atualizar Perfil
```typescript
async function atualizarPerfil(userId: string, perfil: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      nome: perfil.nome,
      instituicao: perfil.instituicao,
      curso: perfil.curso,
    })
    .eq('id', userId);
  
  if (error) {
    console.error('Erro ao atualizar perfil:', error.message);
    return false;
  }
  
  return true;
}
```

### 5. Criar Matéria
```typescript
async function criarMateria(userId: string, materia: any) {
  const { data, error } = await supabase
    .from('materias')
    .insert({
      user_id: userId,
      nome: materia.nome,
      professor: materia.professor,
      codigo: materia.codigo,
      cor: materia.cor,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao criar matéria:', error.message);
    return null;
  }
  
  return data;
}
```

### 6. Listar Matérias do Usuário
```typescript
async function listarMaterias(userId: string) {
  const { data, error } = await supabase
    .from('materias')
    .select('*')
    .eq('user_id', userId)
    .order('nome', { ascending: true });
  
  if (error) {
    console.error('Erro ao listar matérias:', error.message);
    return [];
  }
  
  return data;
}
```

### 7. Criar Tarefa
```typescript
async function criarTarefa(userId: string, tarefa: any) {
  const { data, error } = await supabase
    .from('tarefas')
    .insert({
      user_id: userId,
      materia_id: tarefa.materiaId,
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      tipo: tarefa.tipo,
      dificuldade: tarefa.dificuldade,
      data_entrega: tarefa.dataEntrega,
      hora_entrega: tarefa.horaEntrega,
      completed: false,
      prioridade: tarefa.prioridade || 0,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao criar tarefa:', error.message);
    return null;
  }
  
  return data;
}
```

### 8. Listar Tarefas com Informações da Matéria
```typescript
async function listarTarefas(userId: string) {
  const { data, error } = await supabase
    .from('tarefas_completas') // View criada no script
    .select('*')
    .eq('user_id', userId)
    .order('data_entrega', { ascending: true });
  
  if (error) {
    console.error('Erro ao listar tarefas:', error.message);
    return [];
  }
  
  return data;
}
```

### 9. Marcar Tarefa como Concluída
```typescript
async function marcarTarefaConcluida(tarefaId: number, concluida: boolean) {
  const { error } = await supabase
    .from('tarefas')
    .update({ completed: concluida })
    .eq('id', tarefaId);
  
  if (error) {
    console.error('Erro ao atualizar tarefa:', error.message);
    return false;
  }
  
  return true;
}
```

### 10. Criar Horário
```typescript
async function criarHorario(userId: string, horario: any) {
  const { data, error } = await supabase
    .from('horarios')
    .insert({
      user_id: userId,
      materia_id: horario.materiaId,
      dia_semana: horario.diaSemana, // 0-6 (Domingo-Sábado)
      hora_inicio: horario.horaInicio,
      hora_fim: horario.horaFim,
      local: horario.local,
      observacoes: horario.observacoes,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao criar horário:', error.message);
    return null;
  }
  
  return data;
}
```

### 11. Buscar Horários de um Dia Específico
```typescript
async function buscarHorariosDia(userId: string, diaSemana: number) {
  const { data, error } = await supabase
    .rpc('get_horarios_dia', {
      usuario_id: userId,
      dia: diaSemana
    });
  
  if (error) {
    console.error('Erro ao buscar horários:', error.message);
    return [];
  }
  
  return data;
}
```

### 12. Obter Tarefas Pendentes
```typescript
async function obterTarefasPendentes(userId: string) {
  const { data, error } = await supabase
    .rpc('get_tarefas_pendentes', {
      usuario_id: userId
    });
  
  if (error) {
    console.error('Erro ao buscar tarefas pendentes:', error.message);
    return [];
  }
  
  return data;
}
```

### 13. Atualizar Configurações
```typescript
async function atualizarConfiguracoes(userId: string, config: any) {
  const { error } = await supabase
    .from('configuracoes')
    .update({
      notificacoes_ativas: config.notificacoesAtivas,
      lembrete_tarefas: config.lembreteTarefas,
      alerta_vencimento: config.alertaVencimento,
      horas_antecedencia: config.horasAntecedencia,
      tema_escuro: config.temaEscuro,
      mostrar_concluidas: config.mostrarConcluidas,
      sincronizacao_auto: config.sincronizacaoAuto,
    })
    .eq('user_id', userId);
  
  if (error) {
    console.error('Erro ao atualizar configurações:', error.message);
    return false;
  }
  
  return true;
}
```

### 14. Logout
```typescript
async function logout() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Erro ao fazer logout:', error.message);
    return false;
  }
  
  return true;
}
```

### 15. Resetar Senha
```typescript
async function resetarSenha(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://seuapp.com/reset-password',
  });
  
  if (error) {
    console.error('Erro ao resetar senha:', error.message);
    return false;
  }
  
  return true;
}
```

---

## 🎯 Próximos Passos

1. ✅ Execute o script SQL no Supabase
2. ✅ Configure as credenciais no `.env`
3. ✅ Teste o registro e login de usuários
4. ✅ Implemente as funções de CRUD nas telas do app
5. ✅ Configure notificações (opcional)

---

## 📞 Suporte

Em caso de dúvidas ou problemas:
- Consulte a [documentação do Supabase](https://supabase.com/docs)
- Verifique se todas as políticas RLS estão ativas
- Certifique-se de que o usuário está autenticado antes de fazer operações

---

**Desenvolvido para EstudAI - UNISO 2025** 🎓
