import {NativeEventEmitter, NativeModules} from 'react-native';

class AppBridge extends NativeEventEmitter {
  launchAtLogin: (isEnabled: boolean) => void;
  isLaunchAtLoginEnabled: () => boolean;
  setBackgroundColor: (hex: string) => void;
  resize: (width: number, height: number) => void;
  closeApp: () => void;
  consumeKeys: (state: boolean) => void;
  sendNotification: (title: string, message: string, url: string) => void;

  constructor(module: any) {
    super(module);
    this.launchAtLogin = module.launchAtLogin;
    this.isLaunchAtLoginEnabled = module.isLaunchAtLoginEnabled;
    this.setBackgroundColor = module.setBackgroundColor;
    this.resize = module.resize;
    this.closeApp = module.closeApp;
    this.consumeKeys = module.consumeKeys;
    this.sendNotification = module.sendNotification;
  }
}

export const appBridge = new AppBridge(NativeModules.AppBridge);
