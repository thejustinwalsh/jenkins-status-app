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
} from 'tamagui';

import {Medal, ScanSearch, BugPlay, BadgeInfo} from '@tamagui/lucide-icons';
import {config} from './tamagui.config';

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
        </YStack>
      </ScrollView>
    </TamaguiProvider>
  );
}

export default App;
