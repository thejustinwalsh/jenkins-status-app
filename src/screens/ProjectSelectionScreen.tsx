import {useCallback, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {encode as btoa} from 'base-64';
import useSWR from 'swr';
import {Button, Heading, XStack, YStack} from 'tamagui';

import AutoSizeStack from '@app/components/AutoSizeStack';
import SelectableListItem from '@app/components/SelectableListItem';

import type {ProjectSettings} from '@app/hooks/useProjects';
import type {StackProps} from '@app/navigation/params';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type InstanceProjectList = {
  jobs: {
    name: string;
    url: string;
  }[];
};

type InstanceProjectListState = {
  name: string;
  url: string;
  selected: boolean;
};

function fetchProjects(
  url: string,
  {username, password}: ProjectSettings['auth'],
) {
  const api = new URL('/api/json', url).toString();
  return fetch(api, {
    headers: {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    },
  }).then(res => res.json() as Promise<InstanceProjectList>);
}

function transformData(data?: InstanceProjectList): InstanceProjectListState[] {
  return (data?.jobs ?? []).map(job => ({
    name: job.name,
    url: job.url,
    selected: false,
  }));
}

export default function ProjectSelectionScreen({
  route,
  navigation,
}: NativeStackScreenProps<StackProps, 'ProjectSelection'>) {
  const {url, user, password} = route.params;
  const {data} = useSWR(
    url,
    u => fetchProjects(u, {username: user, password}),
    {},
  );

  const [listData, setListData] = useState<InstanceProjectListState[]>(
    transformData(data),
  );
  useEffect(() => {
    setListData(transformData(data));
  }, [data]);

  const handleSelectionChange = useCallback(
    (name: string) => () => {
      setListData(state =>
        state.map(item => {
          if (item.name === name) {
            console.log(item.name, item.selected, !item.selected);
          }
          return item.name === name
            ? {...item, selected: !item.selected}
            : {...item};
        }),
      );
    },
    [],
  );

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <AutoSizeStack
      backgroundColor="$background"
      snap
      minWidth={400}
      minHeight={260}>
      <YStack padding="$2" paddingTop="$4">
        <XStack justifyContent="center">
          <Heading size={'$4'} paddingHorizontal={'$2'}>
            Project Selection
          </Heading>
        </XStack>
      </YStack>
      <YStack padding="$2" paddingTop="$4">
        <FlatList
          data={listData}
          renderItem={({item}) => (
            <SelectableListItem
              title={item.name}
              selected={item.selected}
              onSelectChange={handleSelectionChange(item.name)}
            />
          )}
          keyExtractor={item => item.name}
        />
      </YStack>
      <YStack padding="$2">
        <XStack justifyContent="flex-end">
          <Button onPress={goBack}>Back</Button>
        </XStack>
      </YStack>
    </AutoSizeStack>
  );
}
