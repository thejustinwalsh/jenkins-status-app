import {useCallback} from 'react';
import {Button, Heading, YGroup} from 'tamagui';

import ProjectListItem from '@app/components/ProjectListItem';
import {useProjectSetting} from '@app/hooks/useProjectSettings';
import {appBridge} from '@app/lib/native';

import type {StackProps} from '@app/navigation/params';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export default function DetailsScreen({
  route,
  navigation,
}: NativeStackScreenProps<StackProps, 'Details'>) {
  const project = useProjectSetting(route.params.id)!;
  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const navigateToSettings = useCallback(() => {
    navigation.navigate('Settings', {id: project.id});
  }, [navigation, project.id]);

  // TODO: ProjectListItem needs to be replaced with a component that has back and settings buttons
  // Likely reuse some of the same design and style so that it transitions as a header
  return (
    <YGroup
      backgroundColor="$background"
      minWidth={400}
      minHeight={50}
      onLayout={event => {
        const {width, height} = event.nativeEvent.layout;
        appBridge.resize(width, height);
      }}>
      <YGroup.Item>
        <ProjectListItem
          key={project.id}
          title={project.name}
          value=" "
          status={'succeeded'}
          onPress={navigateToSettings}
        />
      </YGroup.Item>
      <YGroup.Item>
        <Heading>Details</Heading>
      </YGroup.Item>
      <YGroup.Item>
        <Button onPress={goBack}>Go Back</Button>
      </YGroup.Item>
    </YGroup>
  );
}
