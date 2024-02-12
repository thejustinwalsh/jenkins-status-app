import React, {useCallback, useImperativeHandle, useMemo, useRef} from 'react';
import {Searcher} from 'fast-fuzzy';
import {Input, XStack, YStack, getFontSize, useGetThemedIcon} from 'tamagui';

import type {IconProps} from '@tamagui/helpers-icon';
import type {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TextInput,
  TextInputEndEditingEventData,
} from 'react-native';

export type SearchSet = {
  key: React.Key;
  value: string;
};

export type SearchableInputProps = {
  icon?: React.NamedExoticComponent<IconProps>;
  terms: SearchSet[];
  onSearchResults?: (results: SearchSet[]) => void;
  onEndEditing?: (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>,
  ) => void;
  onBlur?: () => void;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
};

const SearchableInput = React.forwardRef<TextInput, SearchableInputProps>(
  function SearchableInput(
    {icon, terms, onSearchResults, onEndEditing, onBlur, onLayout},
    forwardedRef,
  ) {
    const ref = useRef<TextInput>(null);
    useImperativeHandle(forwardedRef, () => ref.current!, []);

    const searcher = useMemo(
      () => new Searcher(terms, {keySelector: k => k.value}),
      [terms],
    );
    const search = useCallback(
      (term: string) => {
        return searcher.search(term);
      },
      [searcher],
    );

    const handleSearch = useCallback(
      (searchTerm: string) => {
        const results = search(searchTerm);
        onSearchResults?.(results);
      },
      [search, onSearchResults],
    );

    const handleBlur = useCallback(() => {
      onSearchResults?.([]);
      onBlur?.();
    }, [onBlur, onSearchResults]);

    const size = /*props.size ||*/ '$4';
    const iconSize = getFontSize(size as any) * /*scaleIcon*/ 2;
    const getThemedIcon = useGetThemedIcon({
      size: iconSize,
      color: /*color as any,*/ '$color10',
    });
    const ThemedIcon = getThemedIcon(icon);

    return (
      <XStack
        borderWidth="$1"
        borderColor="$color10"
        backgroundColor="$color3"
        borderRadius={10}
        margin="$0"
        padding="$0"
        gap="$2"
        alignContent="center"
        justifyContent="center"
        onLayout={onLayout}>
        <YStack
          alignContent="center"
          justifyContent="center"
          margin="$0"
          paddingLeft="$2">
          <>{ThemedIcon}</>
        </YStack>
        <Input
          // @ts-expect-error - types are not exposed on macOS or windows for enableFocusRing
          enableFocusRing={false}
          ref={ref}
          flex={1}
          size="$4"
          fontSize="$8"
          margin="$0"
          backgroundColor="$color3"
          borderWidth="$0"
          paddingLeft="$0"
          paddingTop="$2"
          onChangeText={handleSearch}
          onEndEditing={onEndEditing}
          onBlur={handleBlur}
        />
      </XStack>
    );
  },
);

export default SearchableInput;
