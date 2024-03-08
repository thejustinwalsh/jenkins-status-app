import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('lib/native', () => ({
  launchAtLogin: jest.fn(),
  isLaunchAtLoginEnabled: jest.fn(),
  setBackgroundColor: jest.fn(),
  resize: jest.fn(),
  closeApp: jest.fn(),
  consumeKeys: jest.fn(),
  sendNotification: jest.fn(),
}));
