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

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 16,
  pill: 9999
} as const;

export const shadows = {
  ambient: {
    shadowColor: '#191C1E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6
  }
} as const;
