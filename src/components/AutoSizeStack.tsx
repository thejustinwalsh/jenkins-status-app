import React, {useCallback, useLayoutEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {YStack} from 'tamagui';
import {useDebouncedCallback} from 'use-debounce';

import appBridge from '@app/lib/native';

import type {LayoutChangeEvent, LayoutRectangle} from 'react-native';

export type AutoSizeStackProps = {
  children?: React.ReactNode;
  snap?: boolean;
} & React.ComponentProps<typeof YStack>;

const AutoSizeStack = React.forwardRef<typeof YStack, AutoSizeStackProps>(
  function AutoSizeStack(
    {children, snap = true, minHeight, minWidth, onLayout, ...props},
    forwardedRef,
  ) {
    const isFocused = useIsFocused();
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    // Calculate the largest layout event and update state for the useLayoutEffect
    const handleLayout = useCallback(
      ({width: w, height: h}: LayoutRectangle) => {
        if (snap) {
          setWidth(Math.max(width, Math.max(w, (minWidth || 0) as number)));
          setHeight(Math.max(height, Math.max(h, (minHeight || 0) as number)));
        } else {
          setWidth(Math.max(w, (minWidth || 0) as number));
          setHeight(Math.max(h, (minHeight || 0) as number));
        }
      },
      [height, minHeight, minWidth, snap, width],
    );

    // Debounce spammed layout events
    const handleDebouncedLayout = useDebouncedCallback(handleLayout, 30, {
      trailing: true,
    });

    // Destructure native events and call the debounced layout handler
    const proxyOnLayout = useCallback(
      (event: LayoutChangeEvent) => {
        handleDebouncedLayout(event.nativeEvent.layout);
        onLayout?.(event);
      },
      [handleDebouncedLayout, onLayout],
    );

    useLayoutEffect(() => {
      if (isFocused && width && height) {
        appBridge.resize(width, height);
      }
    }, [width, height, isFocused]);

    return (
      <YStack
        ref={forwardedRef}
        minWidth={minWidth}
        minHeight={minHeight}
        {...props}
        onLayout={proxyOnLayout}>
        {children}
      </YStack>
    );
  },
);

export default AutoSizeStack;
