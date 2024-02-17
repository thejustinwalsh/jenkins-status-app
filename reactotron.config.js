import Reactotron, {
  networking,
  trackGlobalErrors,
} from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';
import {QueryClientManager, reactotronReactQuery} from 'reactotron-react-query';

import queryClient from '@app/lib/query';
import storage from '@app/lib/storage';

const queryClientManager = new QueryClientManager({
  queryClient,
});

Reactotron.configure({
  name: 'Jenkins Status App',
})
  .use(trackGlobalErrors())
  .use(mmkvPlugin({storage}))
  .use(reactotronReactQuery(queryClientManager))
  .configure({
    onDisconnect: () => {
      queryClientManager.unsubscribe();
    },
  })
  .use(networking())
  .useReactNative({
    asyncStorage: false,
    networking: true,
    editor: true,
    overlay: false,
  })
  .connect();
