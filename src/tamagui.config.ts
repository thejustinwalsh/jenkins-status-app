import {createAnimations} from '@tamagui/animations-moti';
import {config} from '@tamagui/config';
import {createTamagui} from 'tamagui'; // or '@tamagui/core'

const appConfig = createTamagui({
  ...config,
  animations: createAnimations({
    ...config.animations.animations,
  }),
});

export type AppConfig = typeof appConfig;

declare module 'tamagui' {
  // or '@tamagui/core'
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig;
