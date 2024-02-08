import {useCallback, useMemo, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {YGroup, YStack} from 'tamagui';

import ProjectListItem from '@app/components/ProjectListItem';
import {useProjects} from '@app/hooks/projects';

import {SearchableInput, type SearchSet} from '@app/components/CommandPalette';
import {appBridge} from '@app/lib/native';

import type {StackProps} from '@app/navigation/params';

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<StackProps, 'Home'>) {
  const [projects] = useProjects();
  const navigateToDetails = useCallback(() => {
    navigation.navigate('Details');
  }, [navigation]);

  const debugData = useMemo(
    () =>
      projects.map(project => ({
        ...project,
        variant: ['default', 'progress'][Math.floor(Math.random() * 2)],
        lastRun: ['1 day ago', '2 days ago', '3 days ago'][
          Math.floor(Math.random() * 3)
        ],
        status: ['succeeded', 'failed', 'inProgress', 'pending', 'canceled'][
          Math.floor(Math.random() * 5)
        ],
      })),
    [projects],
  );

  const searchTerms = useMemo(
    () =>
      projects.map(project => ({
        key: project.id,
        value: project.name,
      })),
    [projects],
  );

  const [filter, setFilter] = useState<SearchSet[]>([]);

  const filteredProjects = useMemo(
    () =>
      filter.length > 0
        ? debugData.filter(p => filter.find(f => f.key === p.id))
        : debugData,
    [debugData, filter],
  );

  const handleSearchResults = useCallback(
    (results: SearchSet[]) => setFilter([...results]),
    [],
  );

  return (
    <YGroup
      backgroundColor="$background"
      minWidth={400}
      minHeight={50}
      onLayout={event => {
        const {width, height} = event.nativeEvent.layout;
        console.log('HomeScreen layout', width, height);
        appBridge.resize(width, height);
      }}>
      <YGroup.Item>
        <YStack padding="$5" paddingBottom="$0">
          <SearchableInput
            terms={searchTerms}
            onSearchResults={handleSearchResults}
          />
        </YStack>
      </YGroup.Item>
      <YGroup.Item>
        {filteredProjects.map(project => (
          <ProjectListItem
            key={project.id}
            variant={project.variant as any}
            title={project.name}
            value={
              project.variant === 'default'
                ? project.lastRun
                : Math.random() * 100
            }
            status={project.status as any}
            onPress={navigateToDetails}
          />
        ))}
      </YGroup.Item>
    </YGroup>
  );
}
