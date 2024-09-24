import {useCallback} from 'react';
import {KeySquare, User} from '@tamagui/lucide-icons';
import {encode as btoa} from 'base-64';
import {Button, Heading, XStack, YGroup, YStack} from 'tamagui';
import {SizableText} from 'tamagui';
import {useDebouncedCallback} from 'use-debounce';

import AutoSizeStack from '@app/components/AutoSizeStack';
import FocusGroup from '@app/components/FocusGroup';
import BasicInput from '@app/components/IconInput';
import IconInput from '@app/components/IconInput';
import {useReducerPipeline} from '@app/hooks/useReducerPipeline';
import appBridge from '@app/modules/NativeAppBridge';

import type {StackProps} from '@app/navigation/params';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type AsyncStateValue<T> = {
  value: T;
  loading?: boolean;
  loaded?: boolean;
  error?: string;
};

type WelcomeState = {
  url: AsyncStateValue<string>;
  user: AsyncStateValue<string>;
  password: AsyncStateValue<string>;
};

type WelcomeAction =
  | {type: 'url'; value: AsyncStateValue<string>}
  | {type: 'user'; value: AsyncStateValue<string>}
  | {type: 'password'; value: AsyncStateValue<string>};

const initialState: WelcomeState = {
  url: {value: '', loading: false, loaded: false, error: ''},
  user: {value: '', loading: false, loaded: false, error: ''},
  password: {value: '', loading: false, loaded: false, error: ''},
};

async function welcomeResolver(state: WelcomeState, action: WelcomeAction) {
  switch (action.type) {
    case 'url':
      let url = action.value.value;
      return fetch(url, {method: 'HEAD'})
        .then(r => {
          const error = r.status >= 500 ? 'Invalid URL.' : '';
          return {...action, value: {...action.value, loaded: !error, error}};
        })
        .catch(r => {
          const error = r.toString() as string;
          return {...action, value: {...action.value, error}};
        });

    case 'user':
    case 'password':
      return fetch(state.url.value, {
        method: 'HEAD',
        headers: {
          Authorization: `Basic ${btoa(
            `${
              action.type === 'user' ? action.value.value : state.user.value
            }:${
              action.type === 'password'
                ? action.value.value
                : state.password.value
            }`,
          )}`,
        },
      })
        .then(r => {
          console.log(r.status, r.statusText);
          const error = r.status >= 300 ? 'Invalid credentials.' : '';
          return {...action, value: {...action.value, loaded: !error, error}};
        })
        .catch(r => {
          const error = r.toString();
          return {...action, value: {...action.value, error}};
        });
  }

  return action;
}

function welcomeReducer(state: WelcomeState, action: WelcomeAction) {
  switch (action.type) {
    case 'url':
      return {
        ...state,
        url: {...action.value},
      };
    case 'user':
    case 'password':
      return {
        ...state,
        user:
          action.type === 'user'
            ? {...action.value}
            : {
                ...state.user,
                loaded: action.value.loaded,
                error: action.value.error,
              },
        password:
          action.type === 'password'
            ? {...action.value}
            : {
                ...state.password,
                loaded: action.value.loaded,
                error: action.value.error,
              },
      };
  }
  return state;
}

export default function WelcomeScreen({
  navigation,
}: NativeStackScreenProps<StackProps, 'Welcome'>) {
  const [state, dispatch] = useReducerPipeline(
    welcomeReducer,
    [welcomeResolver],
    initialState,
  );

  const handleUrlChanged = useDebouncedCallback(
    useCallback(
      (text: string) => {
        dispatch({type: 'url', value: {value: text}});
      },
      [dispatch],
    ),
    60,
    {trailing: true},
  );

  const handleUserChanged = useDebouncedCallback(
    useCallback(
      (text: string) => {
        dispatch({type: 'user', value: {value: text}});
      },
      [dispatch],
    ),
    60,
    {trailing: true},
  );

  const handlePasswordChanged = useDebouncedCallback(
    useCallback(
      (text: string) => {
        dispatch({type: 'password', value: {value: text}});
      },
      [dispatch],
    ),
    60,
    {trailing: true},
  );

  const formIsValid =
    state.url.value &&
    state.user.value &&
    state.password.value &&
    !state.url.error &&
    !state.user.error &&
    !state.password.error;

  const handleNext = useCallback(() => {
    navigation.navigate('ProjectSelection', {
      url: state.url.value,
      user: state.user.value,
      password: state.password.value,
    });
  }, [navigation, state.password.value, state.url.value, state.user.value]);

  const handleQuit = useCallback(() => {
    appBridge?.closeApp();
  }, []);

  return (
    <AutoSizeStack backgroundColor="$background" minWidth={400} minHeight={260}>
      <YStack padding="$2" paddingTop="$4">
        <XStack justifyContent="center">
          <Heading size={'$4'} paddingHorizontal={'$2'}>
            Welcome
          </Heading>
        </XStack>
      </YStack>
      <YStack padding="$0">
        <FocusGroup id="settings" initialFocus="url">
          <YGroup gap="$2" marginTop="$3" marginHorizontal="$6">
            <YGroup.Item>
              <XStack gap="$2">
                <Heading size={'$1'} paddingHorizontal={'$2'}>
                  Jenkins URL
                </Heading>
              </XStack>
            </YGroup.Item>
            <YGroup.Item>
              <YStack>
                <XStack gap="$2">
                  <BasicInput
                    id="url"
                    flex={1}
                    // @ts-expect-error -- TODO: fix this
                    focusIndex={0}
                    size="$2"
                    iconColor="$color11"
                    backgroundColor="$color3"
                    borderWidth="$0"
                    placeholder="https://jenkins-url.ci"
                    onChangeText={handleUrlChanged}
                  />
                </XStack>
                <XStack gap="$2" paddingHorizontal="$2" justifyContent="center">
                  <SizableText size="$1" color="$red10">
                    {state.url.error}
                  </SizableText>
                </XStack>
              </YStack>
            </YGroup.Item>
            <YGroup.Item>
              <Heading size="$1" paddingHorizontal="$2">
                API Key
              </Heading>
            </YGroup.Item>
            <YGroup.Item>
              <YStack>
                <XStack gap="$2">
                  <IconInput
                    id="user"
                    // @ts-expect-error -- TODO: fix this
                    focusIndex={1}
                    size="$2"
                    iconColor="$color11"
                    backgroundColor="$color3"
                    borderWidth="$0"
                    icon={User}
                    placeholder="buildbot"
                    onChangeText={handleUserChanged}
                  />
                  <IconInput
                    id="password"
                    // @ts-expect-error -- TODO: fix this
                    focusIndex={2}
                    size="$2"
                    iconColor="$color11"
                    backgroundColor="$color3"
                    borderWidth="$0"
                    numberOfLines={1}
                    flex={1}
                    secureTextEntry
                    icon={KeySquare}
                    placeholder="********"
                    onChangeText={handlePasswordChanged}
                  />
                </XStack>
                <XStack gap="$2" paddingHorizontal="$2" justifyContent="center">
                  <SizableText size="$1" color="$red10">
                    {state.user.error || state.password.error}
                  </SizableText>
                </XStack>
              </YStack>
            </YGroup.Item>
            <YGroup.Item>
              <YStack marginVertical="$4">
                <XStack gap="$2" justifyContent="space-between">
                  <Button size="$3" onPress={handleQuit}>
                    Quit
                  </Button>
                  <Button
                    size="$3"
                    backgroundColor="$green8"
                    disabled={!formIsValid}
                    onPress={handleNext}>
                    Next
                  </Button>
                </XStack>
              </YStack>
            </YGroup.Item>
          </YGroup>
        </FocusGroup>
      </YStack>
    </AutoSizeStack>
  );
}
