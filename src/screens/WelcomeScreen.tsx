import {Heading, YGroup, YStack} from 'tamagui';

// TODO: Add intro experience and configure first project
export default function WelcomeScreen() {
  return (
    <YStack fullscreen backgroundColor="$background">
      <YGroup gap="$3" marginTop="$3" marginHorizontal="$6">
        <YGroup.Item>
          <Heading>Welcome</Heading>
        </YGroup.Item>
      </YGroup>
    </YStack>
  );
}
