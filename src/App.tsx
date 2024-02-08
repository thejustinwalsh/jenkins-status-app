if (__DEV__) {
  import('../reactotron.config').then(() => console.log('Reactotron ready'));
}

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {TamaguiProvider, useTheme} from 'tamagui';

import config from './tamagui.config';

import type {StackProps} from '@app/navigation/params';

import {appBridge} from '@app/lib/native';
import HomeScreen from '@app/screens/HomeScreen';
import DetailsScreen from '@app/screens/DetailsScreen';

const Stack = createStackNavigator<StackProps>();

function BackgroundProvider({children}: {children: React.ReactNode}) {
  appBridge.setBackgroundColor(useTheme().background.get() || '#000000');
  return <>{children}</>;
}

function App(): JSX.Element {
  return (
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
  );
}

export default App;
