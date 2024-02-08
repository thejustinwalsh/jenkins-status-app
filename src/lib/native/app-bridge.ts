import {NativeModules} from 'react-native';

interface AppBridge {
  launchAtLogin: (isEnabled: boolean) => void;
  isLaunchAtLoginEnabled: () => boolean;
  setBackgroundColor: (hex: string) => void;
  resize: (width: number, height: number) => void;
  closeApp: () => void;
}

function exportAppBridge(module: any): AppBridge {
  return {
    launchAtLogin: module.launchAtLogin,
    isLaunchAtLoginEnabled: module.isLaunchAtLoginEnabled,
    setBackgroundColor: module.setBackgroundColor,
    resize: module.resize,
    closeApp: module.closeApp,
  };
}

export const appBridge = exportAppBridge(NativeModules.AppBridge);
