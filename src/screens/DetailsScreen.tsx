import {useCallback} from 'react';
import {Button, Heading, YGroup, YStack} from 'tamagui';

import AutoSizeStack from '@app/components/AutoSizeStack';
import ProjectListItem from '@app/components/ProjectListItem';
import {useProjectInfoById} from '@app/hooks/useProjectStatus';

import type {StackProps} from '@app/navigation/params';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export default function DetailsScreen({
  route,
  navigation,
}: NativeStackScreenProps<StackProps, 'Details'>) {
  const {id} = route.params;
  const [info, project, build] = useProjectInfoById(id);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const navigateToSettings = useCallback(() => {
    navigation.navigate('Settings', {id});
  }, [navigation, id]);

  // TODO: ProjectListItem needs to be replaced with a component that has back and settings buttons
  // Likely reuse some of the same design and style so that it transitions as a header
  return (
    <AutoSizeStack minWidth={400} minHeight={200} backgroundColor="$background">
      <YStack padding="$0">
        <ProjectListItem
          key={id}
          title={info.name}
          value=" "
          status={info.status}
          onPress={navigateToSettings}
        />
        <YGroup padding="$4" paddingTop="$0" gap="$4">
          <YGroup.Item>
            <Heading>
              {project.healthReport.length > 0
                ? project.healthReport[0].description
                : ''}
            </Heading>
          </YGroup.Item>
          <YGroup.Item>
            <Heading>
              {info.lastRun} - {build.result}
            </Heading>
          </YGroup.Item>
          <YGroup.Item>
            <Button onPress={goBack}>Go Back</Button>
          </YGroup.Item>
        </YGroup>
      </YStack>
    </AutoSizeStack>
  );
}
