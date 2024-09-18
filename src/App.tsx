import {StrictMode, useMemo} from 'react';
import {IntlProvider} from 'react-intl';
// @ts-expect-error
import {useMMKVDevTools} from '@dev-plugins/react-native-mmkv';
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
import ProjectSelectionScreen from '@app/screens/ProjectSelectionScreen';
import SettingsScreen from '@app/screens/SettingsScreen';
import WelcomeScreen from '@app/screens/WelcomeScreen';
import {AppProvider} from './contexts/AppContext';
import {useProjects} from './hooks/useProjects';
import config from './tamagui.config';

import type {StackProps} from '@app/navigation/params';
import type {StackNavigationOptions} from '@react-navigation/stack';

// TODO: Expo Dev-Plugins for fetch
if (false /*__DEV__*/) {
  XHRInterceptor.enableInterception();
  XHRInterceptor.setResponseCallback(
    (
      status: number,
      timeout: number,
      response: unknown,
      responseURL: string,
      ...res: unknown[]
    ) => {
      if (
        status >= 400 &&
        (!responseURL.includes(':8081') || !responseURL.includes(':8082'))
      ) {
        console.warn(
          'fetch:',
          JSON.stringify(
            {status, timeout, response, responseURL, ...res},
            null,
            2,
          ),
        );
      }
    },
  );
}

const Stack = createStackNavigator<StackProps>();
const screenOptions: StackNavigationOptions = {
  headerShown: false,
  animationEnabled: false,
  detachPreviousScreen: true,
  gestureEnabled: false,
  cardStyle: {flex: 1},
  //cardStyleInterpolator: ({current}) => ({
  //  cardStyle: {
  //    opacity: current.progress,
  //  },
  //}),
};

function App(): JSX.Element {
  const [projects] = useProjects();
  const initialRouteName: keyof StackProps = useMemo(
    () => (projects.length === 0 ? 'Welcome' : 'Home'),
    [projects],
  );

  // Dev Plugins
  useMMKVDevTools();
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
              <AppProvider>
                <Stack.Navigator
                  initialRouteName={initialRouteName}
                  detachInactiveScreens
                  screenOptions={screenOptions}>
                  <Stack.Screen name="Welcome" component={WelcomeScreen} />
                  <Stack.Screen
                    name="ProjectSelection"
                    component={ProjectSelectionScreen}
                  />
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Details" component={DetailsScreen} />
                  <Stack.Screen name="Settings" component={SettingsScreen} />
                </Stack.Navigator>
              </AppProvider>
            </ThemedNavigationContainer>
          </TamaguiProvider>
        </SWRConfig>
      </IntlProvider>
    </StrictMode>
  );
}

export default App;
