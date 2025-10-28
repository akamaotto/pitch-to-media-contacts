export const spacing = Object.freeze({
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
});

export const radii = Object.freeze({
  sm: '0.25rem', // 4px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  full: '9999px',
});

export const colors = Object.freeze({
  background: '#f8fafc',
  surface: '#ffffff',
  border: '#e2e8f0',
  borderStrong: '#cbd5f5',
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
  accent: '#111827',
  accentSoft: '#1f2937',
  accentForeground: '#f8fafc',
  foreground: '#0f172a',
  foregroundMuted: '#334155',
  success: '#047857',
  warning: '#f59e0b',
  danger: '#dc2626',
});

export const shadows = Object.freeze({
  sm: '0 1px 2px rgba(15, 23, 42, 0.06)',
  md: '0 8px 16px rgba(15, 23, 42, 0.08)',
});

export const typography = Object.freeze({
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  lineHeights: {
    snug: '1.35',
    normal: '1.5',
    relaxed: '1.65',
  },
});

export const designTokens = Object.freeze({
  spacing,
  radii,
  colors,
  shadows,
  typography,
});

export type DesignTokens = typeof designTokens;
