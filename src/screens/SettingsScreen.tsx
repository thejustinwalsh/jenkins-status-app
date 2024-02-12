import {useCallback} from 'react';
import {Bell, Check, KeySquare, Link, Tag, User} from '@tamagui/lucide-icons';
import {Checkbox, Label, XStack, YGroup, YStack} from 'tamagui';

import IconInput from '@app/components/IconInput';
import ProjectListItem from '@app/components/ProjectListItem';
import {useProjectSetting} from '@app/hooks/useProjectSettings';
import {appBridge} from '@app/lib/native';

import type {StackProps} from '@app/navigation/params';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export default function SettingsScreen({
  route,
  navigation,
}: NativeStackScreenProps<StackProps, 'Settings'>) {
  const project = useProjectSetting(route.params.id)!;
  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <YStack
      backgroundColor="$background"
      minWidth={400}
      minHeight={50}
      onLayout={event => {
        const {width, height} = event.nativeEvent.layout;
        appBridge.resize(width, height);
      }}>
      <YStack padding="$0">
        <ProjectListItem
          key={project.id}
          title={project.name}
          value=" "
          status={'succeeded'}
          onPress={goBack}
        />
        <YGroup padding="$4" paddingTop="$0" gap="$4">
          <YGroup.Item>
            <XStack gap="$2">
              <IconInput
                id="user"
                size="$2"
                iconColor="$color11"
                backgroundColor="$color3"
                borderWidth="$0"
                icon={User}
                value={project.auth.username}
              />
              <IconInput
                id="password"
                size="$2"
                iconColor="$color11"
                backgroundColor="$color3"
                borderWidth="$0"
                icon={KeySquare}
                value={project.auth.password}
              />
            </XStack>
          </YGroup.Item>
          <YGroup.Item>
            <XStack gap="$2">
              <IconInput
                id="url"
                size="$2"
                iconColor="$color11"
                backgroundColor="$color3"
                borderWidth="$0"
                icon={Link}
                value={project.url}
              />
            </XStack>
          </YGroup.Item>
          <YGroup.Item>
            <XStack gap="$2">
              <IconInput
                id="name"
                size="$2"
                iconColor="$color11"
                backgroundColor="$color3"
                borderWidth="$0"
                icon={Tag}
                value={project.name}
              />
            </XStack>
          </YGroup.Item>
          <YGroup.Item>
            <XStack gap="$2" alignItems="center">
              <Bell color="$color11" size="$1.75" />
              <XStack flex={1} gap="$4" alignItems="center">
                <XStack gap="$2" alignItems="center">
                  <Checkbox
                    id="success"
                    defaultChecked={project.notifications.onSuccess}
                    checked={project.notifications.onSuccess}>
                    <Checkbox.Indicator>
                      <Check color={'$green9'} />
                    </Checkbox.Indicator>
                  </Checkbox>
                  <Label
                    disabled
                    htmlFor="success"
                    marginVertical="$0"
                    paddingVertical="$0"
                    size="$2">
                    Success
                  </Label>
                </XStack>
                <XStack gap="$2" alignItems="center">
                  <Checkbox
                    id="failure"
                    defaultChecked={project.notifications.onFailure}
                    checked={project.notifications.onFailure}>
                    <Checkbox.Indicator>
                      <Check color={'$red9'} />
                    </Checkbox.Indicator>
                  </Checkbox>
                  <Label
                    disabled
                    htmlFor="failure"
                    marginVertical="$0"
                    paddingVertical="$0"
                    size="$2">
                    Failure
                  </Label>
                </XStack>
              </XStack>
            </XStack>
          </YGroup.Item>
        </YGroup>
      </YStack>
    </YStack>
  );
}
