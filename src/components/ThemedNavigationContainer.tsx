import {useMemo} from 'react';
import {
  NavigationContainer,
  DefaultTheme as NavigationContainerDefaultTheme,
} from '@react-navigation/native';
import {useTheme} from 'tamagui';

import appBridge from '@app/lib/native';

import type React from 'react';

export default function ThemedNavigationContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const background = useTheme().background.get() || '#000000';
  appBridge.setBackgroundColor(background);

  const theme = useMemo(
    () => ({
      ...NavigationContainerDefaultTheme,
      dark: true,
      colors: {
        ...NavigationContainerDefaultTheme.colors,
        background,
      },
    }),
    [background],
  );

  return <NavigationContainer theme={theme}>{children}</NavigationContainer>;
}
