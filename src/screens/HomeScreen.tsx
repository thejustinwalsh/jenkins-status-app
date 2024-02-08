import {useCallback} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {YGroup} from 'tamagui';

import ProjectListItem from '@app/components/ProjectListItem';

import type {StackProps} from '@app/navigation/params';

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<StackProps, 'Home'>) {
  const navigateToDetails = useCallback(() => {
    navigation.navigate('Details');
  }, [navigation]);

  return (
    <YGroup fullscreen backgroundColor="$background">
      <YGroup.Item>
        <ProjectListItem
          title="Succeeded Job Name"
          value="1 day ago"
          status="succeeded"
          onPress={navigateToDetails}
        />
      </YGroup.Item>
      <YGroup.Item>
        <ProjectListItem
          title="Failed Job Name"
          value="2 days ago"
          status="failed"
        />
      </YGroup.Item>
      <YGroup.Item>
        <ProjectListItem
          variant="progress"
          title="In-Progress Job Name"
          value={50}
          status="inProgress"
        />
      </YGroup.Item>
    </YGroup>
  );
}
