# 🚀 Integração Supabase - EstudAI

## ✅ Alterações Realizadas

### 📦 Dependências Instaladas
```bash
npm install @supabase/supabase-js react-native-url-polyfill @react-native-async-storage/async-storage
```

### 📁 Arquivos Criados

1. **src/config/supabase.config.ts** - Configuração do cliente Supabase
2. **src/types/database.types.ts** - Tipos TypeScript do banco de dados
3. **src/services/supabase.service.ts** - Funções de serviço para operações no banco
4. **src/contexts/AuthContext.tsx** - Contexto de autenticação global

### 📝 Arquivos Modificados

1. **App.tsx** - Adicionado AuthProvider e lógica de autenticação
2. **src/pages/login/index.tsx** - Integrado com Supabase Auth (login e cadastro)
3. **src/pages/conta/index.tsx** - Integrado com perfil, matérias e configurações do Supabase

---

## 🎯 Como Usar

### 1. Execute o Script SQL no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Selecione seu projeto (ou crie um novo)
3. Vá em **SQL Editor**
4. Copie todo o conteúdo de `SUPABASE/setup-database.sql`
5. Cole no editor e clique em **Run**

### 2. Configuração já está pronta!

O arquivo `.env` já está configurado com suas credenciais:
```
SUPABASE_URL=https://igtkumuwkmoijhlfvnne.supabase.co
SUPABASE_ANON_KEY=sua-chave-aqui
```

### 3. Execute o App

```bash
npm start
```

---

## 🔐 Funcionalidades Implementadas

### Autenticação
- ✅ **Login** - Usuários podem fazer login com email e senha
- ✅ **Cadastro** - Novos usuários podem criar conta
- ✅ **Logout** - Botão de sair na tela de Conta
- ✅ **Sessão Persistente** - Login mantém o usuário conectado
- ✅ **Proteção de Rotas** - Apenas usuários autenticados acessam o app

### Perfil
- ✅ **Visualizar Perfil** - Dados do usuário exibidos na tela de Conta
- ✅ **Editar Perfil** - Atualizar nome, instituição, curso
- ✅ **Sincronização Automática** - Perfil é criado automaticamente no cadastro

### Matérias
- ✅ **Listar Matérias** - Carregadas do Supabase
- ✅ **Adicionar Matéria** - Salva no banco de dados
- ✅ **Editar Matéria** - Atualiza informações
- ✅ **Remover Matéria** - Deleta do banco

### Configurações
- ✅ **Carregar Configurações** - Busca preferências do usuário
- ✅ **Salvar Configurações** - Persiste alterações no banco

### Tarefas (Próximo Passo)
- 🔄 **Integrar TasksContext com Supabase** - Substituir estado local

---

## 📋 Próximos Passos

### 1. Integrar Tarefas com Supabase

Atualizar `src/hooks/TasksContext.tsx` para usar o Supabase:

```typescript
import { useAuth } from '../contexts/AuthContext';
import * as supabaseService from '../services/supabase.service';

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Carregar tarefas do Supabase
  useEffect(() => {
    if (user) {
      carregarTarefas();
    }
  }, [user]);

  const carregarTarefas = async () => {
    if (!user) return;
    const result = await supabaseService.listarTarefas(user.id);
    if (result.success) {
      // Converter para formato local
      setTasks(result.data.map(t => ({
        id: t.id,
        title: t.titulo,
        description: t.descricao,
        type: t.tipo,
        difficulty: t.dificuldade,
        dueDate: t.data_entrega,
        completed: t.completed,
        // ... outros campos
      })));
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!user) return;
    const result = await supabaseService.criarTarefa(user.id, {
      titulo: task.title,
      descricao: task.description,
      tipo: task.type,
      dificuldade: task.difficulty,
      data_entrega: task.dueDate,
      completed: false,
      prioridade: 0,
      materia_id: null,
      hora_entrega: null,
    });
    
    if (result.success) {
      await carregarTarefas();
    }
  };

  // ... outros métodos
};
```

### 2. Integrar Horários/Agenda

Similar às tarefas, atualizar a tela de Agenda para usar:
- `supabaseService.listarHorarios(userId)`
- `supabaseService.criarHorario(userId, horario)`
- `supabaseService.obterHorariosDia(userId, diaSemana)`

### 3. Implementar Real-time (Opcional)

Para atualizações em tempo real:

```typescript
useEffect(() => {
  if (!user) return;

  const channel = supabase
    .channel('tarefas_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tarefas',
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        console.log('Mudança detectada:', payload);
        carregarTarefas(); // Recarregar tarefas
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}, [user]);
```

---

## 🐛 Solução de Problemas

### Erro: "Invalid JWT"
- Token expirado, faça logout e login novamente
- Verifique se as credenciais do `.env` estão corretas

### Erro: "Row Level Security"
- Execute o script SQL completo no Supabase
- Verifique se está logado antes de acessar dados

### Erro ao criar conta
- Verifique se o email já está cadastrado
- Senha deve ter pelo menos 6 caracteres

### App não compila
```bash
# Limpar cache
npm start -- --clear

# Reinstalar dependências
rm -rf node_modules
npm install
```

---

## 📚 Documentação Útil

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [React Native + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/react-native)

---

## ✨ Funcionalidades do Sistema

### Já Funcionando
- ✅ Login e Cadastro
- ✅ Logout
- ✅ Perfil de usuário
- ✅ Gerenciamento de matérias
- ✅ Configurações do usuário

### Próximas Implementações
- 🔄 Tarefas sincronizadas
- 🔄 Agenda/Horários sincronizados
- 🔄 Real-time updates
- 🔄 Recuperação de senha
- 🔄 Upload de avatar

---

**Desenvolvido para EstudAI - UNISO 2025** 🎓
