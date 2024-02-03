/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  ListItem,
  ScrollView,
  Separator,
  TamaguiProvider,
  Text,
  XStack,
  YGroup,
  YStack,
  Switch,
  Button,
  Label,
} from 'tamagui';

import {
  Medal,
  ScanSearch,
  BugPlay,
  BadgeInfo,
  XCircle,
} from '@tamagui/lucide-icons';
import {config} from './tamagui.config';
import {appBridge} from './lib/native';

function App(): JSX.Element {
  return (
    <TamaguiProvider config={config}>
      <ScrollView fullscreen backgroundColor="$background">
        <YStack alignSelf="center" padding="$8">
          <YGroup
            alignSelf="center"
            bordered
            width="100%"
            size="$5"
            separator={<Separator />}>
            <YGroup.Item>
              <ListItem title="Step One" icon={Medal} hoverTheme pressTheme>
                <XStack>
                  <Text>Edit </Text>
                  <Text theme="alt2">App.tsx</Text>
                  <Text>
                    {' '}
                    to change this screen and then come back to see your edits.
                  </Text>
                </XStack>
              </ListItem>
            </YGroup.Item>

            <YGroup.Item>
              <ListItem
                title="See Your Changes"
                icon={ScanSearch}
                hoverTheme
                pressTheme>
                <ReloadInstructions />
              </ListItem>
            </YGroup.Item>

            <YGroup.Item>
              <ListItem title="Debug" icon={BugPlay} hoverTheme pressTheme>
                <DebugInstructions />
              </ListItem>
            </YGroup.Item>

            <YGroup.Item>
              <ListItem
                title="Learn More"
                icon={BadgeInfo}
                hoverTheme
                pressTheme>
                Read the docs to discover what to do next:
              </ListItem>
            </YGroup.Item>
          </YGroup>
          <YGroup
            alignSelf="center"
            bordered
            width="100%"
            size="$5"
            marginTop="$5"
            separator={<Separator />}>
            <YGroup.Item>
              <XStack space="$3" $xs={{flexDirection: 'column'}}>
                {/*
                <Label
                  paddingRight="$0"
                  minWidth={90}
                  justifyContent="flex-end"
                  size="$4"
                  htmlFor="launchAtLogin">
                  Launch At Login
                </Label>
                */}
                <Separator minHeight={20} vertical />

                <Switch id="launchAtLogin" size="$4">
                  <Switch.Thumb />
                </Switch>
              </XStack>
            </YGroup.Item>
            <YGroup.Item>
              <XStack space="$3" $xs={{flexDirection: 'column'}}>
                {/*
                <Label
                  paddingRight="$0"
                  minWidth={90}
                  justifyContent="flex-end"
                  size="$4"
                  htmlFor="launchAtLogin">
                  Close App
                </Label>
                <Separator minHeight={20} vertical />
                */}
                <Button
                  id="closeApp"
                  size="$4"
                  onPress={() => {
                    appBridge.closeApp();
                  }}>
                  <XCircle />
                </Button>
              </XStack>
            </YGroup.Item>
          </YGroup>
        </YStack>
      </ScrollView>
    </TamaguiProvider>
  );
}

export default App;
