import React from 'react';
import {Input, Label, XStack, getFontSize, useGetThemedIcon} from 'tamagui';

import type {IconProps} from '@tamagui/helpers-icon';
import type {ColorValue} from 'react-native';

export type IconInputProps = {
  icon?: React.NamedExoticComponent<IconProps>;
  iconColor?: ColorValue;
} & React.ComponentProps<typeof Input>;

const IconInput = React.forwardRef<Input, IconInputProps>(function IconInput(
  {id, icon, iconColor, size, color, value, ...props},
  forwardRef,
) {
  const iconSize = getFontSize(size as any) * 2; /*scaleIcon*/
  const fontSize =
    typeof size === 'string'
      ? size.startsWith('$')
        ? `$${parseInt(size.replace('$', ''), 10) * 2}`
        : iconSize
      : iconSize;
  const getThemedIcon = useGetThemedIcon({
    size: iconSize,
    color: iconColor as any,
  });
  const ThemedIcon = getThemedIcon(icon);
  console.log(size, fontSize, iconSize);

  return (
    <XStack
      flex={1}
      gap="$2"
      alignItems="center"
      alignContent="center"
      justifyContent="center">
      <Label disabled htmlFor={id} marginTop="$1.5" alignItems="center">
        {ThemedIcon}
      </Label>
      <Input
        ref={forwardRef}
        id={id}
        flex={1}
        size={size}
        color={color}
        fontSize={fontSize as any}
        value={value}
        {...props}
      />
    </XStack>
  );
});

export default IconInput;
