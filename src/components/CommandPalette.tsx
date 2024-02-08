import {KeyEvent, useKeyEvents} from '@app/hooks/keyEvents';
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
import {AnimatePresence, Input, YStack} from 'tamagui';

// TODO: CommandPalette will either fuzzy search through your projects or run a command
// - When the user starts typing alphanumeric characters summon the command palette and start a fuzzy search through the projects
// - When the user is fuzzy searching the command palette acts like a filter for the projects in the project list
// - When the user presses enter summon the command palette
// - When the user presses escape dismiss the command palette
// - When the user presses the up or down arrow keys navigate through the command palette
// - When the user presses enter on a command run the command
// - Style the command palette to look like a Select component, so the user may browse the commands available

export type SearchSet = {
  key: React.Key;
  value: string;
};

type SearchableInputProps = {
  terms: SearchSet[];
  onSearchResults?: (results: SearchSet[]) => void;
  onBlur?: () => void;
};

type CommandPaletteProps = SearchableInputProps & {
  isVisible: boolean;
};

export const SearchableInput = forwardRef<TextInput, SearchableInputProps>(
  function SearchableInput({terms, onSearchResults, onBlur}, ref) {
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

    return (
      <Input
        // @ts-expect-error - types are not exposed on macOS or windows for enableFocusRing
        enableFocusRing={false}
        ref={ref}
        size="$4"
        fontSize="$8"
        paddingTop="$2"
        onChangeText={handleSearch}
        onBlur={handleBlur}
      />
    );
  },
);

export default function CommandPalette({
  isVisible,
  terms,
  onSearchResults,
}: CommandPaletteProps) {
  const inputRef = useRef<TextInput>(null);
  const [visible, setVisible] = useState<boolean>(isVisible);
  useEffect(() => setVisible(isVisible), [isVisible]);

  const handleKeyEvents = useCallback((event: KeyEvent) => {
    // Escape - TODO: macOS -> JS keyCode
    if (event.keyCode === 53) {
      setVisible(false);
    }
    // Enter - TODO: macOS -> JS keyCode
    if (event.keyCode === 36) {
      setVisible(true);
    }
  }, []);

  const handleBlur = useCallback(() => {
    setVisible(false);
  }, []);

  const toggleKeyEvents = useKeyEvents(handleKeyEvents);

  useEffect(() => {
    toggleKeyEvents(!visible);
    if (visible) {
      inputRef.current?.focus();
    }
  }, [toggleKeyEvents, visible, inputRef]);

  return (
    <AnimatePresence>
      {visible && (
        <YStack overflow="hidden" padding="$0" margin="$0">
          <YStack
            padding="$5"
            paddingBottom="$0"
            enterStyle={{y: 0}}
            exitStyle={{y: -100}}>
            <SearchableInput
              ref={inputRef}
              terms={terms}
              onSearchResults={onSearchResults}
              onBlur={handleBlur}
            />
          </YStack>
        </YStack>
      )}
    </AnimatePresence>
  );
}
