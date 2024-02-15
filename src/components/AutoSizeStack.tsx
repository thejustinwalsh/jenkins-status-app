import React, {useCallback, useLayoutEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {YStack} from 'tamagui';

import {appBridge} from '@app/lib/native';

import type {LayoutChangeEvent} from 'react-native';

export type AutoSizeStackProps = {
  children?: React.ReactNode;
} & React.ComponentProps<typeof YStack>;

// TODO: React Navigation animations look a little jank, and the component get's multiple layout events causing jitter
// Maybe we need to store the layout rect of the previous screen and use it as the starting size for the next screen
const AutoSizeStack = React.forwardRef<typeof YStack, AutoSizeStackProps>(
  function AutoSizeStack(
    {children, minHeight, minWidth, onLayout, ...props},
    forwardedRef,
  ) {
    const isFocused = useIsFocused();

    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    const handleLayout = useCallback(
      (event: LayoutChangeEvent) => {
        const {width: w, height: h} = event.nativeEvent.layout;
        setWidth(Math.max(w, (minWidth || 0) as number));
        setHeight(Math.max(h, (minHeight || 0) as number));
        appBridge.resize(width, height);
        onLayout?.(event);
      },
      [height, minHeight, minWidth, onLayout, width],
    );

    useLayoutEffect(() => {
      if (isFocused && width && height) {
        appBridge.resize(width, height);
      }
    }, [width, height, isFocused]);

    return (
      <YStack ref={forwardedRef} {...props} onLayout={handleLayout}>
        {children}
      </YStack>
    );
  },
);

export default AutoSizeStack;
