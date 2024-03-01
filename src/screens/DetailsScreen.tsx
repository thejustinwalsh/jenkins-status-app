import {useCallback, useMemo} from 'react';
import {DateTimeFormat} from '@formatjs/intl-datetimeformat/index.js';
import {DurationFormat} from '@formatjs/intl-durationformat/index.js';
import {Button, Paragraph, Separator, YGroup, YStack} from 'tamagui';

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
  const info = useProjectInfoById(id);
  if (!info) {
    throw new Error('Project not found');
  }

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const navigateToSettings = useCallback(() => {
    navigation.navigate('Settings', {id});
  }, [navigation, id]);

  const durationTime = useMemo(() => {
    return info?.build
      ? new DurationFormat('en', {style: 'narrow'}).format({
          hours: Math.floor(info.build.duration / 1000 / 60 / 60) % 24,
          minutes: Math.floor(info.build.duration / 1000 / 60) % 60,
          seconds: Math.floor(info.build.duration / 1000) % 60,
        })
      : 'Unknown';
  }, [info]);

  const dateTime = useMemo(() => {
    return info?.build
      ? new DateTimeFormat('en', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }).format(new Date(info.build.timestamp))
      : 'Unknown';
  }, [info]);

  // TODO: ProjectListItem needs to be replaced with a component that has back and settings buttons
  // Likely reuse some of the same design and style so that it transitions as a header
  return (
    <AutoSizeStack minWidth={400} minHeight={200} backgroundColor="$background">
      <YStack padding="$0">
        <ProjectListItem
          key={id}
          title={info.name}
          timestamp={info.build?.timestamp}
          duration={info.build?.duration}
          status={info.status}
          onPress={navigateToSettings}
        />
        <YGroup padding="$4" paddingTop="$0" gap="$0">
          <YGroup.Item>
            <Paragraph fontWeight="800">
              {info.details?.fullDisplayName}
            </Paragraph>
            <Paragraph fontStyle="italic">
              {info.details?.description}
            </Paragraph>
            <Separator marginVertical={10} />
            <YStack gap="$0">
              <Paragraph>Build Number: {info.build?.number}</Paragraph>
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
