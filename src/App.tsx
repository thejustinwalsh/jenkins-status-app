import {StrictMode} from 'react';
import {IntlProvider} from 'react-intl';
// @ts-expect-error
import {useVanillaLogViewer} from '@dev-plugins/vanilla-log-viewer';
import {createStackNavigator} from '@react-navigation/stack';
// @ts-expect-error
import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
import {SWRConfig} from 'swr';
import {TamaguiProvider} from 'tamagui';

import '@app/lib/intl';

import ThemedNavigationContainer from '@app/components/ThemedNavigationContainer';
import DetailsScreen from '@app/screens/DetailsScreen';
import HomeScreen from '@app/screens/HomeScreen';
import SettingsScreen from '@app/screens/SettingsScreen';
import config from './tamagui.config';

import type {StackProps} from '@app/navigation/params';
import type {StackNavigationOptions} from '@react-navigation/stack';

// TODO: Expo Dev-Plugins for fetch
if (__DEV__) {
  XHRInterceptor.enableInterception();
  XHRInterceptor.setResponseCallback((...obj: unknown[]) => {
    if (obj[0] !== 200) {
      console.warn('fetch:', JSON.stringify(obj, null, 2));
    }
  });
}

const Stack = createStackNavigator<StackProps>();
const screenOptions: StackNavigationOptions = {
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
};

function App(): JSX.Element {
  useVanillaLogViewer();

  return (
    <StrictMode>
      <IntlProvider locale="en" defaultLocale="en" messages={{}}>
        <SWRConfig
          value={{
            provider: () => new Map(),
            isOnline: () => true,
            isVisible: () => true,
          }}>
          <TamaguiProvider config={config} disableInjectCSS defaultTheme="dark">
            <ThemedNavigationContainer>
              <Stack.Navigator
                initialRouteName="Home"
                detachInactiveScreens
                screenOptions={screenOptions}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Details" component={DetailsScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
              </Stack.Navigator>
            </ThemedNavigationContainer>
          </TamaguiProvider>
        </SWRConfig>
      </IntlProvider>
    </StrictMode>
  );
}

export default App;
