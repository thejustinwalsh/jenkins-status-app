import {useCallback, useMemo} from 'react';
import {useIntl} from 'react-intl';
import {DurationFormat} from '@formatjs/intl-durationformat/index';
import {Button, Paragraph, Separator, YGroup, YStack} from 'tamagui';

import AutoSizeStack from '@app/components/AutoSizeStack';
import ProjectListItem from '@app/components/ProjectListItem';
import {useBuild, useProject} from '@app/hooks/useProjectStatus';

import type {StackProps} from '@app/navigation/params';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export default function DetailsScreen({
  route,
  navigation,
}: NativeStackScreenProps<StackProps, 'Details'>) {
  const {id} = route.params;
  const intl = useIntl();
  const {project} = useProject(id);
  const {build} = useBuild(id, project?.lastBuild.number);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const navigateToSettings = useCallback(() => {
    navigation.navigate('Settings', {id});
  }, [navigation, id]);

  const durationTime = useMemo(() => {
    return build
      ? new DurationFormat('en', {
          style: 'narrow',
          localeMatcher: 'lookup',
        }).format({
          hours: Math.floor(build.duration / 1000 / 60 / 60) % 24,
          minutes: Math.floor(build.duration / 1000 / 60) % 60,
          seconds: Math.floor(build.duration / 1000) % 60,
        })
      : 'Unknown';
  }, [build]);

  const dateTime = useMemo(() => {
    return build
      ? intl.formatDate(new Date(build.timestamp), {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })
      : 'Unknown';
  }, [intl, build]);

  return (
    <AutoSizeStack minWidth={400} minHeight={200} backgroundColor="$background">
      <YStack padding="$0">
        <ProjectListItem key={id} id={id} onPress={navigateToSettings} />
        <YGroup padding="$4" paddingTop="$0" gap="$0">
          <YGroup.Item>
            <Paragraph fontWeight="800">{project?.fullDisplayName}</Paragraph>
            <Paragraph fontStyle="italic">{project?.description}</Paragraph>
            <Separator marginVertical={10} />
            <YStack gap="$0">
              <Paragraph>Build Number: {build?.number}</Paragraph>
              <Paragraph>Build Duration: {durationTime}</Paragraph>
              <Paragraph>Build Time: {dateTime}</Paragraph>
            </YStack>
          </YGroup.Item>
          <YGroup.Item>
            <Button onPress={goBack}>Go Back</Button>
          </YGroup.Item>
        </YGroup>
      </YStack>
    </AutoSizeStack>
  );
}
