-- ====================================
-- SCRIPT SQL PARA SUPABASE - EstudAI
-- ====================================
-- Este script cria toda a estrutura de banco de dados necessária
-- para o aplicativo EstudAI, incluindo autenticação, perfis,
-- matérias, tarefas e agenda.
--
-- INSTRUÇÕES DE USO:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em "SQL Editor"
-- 3. Crie uma nova query
-- 4. Cole todo este conteúdo
-- 5. Execute o script
-- ====================================

-- ====================================
-- 1. CRIAÇÃO DAS TABELAS
-- ====================================

-- Tabela de perfis de usuário (estende auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    instituicao VARCHAR(150),
    curso VARCHAR(150),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de matérias/disciplinas
CREATE TABLE IF NOT EXISTS public.materias (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    professor VARCHAR(100),
    codigo VARCHAR(20),
    cor VARCHAR(7) DEFAULT '#2563EB',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS public.tarefas (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    materia_id BIGINT REFERENCES public.materias(id) ON DELETE SET NULL,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Atividade', 'Trabalho', 'Prova', 'Outro')),
    dificuldade VARCHAR(20) CHECK (dificuldade IN ('Fácil', 'Médio', 'Difícil')),
    data_entrega DATE,
    hora_entrega TIME,
    completed BOOLEAN DEFAULT FALSE,
    prioridade INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de horários/agenda
CREATE TABLE IF NOT EXISTS public.horarios (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    materia_id BIGINT REFERENCES public.materias(id) ON DELETE CASCADE,
    dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    local VARCHAR(100),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações do usuário
CREATE TABLE IF NOT EXISTS public.configuracoes (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    notificacoes_ativas BOOLEAN DEFAULT TRUE,
    lembrete_tarefas BOOLEAN DEFAULT TRUE,
    alerta_vencimento BOOLEAN DEFAULT TRUE,
    horas_antecedencia INTEGER DEFAULT 24,
    tema_escuro BOOLEAN DEFAULT FALSE,
    mostrar_concluidas BOOLEAN DEFAULT TRUE,
    sincronizacao_auto BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 2. ÍNDICES PARA MELHOR PERFORMANCE
-- ====================================

CREATE INDEX IF NOT EXISTS idx_materias_user_id ON public.materias(user_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_user_id ON public.tarefas(user_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_materia_id ON public.tarefas(materia_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_data_entrega ON public.tarefas(data_entrega);
CREATE INDEX IF NOT EXISTS idx_tarefas_completed ON public.tarefas(completed);
CREATE INDEX IF NOT EXISTS idx_horarios_user_id ON public.horarios(user_id);
CREATE INDEX IF NOT EXISTS idx_horarios_dia_semana ON public.horarios(dia_semana);

-- ====================================
-- 3. FUNÇÕES AUXILIARES
-- ====================================

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- 4. TRIGGERS
-- ====================================

-- Trigger para atualizar updated_at em profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar updated_at em materias
DROP TRIGGER IF EXISTS update_materias_updated_at ON public.materias;
CREATE TRIGGER update_materias_updated_at
    BEFORE UPDATE ON public.materias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar updated_at em tarefas
DROP TRIGGER IF EXISTS update_tarefas_updated_at ON public.tarefas;
CREATE TRIGGER update_tarefas_updated_at
    BEFORE UPDATE ON public.tarefas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar updated_at em horarios
DROP TRIGGER IF EXISTS update_horarios_updated_at ON public.horarios;
CREATE TRIGGER update_horarios_updated_at
    BEFORE UPDATE ON public.horarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar updated_at em configuracoes
DROP TRIGGER IF EXISTS update_configuracoes_updated_at ON public.configuracoes;
CREATE TRIGGER update_configuracoes_updated_at
    BEFORE UPDATE ON public.configuracoes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente quando um usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, nome, email, username)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'full_name', 'Usuário'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1))
    );
    
    INSERT INTO public.configuracoes (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ====================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ====================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- Políticas para PROFILES
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem ver seu próprio perfil"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem inserir seu próprio perfil"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Políticas para MATERIAS
DROP POLICY IF EXISTS "Usuários podem ver suas próprias matérias" ON public.materias;
CREATE POLICY "Usuários podem ver suas próprias matérias"
    ON public.materias FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem criar suas próprias matérias" ON public.materias;
CREATE POLICY "Usuários podem criar suas próprias matérias"
    ON public.materias FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias matérias" ON public.materias;
CREATE POLICY "Usuários podem atualizar suas próprias matérias"
    ON public.materias FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar suas próprias matérias" ON public.materias;
CREATE POLICY "Usuários podem deletar suas próprias matérias"
    ON public.materias FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para TAREFAS
DROP POLICY IF EXISTS "Usuários podem ver suas próprias tarefas" ON public.tarefas;
CREATE POLICY "Usuários podem ver suas próprias tarefas"
    ON public.tarefas FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem criar suas próprias tarefas" ON public.tarefas;
CREATE POLICY "Usuários podem criar suas próprias tarefas"
    ON public.tarefas FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias tarefas" ON public.tarefas;
CREATE POLICY "Usuários podem atualizar suas próprias tarefas"
    ON public.tarefas FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar suas próprias tarefas" ON public.tarefas;
CREATE POLICY "Usuários podem deletar suas próprias tarefas"
    ON public.tarefas FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para HORARIOS
DROP POLICY IF EXISTS "Usuários podem ver seus próprios horários" ON public.horarios;
CREATE POLICY "Usuários podem ver seus próprios horários"
    ON public.horarios FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem criar seus próprios horários" ON public.horarios;
CREATE POLICY "Usuários podem criar seus próprios horários"
    ON public.horarios FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios horários" ON public.horarios;
CREATE POLICY "Usuários podem atualizar seus próprios horários"
    ON public.horarios FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar seus próprios horários" ON public.horarios;
CREATE POLICY "Usuários podem deletar seus próprios horários"
    ON public.horarios FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para CONFIGURACOES
DROP POLICY IF EXISTS "Usuários podem ver suas próprias configurações" ON public.configuracoes;
CREATE POLICY "Usuários podem ver suas próprias configurações"
    ON public.configuracoes FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias configurações" ON public.configuracoes;
CREATE POLICY "Usuários podem atualizar suas próprias configurações"
    ON public.configuracoes FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem inserir suas próprias configurações" ON public.configuracoes;
CREATE POLICY "Usuários podem inserir suas próprias configurações"
    ON public.configuracoes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ====================================
-- 6. VIEWS ÚTEIS
-- ====================================

-- View para tarefas com informações da matéria
CREATE OR REPLACE VIEW public.tarefas_completas AS
SELECT 
    t.id,
    t.user_id,
    t.titulo,
    t.descricao,
    t.tipo,
    t.dificuldade,
    t.data_entrega,
    t.hora_entrega,
    t.completed,
    t.prioridade,
    t.created_at,
    t.updated_at,
    m.id as materia_id,
    m.nome as materia_nome,
    m.professor as materia_professor,
    m.codigo as materia_codigo,
    m.cor as materia_cor
FROM public.tarefas t
LEFT JOIN public.materias m ON t.materia_id = m.id;

-- View para horários com informações da matéria
CREATE OR REPLACE VIEW public.horarios_completos AS
SELECT 
    h.id,
    h.user_id,
    h.dia_semana,
    h.hora_inicio,
    h.hora_fim,
    h.local,
    h.observacoes,
    h.created_at,
    h.updated_at,
    m.id as materia_id,
    m.nome as materia_nome,
    m.professor as materia_professor,
    m.codigo as materia_codigo,
    m.cor as materia_cor
FROM public.horarios h
LEFT JOIN public.materias m ON h.materia_id = m.id;

-- ====================================
-- 7. DADOS DE EXEMPLO (OPCIONAL)
-- ====================================

-- ATENÇÃO: Descomente as linhas abaixo apenas para testes
-- Em produção, os dados serão criados pelos usuários

/*
-- Inserir perfil de exemplo (substitua o UUID pelo ID do seu usuário de teste)
INSERT INTO public.profiles (id, nome, email, username, instituicao, curso)
VALUES (
    'seu-uuid-aqui'::UUID,
    'Usuário Teste',
    'teste@uniso.br',
    'usuario_teste',
    'UNISO',
    'Ciência da Computação'
);

-- Inserir matérias de exemplo
INSERT INTO public.materias (user_id, nome, professor, codigo, cor)
VALUES 
    ('seu-uuid-aqui'::UUID, 'Programação Mobile', 'João Silva', 'CC301', '#2563EB'),
    ('seu-uuid-aqui'::UUID, 'Banco de Dados', 'Maria Santos', 'CC302', '#16A34A');

-- Inserir tarefas de exemplo
INSERT INTO public.tarefas (user_id, materia_id, titulo, descricao, tipo, dificuldade, data_entrega, completed)
VALUES 
    ('seu-uuid-aqui'::UUID, 1, 'Projeto Final', 'Desenvolver app mobile', 'Trabalho', 'Difícil', '2025-12-15', false),
    ('seu-uuid-aqui'::UUID, 2, 'Lista de Exercícios', 'Resolver exercícios SQL', 'Atividade', 'Médio', '2025-11-20', false);
*/

-- ====================================
-- 8. FUNÇÕES DE CONSULTA ÚTEIS
-- ====================================

-- Função para buscar tarefas pendentes do usuário
CREATE OR REPLACE FUNCTION get_tarefas_pendentes(usuario_id UUID)
RETURNS TABLE (
    id BIGINT,
    titulo VARCHAR,
    tipo VARCHAR,
    data_entrega DATE,
    materia_nome VARCHAR,
    materia_cor VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.titulo,
        t.tipo,
        t.data_entrega,
        m.nome as materia_nome,
        m.cor as materia_cor
    FROM public.tarefas t
    LEFT JOIN public.materias m ON t.materia_id = m.id
    WHERE t.user_id = usuario_id 
        AND t.completed = false
        AND t.data_entrega >= CURRENT_DATE
    ORDER BY t.data_entrega ASC, t.prioridade DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para buscar horários do dia
CREATE OR REPLACE FUNCTION get_horarios_dia(usuario_id UUID, dia INTEGER)
RETURNS TABLE (
    id BIGINT,
    materia_nome VARCHAR,
    materia_cor VARCHAR,
    hora_inicio TIME,
    hora_fim TIME,
    local VARCHAR,
    professor VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.id,
        m.nome as materia_nome,
        m.cor as materia_cor,
        h.hora_inicio,
        h.hora_fim,
        h.local,
        m.professor
    FROM public.horarios h
    INNER JOIN public.materias m ON h.materia_id = m.id
    WHERE h.user_id = usuario_id 
        AND h.dia_semana = dia
    ORDER BY h.hora_inicio ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- FIM DO SCRIPT
-- ====================================

-- Verificar se tudo foi criado corretamente
SELECT 'Script executado com sucesso!' as status;
SELECT 'Tabelas criadas:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'materias', 'tarefas', 'horarios', 'configuracoes')
ORDER BY table_name;
