export const colors = {
  primary: '#2563EB',
  primaryContainer: '#002976',
  surface: '#F7F9FB',
  surfaceLow: '#F2F4F6',
  surfaceLowest: '#FFFFFF',
  surfaceBright: 'rgba(255, 255, 255, 0.7)',
  onSurface: '#191C1E',
  onPrimary: '#FFFFFF',
  secondaryContainer: '#DEE9FF',
  onSecondaryContainer: '#11224A',
  tertiaryContainer: '#D7F8E8',
  errorContainer: '#FFDAD6',
  error: '#BA1A1A',
  outlineVariant: 'rgba(198, 197, 212, 0.3)',
  muted: '#6F7479'
} as const;

/**
 * Escala de espaçamento usada em todo o app.
 * xxs → ajuste fino (4)  xs → compacto (6)   sm → interno (10)
 * md  → padrão (16)      lg → seção (24)      xl → hero (32)   xxl → topo (48)
 *
 * Regra de ouro: padding horizontal de telas sempre spacing.md (16).
 */
export const spacing = {
  xxs: 4,
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 9999
} as const;

/**
 * Constantes de layout responsivo.
 * sheetBreakpoint: largura acima da qual ModalSheet vira diálogo centralizado.
 * contentMaxWidth: largura máxima do conteúdo em tablets/web.
 * modalMaxWidth:   largura máxima do diálogo modal em telas largas.
 */
export const layout = {
  sheetBreakpoint: 600,
  contentMaxWidth: 640,
  modalMaxWidth: 520
} as const;

export const shadows = {
  ambient: {
    shadowColor: '#191C1E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6
  },
  card: {
    shadowColor: '#191C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  }
} as const;
