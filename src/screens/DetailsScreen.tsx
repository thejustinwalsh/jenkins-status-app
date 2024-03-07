import {useCallback, useMemo} from 'react';
import {useIntl} from 'react-intl';
import {Linking, Pressable} from 'react-native';
import {DurationFormat} from '@formatjs/intl-durationformat/index';
import {
  Button,
  Paragraph,
  Separator,
  SizableText,
  YGroup,
  YStack,
} from 'tamagui';

import AutoSizeStack from '@app/components/AutoSizeStack';
import ProjectListItem from '@app/components/ProjectListItem';
import {useProject} from '@app/hooks/useProjects';
import {useBuildState, useProjectState} from '@app/hooks/useProjectState';

import type {StackProps} from '@app/navigation/params';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export default function DetailsScreen({
  route,
  navigation,
}: NativeStackScreenProps<StackProps, 'Details'>) {
  const {id} = route.params;
  const intl = useIntl();
  const [project] = useProject(id);
  const {project: state} = useProjectState(id);
  const {build} = useBuildState(id, state?.lastBuild.number);

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

  const details = useMemo(
    () => ({
      fullDisplayName: state?.fullDisplayName,
      description: state?.description,
      buildNumber: build?.number,
    }),
    [state, build],
  );

  const handleLinkPress = useCallback(
    () => Linking.openURL(project.url),
    [project],
  );

  return (
    <AutoSizeStack minWidth={400} minHeight={200} backgroundColor="$background">
      <YStack padding="$0">
        <ProjectListItem key={id} id={id} onPress={navigateToSettings} />
        <YGroup padding="$4" paddingTop="$0" gap="$0">
          <YGroup.Item>
            <Pressable onPress={handleLinkPress}>
              <SizableText color="$blue9" size="$4">
                {details.fullDisplayName}
              </SizableText>
            </Pressable>
            <SizableText fontStyle="italic" size="$3">
              {details.description}
            </SizableText>
            <Separator marginVertical={10} />
            <YStack gap="$0">
              <Paragraph>Build Number: {details.buildNumber}</Paragraph>
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
