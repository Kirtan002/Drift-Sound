import { Theme as NavigationTheme } from '@react-navigation/native';

export const Colors = {
  primary: '#6C8EFF',
  background: '#0C0C12',
  surface: '#1A1A24',
  text: '#FFFFFF',
  textSecondary: '#A0A0B0',
  error: '#FF5252',
  success: '#4CAF50',
  indigo: '#6C8EFF',
  black: '#000000',
};

export const Theme: { dark: NavigationTheme; light: NavigationTheme } = {
  dark: {
    dark: true,
    colors: {
      primary: Colors.primary,
      background: Colors.background,
      card: Colors.surface,
      text: Colors.text,
      border: '#2A2A3A',
      notification: Colors.primary,
    },
    fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '900' },
    }
  },
  light: {
    dark: false,
    colors: {
      primary: Colors.primary,
      background: '#F0F2F5',
      card: '#FFFFFF',
      text: '#0C0C12',
      border: '#E0E0E0',
      notification: Colors.primary,
    },
    fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '900' },
    }
  },
};
