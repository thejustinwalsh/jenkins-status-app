import Reactotron, {trackGlobalErrors} from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';
import storage from '@app/lib/storage';

Reactotron.configure({
  name: 'Jenkins Status App',
})
  .use(trackGlobalErrors())
  .use(mmkvPlugin({storage}))
  .useReactNative({
    asyncStorage: false,
    networking: true,
    editor: true,
    overlay: false,
  })
  .connect();
