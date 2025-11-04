// Estilos da tela de Tarefas
// Organiza containers, navegação, busca, cards, estados e ações
import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundo,
  },
  
  // Status bar e top area
  statusBar: {
    height: 44,
    backgroundColor: colors.fundo,
    paddingTop: 0,
  },
  
  // Navegação superior
  topNavigation: {
    flexDirection: 'row',
    backgroundColor: colors.superficie,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.borda,
    shadowColor: colors.sombra,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  
  navButtonActive: {
    backgroundColor: colors.primarioClaro,
    borderColor: colors.primario,
    borderWidth: 2,
  },
  
  navButtonInactive: {
    backgroundColor: 'transparent',
  },
  
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  navButtonTextActive: {
    color: colors.primario,
  },
  
  navButtonTextInactive: {
    color: colors.textoSecundario,
  },
  
  // Barra de pesquisa
  searchContainer: {
    backgroundColor: colors.superficie,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.superficie,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.borda,
    shadowColor: colors.sombra,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textoPrimario,
    marginLeft: 10,
  },
  
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: colors.textoSecundario,
  },
  
  // Filtros
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  
  filterIcon: {
    width: 20,
    height: 20,
    tintColor: colors.textoSecundario,
    marginRight: 6,
  },
  
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.superficie,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 96,
    borderWidth: 2,
    borderColor: colors.borda,
    shadowColor: colors.sombra,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  
  filterButtonText: {
    fontSize: 14,
    color: colors.textoPrimario,
    fontWeight: '500',
  },
  
  // Lista de tarefas
  tasksContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 20,
  },
  
  // Card de tarefa
  taskCard: {
    backgroundColor: colors.superficie,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.sombra,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borda,
  },
  
  // Labels do card
  labelsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  label: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 0,
  },
  
  labelActivity: {
    backgroundColor: colors.atividade,
  },
  
  labelWork: {
    backgroundColor: colors.trabalho,
  },
  
  labelExam: {
    backgroundColor: colors.prova,
  },
  
  labelDifficulty: {
    backgroundColor: colors.facil,
  },
  
  labelDifficultyMedium: {
    backgroundColor: colors.medio,
  },
  
  labelDifficultyHard: {
    backgroundColor: colors.dificil,
  },
  
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textoInverso,
  },
  
  // Título da tarefa
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textoPrimario,
    marginBottom: 8,
  },
  
  // Descrição da tarefa
  taskDescription: {
    fontSize: 14,
    color: colors.textoSecundario,
    lineHeight: 20,
    marginBottom: 12,
  },
  
  // Data e hora
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  dateTimeIcon: {
    width: 16,
    height: 16,
    tintColor: colors.textoSecundario,
    marginRight: 6,
  },
  
  dateTimeText: {
    fontSize: 14,
    color: colors.textoSecundario,
    fontWeight: '500',
  },
  
  // Botão de editar
  editButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.superficieSecundaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  editIcon: {
    width: 16,
    height: 16,
    tintColor: colors.textoSecundario,
  },
  

  // Estados de tarefa concluída
  taskCardCompleted: {
    opacity: 0.3,
  },

  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textoTerciario,
  },

  taskDescriptionCompleted: {
    color: colors.textoTerciario,
    textDecorationLine: 'line-through',
  },

  dateTimeTextCompleted: {
    color: colors.textoTerciario,
    textDecorationLine: 'line-through',
  },

  // Risco para textos de labels quando concluído
  labelTextCompleted: {
    textDecorationLine: 'line-through',
  },

  // (removidos estilos de chip com texto para estados)

  // (removidos indicadores de status em forma de círculo)

  // Botões de ação
  actionButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },

  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.fundoSecundario,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borda,
  },

  // Estado vazio
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textoSecundario,
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textoTerciario,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Modo de seleção
  taskCardSelected: {
    borderWidth: 2,
    borderColor: colors.primario,
    backgroundColor: colors.primarioClaro,
  },

  selectionIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },

  // Botões de filtro e edição em lote
  batchEditButton: {
    backgroundColor: colors.primario,
    borderWidth: 2,
    borderColor: colors.primarioEscuro,
    shadowColor: colors.sombra,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  batchEditText: {
    color: colors.textoInverso,
    fontWeight: '600',
  },
});