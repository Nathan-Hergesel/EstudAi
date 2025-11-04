/**
 * Modal de filtros para a lista de tarefas.
 * Permite ao usuário filtrar por: período, tipo, dificuldade e status.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
// Estilos globais compartilhados e estilos específicos do modal de filtro
import globalStyles from '../global/styles';
import { filterModalStyles } from '../global/styles';

/**
 * Estrutura com as opções/estado de filtros
 */
export interface FilterOptions {
  /** Período selecionado (ex.: 'Hoje', 'Esta semana', 'Todos') */
  period: string;
  /** Tipo selecionado (ex.: 'ATIVIDADE', 'TRABALHO', 'PROVA', 'Todos') */
  type: string;
  /** Dificuldade selecionada (ex.: 'Fácil', 'Médio', 'Difícil', 'Todos') */
  difficulty: string;
  /** Status selecionado (ex.: 'Pendentes', 'Concluídas', 'Todos') */
  status: string;
}

/**
 * Propriedades aceitas pelo componente de Filtro
 */
interface FilterModalProps {
  /** Controla a visibilidade do modal */
  visible: boolean;
  /** Callback para fechar o modal sem aplicar */
  onClose: () => void;
  /** Callback para aplicar filtros selecionados */
  onApplyFilters: (filters: FilterOptions) => void;
  /** Filtros atualmente ativos na tela pai */
  currentFilters: FilterOptions;
}

/**
 * Componente de modal responsável por exibir e coletar filtros da lista de tarefas.
 */
const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  // Estado local que reflete os filtros selecionados no modal
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  // Sempre que o modal abrir ou currentFilters mudar, sincroniza o estado local
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters, visible]);

  // Aplica os filtros (propaga para o chamador) e fecha o modal
  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  // Restaura os filtros para o estado "Todos"
  const handleReset = () => {
    const resetFilters: FilterOptions = {
      period: 'Todos',
      type: 'Todos',
      difficulty: 'Todos',
      status: 'Todos',
    };
    setFilters(resetFilters);
  };

  // Opções do filtro por período
  const periodOptions = ['Todos', 'Hoje', 'Esta semana', 'Este mês', 'Próximos 7 dias'];
  // Opções do filtro por tipo de tarefa
  const typeOptions = ['Todos', 'ATIVIDADE', 'TRABALHO', 'PROVA'];
  // Opções do filtro por nível de dificuldade
  const difficultyOptions = ['Todos', 'Fácil', 'Médio', 'Difícil'];
  // Opções do filtro por status de conclusão (removido 'Pendentes')
  const statusOptions = ['Todos', 'Concluídas'];

  // Renderiza um grupo de opções (chips) com título e seleção
  /**
   * Renderiza um grupo de opções estilo chip.
   * @param title Título do grupo (ex.: 'Período')
   * @param options Lista de opções disponíveis
   * @param currentValue Valor atualmente selecionado
   * @param onSelect Callback chamado ao selecionar uma opção
   */
  const renderOptionGroup = (
    title: string,
    options: string[],
    currentValue: string,
    onSelect: (value: string) => void
  ) => (
    <View style={globalStyles.section}>
      {/* Título do grupo */}
  <Text style={filterModalStyles.optionGroupTitle}>{title}</Text>
      {/* Grade de chips com quebra de linha */}
      <View style={globalStyles.chipsRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            /* Chip base + estado selecionado */
            style={[
              globalStyles.chip,
              currentValue === option && filterModalStyles.chipSelected,
            ]}
            onPress={() => onSelect(option)}
          >
            <Text
              /* Texto base + estado selecionado */
              style={[
                globalStyles.chipText,
                currentValue === option && filterModalStyles.chipTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      {/* Container geral do modal de filtros */}
      <View style={[globalStyles.container, globalStyles.containerCompact]}>
        <View style={globalStyles.header}>
          {/* Cabeçalho com Cancelar, Título e botão de Limpar */}
          <TouchableOpacity onPress={onClose} style={globalStyles.buttonSecondary}>
            <Text style={globalStyles.buttonSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={globalStyles.title}>Filtros</Text>
          <TouchableOpacity onPress={handleReset} style={globalStyles.buttonDestructive}>
            <Text style={globalStyles.buttonDestructiveText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        {/* Área rolável com grupos de filtros */}
        <ScrollView style={globalStyles.content} showsVerticalScrollIndicator={false}>
          {/* Seções de filtros: Período, Tipo, Dificuldade e Status */}
          {renderOptionGroup(
            'Período',
            periodOptions,
            filters.period,
            (value) => setFilters(prev => ({ ...prev, period: value }))
          )}

          {renderOptionGroup(
            'Tipo',
            typeOptions,
            filters.type,
            (value) => setFilters(prev => ({ ...prev, type: value }))
          )}

          {renderOptionGroup(
            'Dificuldade',
            difficultyOptions,
            filters.difficulty,
            (value) => setFilters(prev => ({ ...prev, difficulty: value }))
          )}

          {renderOptionGroup(
            'Status',
            statusOptions,
            filters.status,
            (value) => setFilters(prev => ({ ...prev, status: value }))
          )}
        </ScrollView>

        <View style={globalStyles.footer}>
          {/* Botão para aplicar os filtros selecionados */}
          <TouchableOpacity style={globalStyles.button} onPress={handleApply}>
            <Text style={globalStyles.buttonText}>Aplicar Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
