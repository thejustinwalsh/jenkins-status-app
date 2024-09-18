import React from 'react';
import {Input, XStack, getFontSize} from 'tamagui';

export type BasicInputProps = React.ComponentProps<typeof Input>;

const IconInput = React.forwardRef<Input, BasicInputProps>(function IconInput(
  {id, size, color, value, ...props},
  forwardRef,
) {
  const defaultSize = getFontSize(size as any) * 2; /*scaleIcon*/
  const fontSize =
    typeof size === 'string'
      ? size.startsWith('$')
        ? `$${parseInt(size.replace('$', ''), 10) * 2}`
        : defaultSize
      : defaultSize;

  return (
    <XStack
      flex={1}
      alignItems="center"
      alignContent="center"
      justifyContent="center">
      <Input
        // @ts-expect-error - types are not exposed on macOS or windows for enableFocusRing
        enableFocusRing={false}
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
