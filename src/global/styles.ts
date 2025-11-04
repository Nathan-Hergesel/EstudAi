/**
 * Estilos globais e tokens de UI compartilhados.
 * - Centraliza cores de ../constants/colors e padrões de UI (botões, chips, inputs, header/footer).
 * - Inclui estilos específicos para modais: filtro, edição em lote e tarefa.
 *
 * Exports:
 *  - default: globalStyles
 *  - filterModalStyles
 *  - editarModalStyles
 *  - tarefaModalStyles
 */
import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

/**
 * Estilos globais base aplicáveis em todo o app.
 */
const globalStyles = StyleSheet.create({
  // Container base de página (fundo, espaçamento externo)
  container: {
    flex: 1,
  backgroundColor: colors.fundoSecundario,
    padding: 20,
  },
  // Variante compacta do container para modais em "pageSheet"
  containerCompact: {
    // Padding lateral menor para modais
    paddingHorizontal: 16,
    // Espaço superior maior para respiro do header do modal
    paddingTop: 32,
    // Espaço inferior curto para alinhamento com área segura
    paddingBottom: 16,
  },
  // Região rolável/expandível principal do conteúdo
  content: {
    flex: 1,
  },
  // Separador padrão entre seções
  section: {
    marginBottom: 20,
  },
  // Cabeçalho padrão com alinhamento horizontal e divisor inferior
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  backgroundColor: colors.superficie,
  borderBottomWidth: 1,
  borderBottomColor: colors.borda,
  },
  // Título principal de tela ou bloco
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  color: colors.textoPrimario,
  },
  // Rodapé com padding e divisor superior (para ações)
  footer: {
    padding: 20,
  backgroundColor: colors.superficie,
  borderTopWidth: 1,
  borderTopColor: colors.borda,
  },
  // Botão primário (CTA)
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  backgroundColor: colors.primario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Texto do botão primário
  buttonText: {
  color: colors.textoInverso,
    fontSize: 16,
    fontWeight: '600',
  },
  // Chips / Pills (opções)
  // Contêiner de chips com quebra de linha e espaçamento
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  // Chip padrão (não selecionado)
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  borderColor: colors.borda,
  backgroundColor: colors.superficie,
  },
  // Variantes aplicadas quando o chip está selecionado
  chipSelected: {
    borderWidth: 2,
  },
  // Texto padrão de chip
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  color: colors.textoPrimario,
  },
  // Texto de chip quando selecionado
  chipTextSelected: {
  color: colors.textoInverso,
    fontWeight: '700',
  },
  // Botão secundário (contorno)
  buttonSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  backgroundColor: colors.superficie,
  borderWidth: 1,
  borderColor: colors.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Texto do botão secundário
  buttonSecondaryText: {
  color: colors.textoPrimario,
    fontSize: 16,
    fontWeight: '600',
  },
  // Botão destrutivo (ações de risco)
  buttonDestructive: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.erro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Texto do botão destrutivo
  buttonDestructiveText: {
    color: colors.textoInverso,
    fontSize: 16,
    fontWeight: '600',
  },
  // Campo de entrada padrão
  input: {
    backgroundColor: colors.superficie,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textoPrimario,
    borderWidth: 1,
    borderColor: colors.borda,
    marginBottom: 10,
  },
  // Rótulo associado a inputs
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textoPrimario,
    marginBottom: 8,
  },
  // Texto padrão
  text: {
  fontSize: 14,
  color: colors.textoPrimario,
  },
  // Box de modal com sombra e raio
  modal: {
    flex: 1,
  backgroundColor: colors.superficie,
    borderRadius: 16,
    padding: 20,
    margin: 10,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

/**
 * Estilos específicos do modal de filtros.
 */
export const filterModalStyles = StyleSheet.create({
  // Título do grupo de opções do filtro
  optionGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textoPrimario,
    marginBottom: 12,
  },
  // Aparência do chip quando selecionado (tema primário)
  chipSelected: {
  borderColor: colors.primario,
  backgroundColor: colors.primario,
  },
  // Texto do chip quando selecionado no filtro
  chipTextSelected: {
  color: colors.textoInverso,
    fontWeight: '700',
  },
});

/**
 * Estilos específicos do modal de edição em lote.
 */
export const editarModalStyles = StyleSheet.create({
  // Espaço reservado para equilibrar o header
  headerPlaceholder: {
    width: 60,
  },
  // Item de ação em lista (linha com ícone/ponto e label)
  actionItem: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  backgroundColor: colors.superficie,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Indicador circular colorido da ação
  actionDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  // Texto/descrição da ação
  actionLabel: {
    fontSize: 16,
  },
  // Item de tarefa listado para edição em lote
  taskItem: {
    marginBottom: 8,
  },
});

/**
 * Estilos específicos do modal de tarefa (categorias e dificuldades semânticas).
 */
export const tarefaModalStyles = StyleSheet.create({
  // Rótulo dos campos da tarefa
  label: {
    fontSize: 16,
    fontWeight: '600',
  color: colors.textoPrimario,
    marginBottom: 8,
  },
  // Campo de texto da tarefa
  input: {
  backgroundColor: colors.superficie,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  color: colors.textoPrimario,
    borderWidth: 1,
  borderColor: colors.borda,
  },
  // Área de texto multi-linha
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  // Estado selecionado genérico para opções
  chipSelected: {
    borderWidth: 2,
  },
  // Texto quando a opção/seleção está ativa
  optionTextSelected: {
  color: colors.textoInverso,
    fontWeight: '700',
  },
  // Seleção: categoria Atividade (cor semântica)
  optionActivitySelected: {
  backgroundColor: colors.atividade,
  borderColor: colors.atividade,
  },
  // Seleção: categoria Trabalho
  optionWorkSelected: {
  backgroundColor: colors.trabalho,
  borderColor: colors.trabalho,
  },
  // Seleção: categoria Prova
  optionExamSelected: {
  backgroundColor: colors.prova,
  borderColor: colors.prova,
  },
  // Borda padrão: categoria Atividade
  optionActivity: {
  borderColor: colors.sucesso,
  },
  // Borda padrão: categoria Trabalho
  optionWork: {
  borderColor: colors.aviso,
  },
  // Borda padrão: categoria Prova
  optionExam: {
  borderColor: colors.erro,
  },
  // Seleção: dificuldade Fácil
  optionEasySelected: {
  backgroundColor: colors.facil,
  borderColor: colors.facil,
  },
  // Seleção: dificuldade Média
  optionMediumSelected: {
  backgroundColor: colors.medio,
  borderColor: colors.medio,
  },
  // Seleção: dificuldade Difícil
  optionHardSelected: {
  backgroundColor: colors.dificil,
  borderColor: colors.dificil,
  },
  // Borda padrão: dificuldade Fácil
  optionEasy: {
  borderColor: colors.sucesso,
  },
  // Borda padrão: dificuldade Média
  optionMedium: {
  borderColor: colors.aviso,
  },
  // Borda padrão: dificuldade Difícil
  optionHard: {
  borderColor: colors.erro,
  },
});

/**
 * Estilos específicos da navegação inferior (bottom tab).
 */
export const navegacaoInferiorStyles = StyleSheet.create({
  // Área segura fixa no rodapé, cobrindo bottom inset
  safeArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  // Barra de navegação: fileira com sombra e borda superior
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: colors.superficie,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderTopWidth: 2,
    borderTopColor: colors.borda,
    shadowColor: colors.sombra,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  
  // Item individual (largura flex, centralizado)
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  
  // Estado ativo do item (realce de fundo e borda)
  bottomNavItemActive: {
    backgroundColor: colors.primarioClaro,
    borderColor: colors.primario,
    borderWidth: 2,
  },
  
  // Texto padrão do item (rótulo)
  bottomNavText: {
    fontSize: 12,
    color: colors.textoSecundario,
    fontWeight: '500',
    marginTop: 2,
  },
  
  // Texto do item ativo (usa cor primária)
  bottomNavTextActive: {
    color: colors.primario,
    fontWeight: '600',
  },
});

export default globalStyles;
