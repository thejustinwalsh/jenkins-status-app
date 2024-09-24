import {TurboModuleRegistry} from 'react-native';

import type {TurboModule} from 'react-native';

export interface Spec extends TurboModule {
  launchAtLogin: (isEnabled: boolean) => void;
  isLaunchAtLoginEnabled: () => Promise<boolean>;
  setBackgroundColor: (hex: string) => void;
  resize: (width: number, height: number) => void;
  closeApp: () => void;
  consumeKeys: (state: boolean) => void;
  sendNotification: (title: string, message: string, url: string) => void;
}

export default TurboModuleRegistry.get<Spec>('NativeAppBridge');
