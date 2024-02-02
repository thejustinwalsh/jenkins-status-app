# Goal: To have a working react-native app framework that can be built for windows, macos, ios, and android
> Requirements: secure storage, offline database (sqlite)

## stack
- react-native
- react-native-windows
- react-native-macos
- react-native-keychain
- op-sqlite
- tamagui

## @op-engineering/op-sqlite
> sqlite database plugin

- To support macos the podspec needs to have it's minimum version bumped to >= 10.15
- TODO: Submit PR to enable for macos
- TODO: Submit PR to enable for windows

## react-native-keychain
> https://github.com/oblador/react-native-keychain

- TODO: Add support for windows