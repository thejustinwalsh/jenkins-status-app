if (__DEV__) {
  import('../reactotron.config').then(() =>
    console.log('Reactotron Configured'),
  );
}

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {TamaguiProvider} from 'tamagui';

import type {StackProps} from '@app/navigation/Params';
import config from './tamagui.config';
//import {appBridge} from './lib/native';
import HomeScreen from '@app/screens/HomeScreen';
import DetailsScreen from '@app/screens/DetailsScreen';

const Stack = createStackNavigator<StackProps>();

function App(): JSX.Element {
  return (
    <TamaguiProvider config={config} disableInjectCSS defaultTheme="dark">
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
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
    </TamaguiProvider>
  );
}

export default App;
