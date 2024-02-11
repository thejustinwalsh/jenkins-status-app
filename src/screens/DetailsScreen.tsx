import {useCallback} from 'react';
import {Button, YGroup} from 'tamagui';

import ProjectListItem from '@app/components/ProjectListItem';
import {useProjectSetting} from '@app/hooks/useProjectSettings';

import type {StackProps} from '@app/navigation/params';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export default function DetailsScreen({
  route,
  navigation,
}: NativeStackScreenProps<StackProps, 'Details'>) {
  const project = useProjectSetting(route.params.id)!;
  const navBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // TODO: ProjectListItem needs to be replaced with a component that has back and settings buttons
  // Likely reuse some of the same design and style so that it transitions as a header
  return (
    <YGroup backgroundColor="$background" minWidth={400} minHeight={50}>
      <YGroup.Item>
        <ProjectListItem
          key={project.id}
          title={project.name}
          value=" "
          status={'succeeded'}
        />
      </YGroup.Item>
      <YGroup.Item>
        <Button onPress={navBack}>Go Back</Button>
      </YGroup.Item>
    </YGroup>
  );
}
