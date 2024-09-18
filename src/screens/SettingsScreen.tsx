import {useCallback, useEffect, useReducer} from 'react';
import {Bell, Check, KeySquare, Link, Tag, User} from '@tamagui/lucide-icons';
import {Checkbox, Label, XStack, YGroup, YStack} from 'tamagui';

import AutoSizeStack from '@app/components/AutoSizeStack';
import FocusGroup from '@app/components/FocusGroup';
import IconInput from '@app/components/IconInput';
import ProjectListItem from '@app/components/ProjectListItem';
import {useProject} from '@app/hooks/useProjects';

import type {ProjectSettings} from '@app/hooks/useProjects';
import type {StackProps} from '@app/navigation/params';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type SettingsAction =
  | {type: 'username'; value: string}
  | {type: 'password'; value: string}
  | {type: 'url'; value: string}
  | {type: 'name'; value: string}
  | {type: 'success'; value: boolean}
  | {type: 'failure'; value: boolean};

function settingsReducer(state: ProjectSettings, action: SettingsAction) {
  switch (action.type) {
    case 'username':
      return {
        ...state,
        auth: {...state.auth, username: action.value},
      };
    case 'password':
      return {
        ...state,
        auth: {...state.auth, password: action.value},
      };
    case 'url':
      return {...state, url: action.value};
    case 'name':
      return {...state, name: action.value};
    case 'success':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          onSuccess: action.value,
        },
      };
    case 'failure':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          onFailure: action.value,
        },
      };
  }
  return state;
}

export default function SettingsScreen({
  route,
  navigation,
}: NativeStackScreenProps<StackProps, 'Settings'>) {
  const [initial, setProject] = useProject(route.params.id);
  const [project, dispatch] = useReducer(settingsReducer, initial);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only update when project changes
  useEffect(() => setProject(project), [project]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <AutoSizeStack backgroundColor="$background" minWidth={400} minHeight={200}>
      <YStack padding="$0">
        <ProjectListItem key={project.id} id={project.id} onPress={goBack} />
        <FocusGroup id="settings" initialFocus="user">
          {/*// TODO: Make Checkbox work with FocusGroup */}
          <YGroup padding="$4" paddingTop="$0" gap="$4">
            <YGroup.Item>
              <XStack gap="$2">
                <IconInput
                  id="user"
                  // @ts-expect-error -- TODO: fix this
                  focusIndex={0}
                  size="$2"
                  iconColor="$color11"
                  backgroundColor="$color3"
                  borderWidth="$0"
                  icon={User}
                  value={project.auth.username}
                  onChangeText={value => dispatch({type: 'username', value})}
                />
                <IconInput
                  id="password"
                  // @ts-expect-error -- TODO: fix this
                  focusIndex={1}
                  size="$2"
                  iconColor="$color11"
                  backgroundColor="$color3"
                  borderWidth="$0"
                  icon={KeySquare}
                  value={project.auth.password}
                  onChangeText={value => dispatch({type: 'password', value})}
                />
              </XStack>
            </YGroup.Item>
            <YGroup.Item>
              <XStack gap="$2">
                <IconInput
                  id="url"
                  // @ts-expect-error -- TODO: fix this
                  focusIndex={2}
                  size="$2"
                  iconColor="$color11"
                  backgroundColor="$color3"
                  borderWidth="$0"
                  icon={Link}
                  value={project.url}
                  onChangeText={value => dispatch({type: 'url', value})}
                />
              </XStack>
            </YGroup.Item>
            <YGroup.Item>
              <XStack gap="$2">
                <IconInput
                  id="name"
                  // @ts-expect-error -- TODO: fix this
                  focusIndex={3}
                  size="$2"
                  iconColor="$color11"
                  backgroundColor="$color3"
                  borderWidth="$0"
                  icon={Tag}
                  value={project.name}
                  onChangeText={value => dispatch({type: 'name', value})}
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
                      borderColor="$color6"
                      backgroundColor="$background"
                      defaultChecked={project.notifications.onSuccess}
                      checked={project.notifications.onSuccess}
                      onCheckedChange={value =>
                        dispatch({
                          type: 'success',
                          value: value.valueOf() === true ? true : false,
                        })
                      }>
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
                      borderColor="$color6"
                      backgroundColor="$background"
                      defaultChecked={project.notifications.onFailure}
                      checked={project.notifications.onFailure}
                      onCheckedChange={value =>
                        dispatch({
                          type: 'failure',
                          value: value.valueOf() === true ? true : false,
                        })
                      }>
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
        </FocusGroup>
      </YStack>
    </AutoSizeStack>
  );
}
