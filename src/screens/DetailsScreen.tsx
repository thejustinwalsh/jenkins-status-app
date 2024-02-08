import {useCallback} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Heading, YGroup, YStack} from 'tamagui';

import type {StackProps} from '@app/navigation/Params';

export default function DetailsScreen({
  navigation,
}: NativeStackScreenProps<StackProps, 'Details'>) {
  const navBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <YStack fullscreen backgroundColor="$background">
      <YGroup gap="$3" marginTop="$3" marginHorizontal="$6">
        <YGroup.Item>
          <Heading>Details</Heading>
        </YGroup.Item>
        <YGroup.Item>
          <Button onPress={navBack}>Go Back</Button>
        </YGroup.Item>
      </YGroup>
    </YStack>
  );
}