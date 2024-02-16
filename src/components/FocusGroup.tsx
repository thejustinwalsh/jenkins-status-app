import React, {
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {map} from 'react-itertools';
import {useDebouncedCallback} from 'use-debounce';

import type {
  NativeSyntheticEvent,
  NativeTouchEvent,
  TextInputEndEditingEventData,
} from 'react-native';

export type FocusGroupProps = React.PropsWithChildren<{
  id: string;
  initialFocus?: React.Key;
}>;

export type FocusLookup = {
  index: number;
  id?: React.Key | null;
};

export default function FocusGroup({initialFocus, children}: FocusGroupProps) {
  const focusLookup = useRef<Map<React.Key, {ref: any; index: number}>>(
    new Map(),
  );
  const [cachedFocus, setCachedFocus] = useState<{ref: any; index: number}[]>(
    [],
  );
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [wasPressed, setWasPressed] = useState(true);

  const sortedKeys = Array.from(focusLookup.current.keys()).sort(
    k => focusLookup.current.get(k)?.index ?? -1,
  );

  const handlePressIn = useCallback(
    (
      key: React.Key,
      event: NativeSyntheticEvent<NativeTouchEvent>,
      parent?: (event: NativeSyntheticEvent<NativeTouchEvent>) => void,
    ) => {
      const index = sortedKeys.findIndex(k => k === key);
      if (index !== focusedIndex) {
        setWasPressed(true);
        setFocusedIndex(index);
      }
      if (parent) {
        parent(event);
      }
    },
    [focusedIndex, sortedKeys],
  );

  const handleEndEditing = useCallback(
    (
      key: React.Key,
      event?: NativeSyntheticEvent<TextInputEndEditingEventData>,
      parent?: (
        event: NativeSyntheticEvent<TextInputEndEditingEventData>,
      ) => void,
    ) => {
      const index = sortedKeys.findIndex(k => k === key);
      if (!wasPressed) {
        const target = cachedFocus[index].ref.current;
        if (target) {
          console.log(target);
          target.setSelection(0, 0);
        }
        setFocusedIndex((index + 1) % sortedKeys.length);
        if (event && parent) {
          parent(event);
        }
      } else {
        setWasPressed(false);
      }
    },
    [cachedFocus, sortedKeys, wasPressed],
  );

  const debouncedHandleEndEditing = useDebouncedCallback(handleEndEditing, 60, {
    trailing: true,
  });

  useEffect(() => {
    if (initialFocus) {
      setCachedFocus(Array.from(focusLookup.current.values()));
      setFocusedIndex(focusLookup.current.get(initialFocus)?.index ?? 0);
    }
  }, [initialFocus]);

  useEffect(() => {
    console.log('focusedIndex', focusedIndex, cachedFocus[focusedIndex]);
    cachedFocus[focusedIndex]?.ref?.current?.focus();
  }, [cachedFocus, focusedIndex]);

  const mappedChildren = useMemo(
    () =>
      map(children, child => {
        if (
          isValidElement(child) &&
          child.props.focusIndex !== undefined &&
          child.props.id !== undefined
        ) {
          const parentHandleEditingEnded = child.props.onEndEditing;
          const parentHandlePressIn = child.props.onPressIn;
          focusLookup.current.set(child.props.id, {
            ref: React.createRef(),
            index: child.props.focusIndex,
          });
          return React.cloneElement(child as any, {
            ref: (ref: any) => {
              const t = focusLookup.current.get(child.props.id);
              if (t && ref) {
                t.ref.current = ref;
              }
            },
            autoFocus: false,
            selectTextOnFocus: true,
            onPressIn: (e: NativeSyntheticEvent<NativeTouchEvent>) =>
              handlePressIn(child.props.id, e, parentHandlePressIn),
            onEndEditing: (
              e: NativeSyntheticEvent<TextInputEndEditingEventData>,
            ) =>
              debouncedHandleEndEditing(
                child.props.id,
                e,
                parentHandleEditingEnded,
              ),
          });
        }
        return child;
      }),
    [children, debouncedHandleEndEditing, handlePressIn],
  );

  return <>{mappedChildren}</>;
}
