import twColors from 'tailwindcss/colors';

export const colors = {
  primary: '#4F46E5',
  alert: {
    success: '#10B981',
    error: '#EF4444',
  },
  lightBackground: '#EEEEEE',
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  white: twColors.white,
  black: twColors.black,
  transparent: twColors.transparent,
} as const;
