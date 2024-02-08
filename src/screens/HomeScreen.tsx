import {useCallback} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {YGroup} from 'tamagui';

import ProjectListItem from '@app/components/ProjectListItem';
import {useProjects} from '@app/hooks/projects';

import type {StackProps} from '@app/navigation/params';

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<StackProps, 'Home'>) {
  const [projects] = useProjects();
  const navigateToDetails = useCallback(() => {
    navigation.navigate('Details');
  }, [navigation]);

  const debugData = projects.map(project => ({
    ...project,
    variant: ['default', 'progress'][Math.floor(Math.random() * 2)],
    lastRun: ['1 day ago', '2 days ago', '3 days ago'][
      Math.floor(Math.random() * 3)
    ],
    status: ['succeeded', 'failed', 'inProgress', 'pending', 'canceled'][
      Math.floor(Math.random() * 5)
    ],
  }));

  return (
    <YGroup fullscreen backgroundColor="$background">
      <YGroup.Item>
        {debugData.map(project => (
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
