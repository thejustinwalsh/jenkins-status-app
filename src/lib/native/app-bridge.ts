import {NativeModules} from 'react-native';

interface AppBridge {
  launchAtLogin: (isEnabled: boolean) => void;
  isLaunchAtLoginEnabled: () => boolean;
  closeApp: () => void;
}

function exportAppBridge(module: any): AppBridge {
  return {
    launchAtLogin: module.launchAtLogin,
    isLaunchAtLoginEnabled: module.isLaunchAtLoginEnabled,
    closeApp: module.closeApp,
  };
}

export const appBridge = exportAppBridge(NativeModules.AppBridge);
