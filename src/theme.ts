export type ThemeMode = 'light' | 'dark';

export const lightColors = {
  background: '#f7f9fc',
  card: '#ffffff',
  text: '#1f2933',
  muted: '#6b7280',
  accent: '#1e88e5',
  warning: '#f59e0b',
  border: '#e5e7eb',
};

export const darkColors = {
  background: '#0f172a',
  card: '#1e293b',
  text: '#f1f5f9',
  muted: '#94a3b8',
  accent: '#3b82f6',
  warning: '#f59e0b',
  border: '#334155',
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
};

// Legacy export for backward compatibility (will be replaced by theme hook)
export const colors = lightColors;

