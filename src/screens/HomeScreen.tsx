import {useCallback, useMemo, useState} from 'react';
import {PortalProvider, YGroup} from 'tamagui';

import CommandPalette from '@app/components/CommandPalette';
import ProjectListItem from '@app/components/ProjectListItem';
import {useProjectSettings} from '@app/hooks/useProjectSettings';
import {appBridge} from '@app/lib/native';

import type {SearchSet} from '@app/components/SearchableInput';
import type {StackProps} from '@app/navigation/params';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type Commands = 'add' | 'remove' | 'refresh' | 'settings' | 'help' | 'quit';

type CommandSet = SearchSet & {
  key: React.Key & Commands;
  macos?: string;
  windows?: string;
};

const commands: CommandSet[] = [
  {key: 'add', value: 'Add'},
  {key: 'refresh', value: 'Refresh'},
  {key: 'settings', value: 'Settings'},
  {key: 'help', value: 'Help'},
  {key: 'quit', value: 'Quit', windows: 'Exit'},
];

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<StackProps, 'Home'>) {
  const [projects] = useProjectSettings();
  const navigateToDetails = useCallback(
    (id: string) => () => navigation.navigate('Details', {id}),
    [navigation],
  );

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

  // TODO: Implement command navigation and list refresh commands
  const handleCommandSelected = useCallback((command: React.Key) => {
    switch (command) {
      case 'add':
        //navigation.navigate('Add');
        break;
      case 'refresh':
        //appBridge.refresh();
        break;
      case 'settings':
        //navigation.navigate('Settings');
        break;
      case 'help':
        //navigation.navigate('Help');
        break;
      case 'quit':
        appBridge.closeApp();
        break;
    }
  }, []);

  return (
    <PortalProvider>
      <YGroup
        backgroundColor="$background"
        minWidth={400}
        minHeight={50}
        onLayout={event => {
          const {width, height} = event.nativeEvent.layout;
          appBridge.resize(width, height);
        }}>
        <YGroup.Item>
          <CommandPalette
            isVisible={false}
            terms={searchTerms}
            commands={commands}
            onSearchResults={handleSearchResults}
            onCommandSelected={handleCommandSelected}
          />
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
              onPress={navigateToDetails(project.id)}
            />
          ))}
        </YGroup.Item>
      </YGroup>
    </PortalProvider>
  );
}
