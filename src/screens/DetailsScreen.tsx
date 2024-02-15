import {useCallback} from 'react';
import {Button, Heading, XStack, YGroup, YStack} from 'tamagui';

import AutoSizeStack from '@app/components/AutoSizeStack';
import ProjectListItem from '@app/components/ProjectListItem';
import {useProjectSetting} from '@app/hooks/useProjectSettings';

import type {StackProps} from '@app/navigation/params';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export default function DetailsScreen({
  route,
  navigation,
}: NativeStackScreenProps<StackProps, 'Details'>) {
  const [project] = useProjectSetting(route.params.id)!;
  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const navigateToSettings = useCallback(() => {
    navigation.navigate('Settings', {id: project.id});
  }, [navigation, project.id]);

  // TODO: ProjectListItem needs to be replaced with a component that has back and settings buttons
  // Likely reuse some of the same design and style so that it transitions as a header
  return (
    <AutoSizeStack minWidth={400} minHeight={50} backgroundColor="$background">
      <YStack padding="$0">
        <ProjectListItem
          key={project.id}
          title={project.name}
          value=" "
          status={'succeeded'}
          onPress={navigateToSettings}
        />
        <YGroup padding="$4" paddingTop="$0" gap="$4">
          <YGroup.Item>
            <XStack justifyContent="center">
              <Heading size="$16">Details</Heading>
            </XStack>
          </YGroup.Item>
          <YGroup.Item>
            <Button onPress={goBack}>Go Back</Button>
          </YGroup.Item>
        </YGroup>
      </YStack>
    </AutoSizeStack>
  );
}
