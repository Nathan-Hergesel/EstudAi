-- ====================================
-- QUERIES ÚTEIS PARA O ESTUDAI
-- ====================================
-- Coleção de queries SQL úteis para consultas, 
-- manutenção e debugging do banco de dados
-- ====================================

-- ====================================
-- 1. CONSULTAS DE USUÁRIOS
-- ====================================

-- Listar todos os perfis cadastrados
SELECT 
    id,
    username,
    nome,
    email,
    instituicao,
    curso,
    created_at
FROM public.profiles
ORDER BY created_at DESC;

-- Contar total de usuários
SELECT COUNT(*) as total_usuarios 
FROM public.profiles;

-- Buscar usuário específico por email
SELECT * 
FROM public.profiles 
WHERE email = 'usuario@exemplo.com';

-- ====================================
-- 2. CONSULTAS DE MATÉRIAS
-- ====================================

-- Listar todas as matérias de um usuário
SELECT 
    m.id,
    m.nome,
    m.professor,
    m.codigo,
    m.cor,
    COUNT(t.id) as total_tarefas,
    COUNT(CASE WHEN t.completed = false THEN 1 END) as tarefas_pendentes
FROM public.materias m
LEFT JOIN public.tarefas t ON t.materia_id = m.id
WHERE m.user_id = 'seu-uuid-aqui'
GROUP BY m.id, m.nome, m.professor, m.codigo, m.cor
ORDER BY m.nome;

-- Matérias mais utilizadas (com mais tarefas)
SELECT 
    m.nome,
    m.professor,
    COUNT(t.id) as total_tarefas
FROM public.materias m
LEFT JOIN public.tarefas t ON t.materia_id = m.id
WHERE m.user_id = 'seu-uuid-aqui'
GROUP BY m.id, m.nome, m.professor
ORDER BY total_tarefas DESC;

-- ====================================
-- 3. CONSULTAS DE TAREFAS
-- ====================================

-- Tarefas pendentes ordenadas por prioridade e data
SELECT 
    t.id,
    t.titulo,
    t.tipo,
    t.dificuldade,
    t.data_entrega,
    t.prioridade,
    m.nome as materia,
    m.cor as cor_materia
FROM public.tarefas t
LEFT JOIN public.materias m ON t.materia_id = m.id
WHERE t.user_id = 'seu-uuid-aqui'
    AND t.completed = false
ORDER BY t.data_entrega ASC, t.prioridade DESC;

-- Tarefas vencendo hoje
SELECT 
    t.titulo,
    t.tipo,
    t.hora_entrega,
    m.nome as materia
FROM public.tarefas t
LEFT JOIN public.materias m ON t.materia_id = m.id
WHERE t.user_id = 'seu-uuid-aqui'
    AND t.data_entrega = CURRENT_DATE
    AND t.completed = false
ORDER BY t.hora_entrega ASC;

-- Tarefas atrasadas
SELECT 
    t.titulo,
    t.tipo,
    t.data_entrega,
    m.nome as materia,
    CURRENT_DATE - t.data_entrega as dias_atrasado
FROM public.tarefas t
LEFT JOIN public.materias m ON t.materia_id = m.id
WHERE t.user_id = 'seu-uuid-aqui'
    AND t.data_entrega < CURRENT_DATE
    AND t.completed = false
ORDER BY t.data_entrega ASC;

-- Tarefas da semana
SELECT 
    t.titulo,
    t.tipo,
    t.data_entrega,
    TO_CHAR(t.data_entrega, 'Day') as dia_semana,
    m.nome as materia,
    m.cor
FROM public.tarefas t
LEFT JOIN public.materias m ON t.materia_id = m.id
WHERE t.user_id = 'seu-uuid-aqui'
    AND t.data_entrega BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
    AND t.completed = false
ORDER BY t.data_entrega ASC;

-- Estatísticas de tarefas por tipo
SELECT 
    tipo,
    COUNT(*) as total,
    COUNT(CASE WHEN completed = true THEN 1 END) as concluidas,
    COUNT(CASE WHEN completed = false THEN 1 END) as pendentes,
    ROUND(
        COUNT(CASE WHEN completed = true THEN 1 END)::numeric / 
        COUNT(*)::numeric * 100, 
        2
    ) as percentual_conclusao
FROM public.tarefas
WHERE user_id = 'seu-uuid-aqui'
GROUP BY tipo
ORDER BY total DESC;

-- Estatísticas de tarefas por matéria
SELECT 
    m.nome as materia,
    COUNT(t.id) as total_tarefas,
    COUNT(CASE WHEN t.completed = true THEN 1 END) as concluidas,
    COUNT(CASE WHEN t.completed = false THEN 1 END) as pendentes
FROM public.materias m
LEFT JOIN public.tarefas t ON t.materia_id = m.id AND t.user_id = m.user_id
WHERE m.user_id = 'seu-uuid-aqui'
GROUP BY m.id, m.nome
ORDER BY total_tarefas DESC;

-- ====================================
-- 4. CONSULTAS DE HORÁRIOS
-- ====================================

-- Horários da semana completa
SELECT 
    CASE h.dia_semana
        WHEN 0 THEN 'Domingo'
        WHEN 1 THEN 'Segunda'
        WHEN 2 THEN 'Terça'
        WHEN 3 THEN 'Quarta'
        WHEN 4 THEN 'Quinta'
        WHEN 5 THEN 'Sexta'
        WHEN 6 THEN 'Sábado'
    END as dia,
    h.hora_inicio,
    h.hora_fim,
    m.nome as materia,
    m.professor,
    h.local,
    m.cor
FROM public.horarios h
INNER JOIN public.materias m ON h.materia_id = m.id
WHERE h.user_id = 'seu-uuid-aqui'
ORDER BY h.dia_semana, h.hora_inicio;

-- Horários de hoje
SELECT 
    h.hora_inicio,
    h.hora_fim,
    m.nome as materia,
    m.professor,
    h.local,
    m.cor
FROM public.horarios h
INNER JOIN public.materias m ON h.materia_id = m.id
WHERE h.user_id = 'seu-uuid-aqui'
    AND h.dia_semana = EXTRACT(DOW FROM CURRENT_DATE)
ORDER BY h.hora_inicio;

-- Próxima aula
SELECT 
    m.nome as materia,
    h.hora_inicio,
    h.local,
    m.professor
FROM public.horarios h
INNER JOIN public.materias m ON h.materia_id = m.id
WHERE h.user_id = 'seu-uuid-aqui'
    AND h.dia_semana = EXTRACT(DOW FROM CURRENT_DATE)
    AND h.hora_inicio > CURRENT_TIME
ORDER BY h.hora_inicio
LIMIT 1;

-- Carga horária total por dia
SELECT 
    CASE dia_semana
        WHEN 0 THEN 'Domingo'
        WHEN 1 THEN 'Segunda'
        WHEN 2 THEN 'Terça'
        WHEN 3 THEN 'Quarta'
        WHEN 4 THEN 'Quinta'
        WHEN 5 THEN 'Sexta'
        WHEN 6 THEN 'Sábado'
    END as dia,
    COUNT(*) as qtd_aulas,
    SUM(
        EXTRACT(EPOCH FROM (hora_fim - hora_inicio))/3600
    )::numeric(10,2) as horas_totais
FROM public.horarios
WHERE user_id = 'seu-uuid-aqui'
GROUP BY dia_semana
ORDER BY dia_semana;

-- ====================================
-- 5. ESTATÍSTICAS GERAIS
-- ====================================

-- Dashboard resumido do usuário
SELECT 
    (SELECT COUNT(*) FROM public.materias WHERE user_id = 'seu-uuid-aqui') as total_materias,
    (SELECT COUNT(*) FROM public.tarefas WHERE user_id = 'seu-uuid-aqui' AND completed = false) as tarefas_pendentes,
    (SELECT COUNT(*) FROM public.tarefas WHERE user_id = 'seu-uuid-aqui' AND completed = true) as tarefas_concluidas,
    (SELECT COUNT(*) FROM public.tarefas WHERE user_id = 'seu-uuid-aqui' AND data_entrega < CURRENT_DATE AND completed = false) as tarefas_atrasadas,
    (SELECT COUNT(*) FROM public.horarios WHERE user_id = 'seu-uuid-aqui') as total_horarios;

-- Produtividade nos últimos 30 dias
SELECT 
    DATE(created_at) as data,
    COUNT(*) as tarefas_criadas,
    COUNT(CASE WHEN completed = true THEN 1 END) as tarefas_concluidas
FROM public.tarefas
WHERE user_id = 'seu-uuid-aqui'
    AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY data DESC;

-- ====================================
-- 6. MANUTENÇÃO E LIMPEZA
-- ====================================

-- Remover tarefas concluídas há mais de 90 dias
DELETE FROM public.tarefas
WHERE user_id = 'seu-uuid-aqui'
    AND completed = true
    AND updated_at < CURRENT_DATE - INTERVAL '90 days';

-- Arquivar tarefas antigas (marcar como concluídas)
UPDATE public.tarefas
SET completed = true
WHERE user_id = 'seu-uuid-aqui'
    AND data_entrega < CURRENT_DATE - INTERVAL '30 days'
    AND completed = false;

-- ====================================
-- 7. VERIFICAÇÕES DE INTEGRIDADE
-- ====================================

-- Verificar perfis sem configurações
SELECT p.id, p.nome, p.email
FROM public.profiles p
LEFT JOIN public.configuracoes c ON c.user_id = p.id
WHERE c.user_id IS NULL;

-- Verificar tarefas sem matéria atribuída
SELECT id, titulo, tipo, data_entrega
FROM public.tarefas
WHERE user_id = 'seu-uuid-aqui'
    AND materia_id IS NULL
    AND completed = false;

-- Verificar horários órfãos (sem matéria válida)
SELECT h.id, h.dia_semana, h.hora_inicio
FROM public.horarios h
LEFT JOIN public.materias m ON h.materia_id = m.id
WHERE h.user_id = 'seu-uuid-aqui'
    AND m.id IS NULL;

-- ====================================
-- 8. RELATÓRIOS
-- ====================================

-- Relatório mensal de produtividade
SELECT 
    TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as mes,
    COUNT(*) as tarefas_criadas,
    COUNT(CASE WHEN completed = true THEN 1 END) as concluidas,
    ROUND(
        COUNT(CASE WHEN completed = true THEN 1 END)::numeric / 
        COUNT(*)::numeric * 100, 
        2
    ) as taxa_conclusao
FROM public.tarefas
WHERE user_id = 'seu-uuid-aqui'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY mes DESC;

-- Ranking de matérias por dificuldade média
SELECT 
    m.nome as materia,
    COUNT(t.id) as total_tarefas,
    ROUND(AVG(
        CASE t.dificuldade
            WHEN 'Fácil' THEN 1
            WHEN 'Médio' THEN 2
            WHEN 'Difícil' THEN 3
            ELSE 0
        END
    ), 2) as nivel_dificuldade_medio
FROM public.materias m
LEFT JOIN public.tarefas t ON t.materia_id = m.id
WHERE m.user_id = 'seu-uuid-aqui'
    AND t.dificuldade IS NOT NULL
GROUP BY m.id, m.nome
HAVING COUNT(t.id) > 0
ORDER BY nivel_dificuldade_medio DESC;

-- ====================================
-- 9. BACKUP E EXPORTAÇÃO
-- ====================================

-- Exportar todos os dados do usuário (copie o resultado)
SELECT 
    'profiles' as tabela,
    row_to_json(p.*) as dados
FROM public.profiles p
WHERE p.id = 'seu-uuid-aqui'
UNION ALL
SELECT 
    'materias' as tabela,
    row_to_json(m.*) as dados
FROM public.materias m
WHERE m.user_id = 'seu-uuid-aqui'
UNION ALL
SELECT 
    'tarefas' as tabela,
    row_to_json(t.*) as dados
FROM public.tarefas t
WHERE t.user_id = 'seu-uuid-aqui'
UNION ALL
SELECT 
    'horarios' as tabela,
    row_to_json(h.*) as dados
FROM public.horarios h
WHERE h.user_id = 'seu-uuid-aqui'
UNION ALL
SELECT 
    'configuracoes' as tabela,
    row_to_json(c.*) as dados
FROM public.configuracoes c
WHERE c.user_id = 'seu-uuid-aqui';

-- ====================================
-- FIM DAS QUERIES ÚTEIS
-- ====================================

-- OBSERVAÇÃO: Substitua 'seu-uuid-aqui' pelo UUID real do usuário
-- Para obter o UUID do usuário atual em uma aplicação:
-- SELECT auth.uid();
