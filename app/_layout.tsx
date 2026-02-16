import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { palette } from '@/constants/theme';

const phoneclawDark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: palette.bg0,
    card: palette.bg1,
    border: palette.border,
    text: palette.textPrimary,
    primary: palette.accent,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={phoneclawDark}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.bg0 },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
