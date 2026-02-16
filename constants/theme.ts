/**
 * PhoneClaw Design System
 * Neutral grey/black — shadcn-inspired
 */

import { Platform } from 'react-native';

/* ─── Neutral Grey Palette (shadcn-inspired) ─── */
export const palette = {
  // Backgrounds
  black: '#000000',
  bg0: '#09090B',       // zinc-950
  bg1: '#0F0F12',       // slightly lifted
  bg2: '#18181B',       // zinc-900
  bg3: '#27272A',       // zinc-800
  bg4: '#3F3F46',       // zinc-700

  // Text
  textPrimary: '#FAFAFA',     // zinc-50
  textSecondary: '#A1A1AA',   // zinc-400
  textTertiary: '#71717A',    // zinc-500
  textMuted: '#52525B',       // zinc-600

  // Accent (white/neutral — shadcn primary)
  accent: '#FAFAFA',
  accentLight: '#FFFFFF',
  accentDark: '#D4D4D8',      // zinc-300
  accentGlow: 'rgba(250, 250, 250, 0.06)',

  // Semantic
  success: '#22C55E',         // green-500
  successBg: 'rgba(34, 197, 94, 0.08)',
  error: '#EF4444',           // red-500
  errorBg: 'rgba(239, 68, 68, 0.08)',
  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.08)',
  info: '#3B82F6',
  infoBg: 'rgba(59, 130, 246, 0.08)',

  // Tool colors
  toolBlue: '#60A5FA',        // blue-400
  toolBlueBg: 'rgba(96, 165, 250, 0.06)',
  toolGreen: '#4ADE80',       // green-400
  toolGreenBg: 'rgba(74, 222, 128, 0.06)',

  // Borders
  border: 'rgba(255, 255, 255, 0.06)',
  borderLight: 'rgba(255, 255, 255, 0.10)',
  borderMed: 'rgba(255, 255, 255, 0.14)',
  borderAccent: 'rgba(250, 250, 250, 0.20)',
  borderDashed: 'rgba(255, 255, 255, 0.08)',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  glass: 'rgba(15, 15, 18, 0.92)',
} as const;

/* ─── Spacing (4px base) ─── */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

/* ─── Radius ─── */
export const radius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 22,
  full: 999,
} as const;

/* ─── Typography ─── */
const fontFamily = Platform.select({
  ios: { regular: 'System', mono: 'Menlo' },
  default: { regular: 'sans-serif', mono: 'monospace' },
})!;

export const typography = {
  hero: { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.8, fontFamily: fontFamily.regular },
  title: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.3, fontFamily: fontFamily.regular },
  subtitle: { fontSize: 15, fontWeight: '500' as const, fontFamily: fontFamily.regular },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22, fontFamily: fontFamily.regular },
  bodySm: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18, fontFamily: fontFamily.regular },
  caption: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.3, fontFamily: fontFamily.regular },
  mono: { fontSize: 12, fontFamily: fontFamily.mono, lineHeight: 18 },
  label: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.8, textTransform: 'uppercase' as const, fontFamily: fontFamily.regular },
} as const;

/* ─── Shadows ─── */
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
} as const;

/* ─── Legacy ─── */
export const Colors = {
  light: { text: palette.textPrimary, background: palette.bg0, tint: palette.accent, icon: palette.textTertiary, tabIconDefault: palette.textTertiary, tabIconSelected: palette.accent },
  dark: { text: palette.textPrimary, background: palette.bg0, tint: palette.accent, icon: palette.textTertiary, tabIconDefault: palette.textTertiary, tabIconSelected: palette.accent },
};

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
});
