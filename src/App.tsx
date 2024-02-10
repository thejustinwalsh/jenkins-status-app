import React, {StrictMode} from 'react';
import {
  NavigationContainer,
  DefaultTheme as NavigationContainerDefaultTheme,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {TamaguiProvider, useTheme} from 'tamagui';

import config from './tamagui.config';

import {appBridge} from '@app/lib/native';
import HomeScreen from '@app/screens/HomeScreen';
import DetailsScreen from '@app/screens/DetailsScreen';

import type {Theme as NavigationContainerTheme} from '@react-navigation/native';
import type {StackProps} from '@app/navigation/params';

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
      <TamaguiProvider config={config} disableInjectCSS defaultTheme="dark">
        <BackgroundProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
                animationEnabled: true,
                detachPreviousScreen: true,
                cardStyleInterpolator: ({current}) => ({
                  cardStyle: {
                    opacity: current.progress,
                  },
                }),
              }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Details" component={DetailsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </BackgroundProvider>
      </TamaguiProvider>
    </StrictMode>
  );
}

export default App;
