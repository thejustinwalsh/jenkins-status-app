import {useCallback, useEffect, useMemo, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {YGroup} from 'tamagui';

import AutoSizeStack from '@app/components/AutoSizeStack';
import CommandPalette from '@app/components/CommandPalette';
import ProjectListItem from '@app/components/ProjectListItem';
import {useKeyEvents} from '@app/hooks/useKeyEvents';
import {useProjects} from '@app/hooks/useProjects';
import appBridge from '@app/lib/native';

import type {SearchSet} from '@app/components/SearchableInput';
import type {KeyEvent} from '@app/hooks/useKeyEvents';
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
  const [projects, _, addProject] = useProjects();
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const [commandPaletteMode, setCommandPaletteMode] = useState<
    'search' | 'command'
  >('search');
  const [snapLayout, setSnapLayout] = useState<boolean>(true);

  const navigateToDetails = useCallback(
    (id: string) => () => navigation.navigate('Details', {id}),
    [navigation],
  );

  const handleKeyEvents = useCallback((event: KeyEvent) => {
    // Enter - TODO: macOS -> JS keyCode
    if (event.keyCode === 36) {
      setCommandPaletteMode('command');
      setShowCommandPalette(true);
      setSnapLayout(false);
    }
    // Esc - TODO: macOS -> JS keyCode
    // TODO: the key system is going to capture the key, and make users type it twice when summoning the palette
    // TODO: we will need to capture the key in native, and inject it into the command palette for a smooth experience
    else if (event.keyCode !== 53) {
      setCommandPaletteMode('search');
      setShowCommandPalette(true);
      setSnapLayout(false);
    }
  }, []);

  const toggleKeyEvents = useKeyEvents(handleKeyEvents, false);
  useFocusEffect(
    useCallback(() => {
      toggleKeyEvents(true);
      return () => {
        toggleKeyEvents(false);
        setShowCommandPalette(false);
      };
    }, [toggleKeyEvents]),
  );

  useEffect(
    () => toggleKeyEvents(!showCommandPalette),
    [toggleKeyEvents, showCommandPalette],
  );

  const searchTerms = useMemo(
    () =>
      projects.map(project => ({
        key: project.id,
        value: project.key,
      })),
    [projects],
  );

  const [filter, setFilter] = useState<SearchSet[]>([]);

  const filteredProjects = useMemo(
    () =>
      filter.length > 0
        ? projects.filter(p => filter.find(f => f.key === p.id))
        : projects,
    [projects, filter],
  );

  const handleSearchResults = useCallback(
    (results: SearchSet[]) => setFilter([...results]),
    [],
  );

  // TODO: Implement command navigation and list refresh commands
  const handleCommandSelected = useCallback(
    (command: React.Key) => {
      switch (command) {
        case 'add':
          // TODO: Quick hack for adding new projects, nav to settings screen with this data?
          addProject('New Project');
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
    },
    [addProject],
  );

  const handleCommandPaletteClosed = useCallback(() => {
    setShowCommandPalette(false);
    toggleKeyEvents(true);
  }, [toggleKeyEvents]);

  return (
    <AutoSizeStack
      snap={snapLayout}
      minWidth={400}
      minHeight={50}
      backgroundColor="$background">
      <YGroup>
        <YGroup.Item>
          <CommandPalette
            isVisible={showCommandPalette}
            terms={searchTerms}
            commands={commands}
            mode={commandPaletteMode}
            onSearchResults={handleSearchResults}
            onCommandSelected={handleCommandSelected}
            onClosed={handleCommandPaletteClosed}
          />
        </YGroup.Item>
        <YGroup.Item>
          {filteredProjects.map(project => (
            <ProjectListItem
              key={project.id}
              id={project.id}
              onPress={navigateToDetails(project.id)}
            />
          ))}
        </YGroup.Item>
      </YGroup>
    </AutoSizeStack>
  );
}
