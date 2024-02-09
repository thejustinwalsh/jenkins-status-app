import {KeyEvent, useKeyEvents} from '@app/hooks/keyEvents';
import {ListFilter, Terminal} from '@tamagui/lucide-icons';
import {IconProps} from '@tamagui/helpers-icon';
import {Searcher} from 'fast-fuzzy';
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {TextInput} from 'react-native';
import {
  AnimatePresence,
  Input,
  XStack,
  YStack,
  getFontSize,
  useGetThemedIcon,
} from 'tamagui';

// TODO: CommandPalette will either fuzzy search through your projects or run a command
// - When the user presses the up,down or tab keys or clicks on the icon navigate through the command palette list
// - When the user presses enter on a command run the command
// - When the user is in command mode show the autocomplete command list

export type SearchSet = {
  key: React.Key;
  value: string;
};

type SearchableInputProps = {
  icon?: React.NamedExoticComponent<IconProps>;
  terms: SearchSet[];
  onSearchResults?: (results: SearchSet[]) => void;
  onBlur?: () => void;
};

type CommandPaletteProps = SearchableInputProps & {
  isVisible: boolean;
  commands: SearchSet[];
  onCommandSelected?: (command: SearchSet) => void;
  wrap?: (children: React.ReactNode) => React.ReactNode;
};

export const SearchableInput = forwardRef<TextInput, SearchableInputProps>(
  function SearchableInput({icon, terms, onSearchResults, onBlur}, ref) {
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
      // @ts-expect-error - I don't know the types needed to fix this
      const input = ref?.current as TextInput | undefined;
      if (input) {
        input.clear();
      }
      onSearchResults?.([]);
      onBlur?.();
    }, [onBlur, onSearchResults, ref]);

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
        borderRadius={10}
        margin="$0"
        padding="$0"
        gap="$2"
        alignContent="center"
        justifyContent="center">
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
          borderWidth="$0"
          paddingLeft="$0"
          paddingTop="$2"
          onChangeText={handleSearch}
          onBlur={handleBlur}
        />
      </XStack>
    );
  },
);

// TODO: Implement onCommandSelected callback in command mode
// - Store the filtered command results in a state
// - When the user presses enter on a command run the command
export default function CommandPalette({
  isVisible,
  terms,
  commands,
  onSearchResults,
}: CommandPaletteProps) {
  const inputRef = useRef<TextInput>(null);
  const [mode, setMode] = useState<'search' | 'command'>('search');
  const [visible, setVisible] = useState<boolean>(isVisible);
  useEffect(() => setVisible(isVisible), [isVisible]);

  const handleBlur = useCallback(() => setVisible(false), []);

  const handleKeyEvents = useCallback((event: KeyEvent) => {
    // Enter - TODO: macOS -> JS keyCode
    if (event.keyCode === 36) {
      setMode('command');
      setVisible(true);
    }
    // Esc - TODO: macOS -> JS keyCode
    // TODO: the key system is going to capture the key, and make users type it twice when summoning the palette
    // TODO: we will need to capture the key in native, and inject it into the command palette for a smooth experience
    else if (event.keyCode !== 53) {
      setMode('search');
      setVisible(true);
    }
  }, []);

  const toggleKeyEvents = useKeyEvents(handleKeyEvents);
  useEffect(() => {
    toggleKeyEvents(!visible);
    if (visible) {
      inputRef.current?.focus();
    }
  }, [toggleKeyEvents, visible, inputRef]);

  return (
    // TODO: Implement AnimatePresence, the parent element needs to animate on show/hide, maybe we remove the internal visibility state, and add a callback to the parent
    <AnimatePresence>
      {visible && (
        <YStack
          overflow="hidden"
          padding="$0"
          margin="$0"
          enterStyle={{y: 0}}
          exitStyle={{y: -100}}>
          <YStack padding="$5" paddingBottom="$0">
            <SearchableInput
              ref={inputRef}
              icon={mode === 'command' ? Terminal : ListFilter}
              terms={mode === 'command' ? commands : terms}
              onSearchResults={onSearchResults}
              onBlur={handleBlur}
            />
          </YStack>
        </YStack>
      )}
    </AnimatePresence>
  );
}
