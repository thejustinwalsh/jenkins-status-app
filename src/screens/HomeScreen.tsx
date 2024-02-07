import {useCallback} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {YGroup} from 'tamagui';
import {
  XCircle,
  CheckCircle2,
  ChevronRight,
  CircleEllipsis,
} from '@tamagui/lucide-icons';

import type {StackProps} from '@app/navigation/Params';
import ListItem from '@app/components/JobListItem';

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<StackProps, 'Home'>) {
  const navigateToDetails = useCallback(() => {
    navigation.navigate('Details');
  }, [navigation]);

  return (
    <YGroup fullscreen backgroundColor="$background">
      <YGroup.Item>
        <ListItem
          hoverTheme
          pressTheme
          size="$5"
          scaleSpace={0.75}
          scaleIcon={1.75}
          color="$green9"
          icon={CheckCircle2}
          iconAfter={ChevronRight}
          title="Succeeded Job Name"
          subTitle="1 day ago"
          onPress={navigateToDetails}
        />
      </YGroup.Item>
      <YGroup.Item>
        <ListItem
          hoverTheme
          pressTheme
          size="$5"
          scaleSpace={0.75}
          scaleIcon={1.75}
          color="$red9"
          icon={XCircle}
          iconAfter={ChevronRight}
          title="Failed Job Name"
          subTitle="2 days ago"
        />
      </YGroup.Item>
      <YGroup.Item>
        <ListItem
          hoverTheme
          pressTheme
          size="$5"
          scaleSpace={0.75}
          scaleIcon={1.75}
          color="$color11"
          icon={CircleEllipsis}
          iconAfter={ChevronRight}
          title="In-Progress Job Name"
          subTitle="progress..."
          hasProgress
          value={25}
          max={100}
        />
      </YGroup.Item>
    </YGroup>
  );
}
