import React, {StrictMode} from 'react';
import {
  NavigationContainer,
  DefaultTheme as NavigationContainerDefaultTheme,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {QueryClientProvider} from '@tanstack/react-query';
import {TamaguiProvider, useTheme} from 'tamagui';

import '@app/lib/intl';
import appBridge from '@app/lib/native';
import queryClient from '@app/lib/query';
import DetailsScreen from '@app/screens/DetailsScreen';
import HomeScreen from '@app/screens/HomeScreen';
import SettingsScreen from '@app/screens/SettingsScreen';
import config from './tamagui.config';

import type {StackProps} from '@app/navigation/params';
import type {Theme as NavigationContainerTheme} from '@react-navigation/native';

const Stack = createStackNavigator<StackProps>();

function BackgroundProvider({children}: {children: React.ReactNode}) {
  const background = useTheme().background.get() || '#000000';
  appBridge.setBackgroundColor(background);
  const themedChildren = React.Children.map(children, (child, index) =>
    index === 0 && React.isValidElement(child)
      ? React.cloneElement(
          child as React.ReactElement<{
            theme?: NavigationContainerTheme | undefined;
          }>,
          {
            theme: {
              ...NavigationContainerDefaultTheme,
              dark: true,
              colors: {
                ...NavigationContainerDefaultTheme.colors,
                background,
              },
            },
          },
        )
      : child,
  );
  return <>{themedChildren}</>;
}

function App(): JSX.Element {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={config} disableInjectCSS defaultTheme="dark">
          <BackgroundProvider>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="Home"
                detachInactiveScreens
                screenOptions={{
                  headerShown: false,
                  animationEnabled: true,
                  detachPreviousScreen: true,
                  gestureEnabled: false,
                  cardStyle: {flex: 1},
                  cardStyleInterpolator: ({current}) => ({
                    cardStyle: {
                      opacity: current.progress,
                    },
                  }),
                }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Details" component={DetailsScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </BackgroundProvider>
        </TamaguiProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
