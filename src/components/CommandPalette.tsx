import {useCallback, useEffect, useRef, useState} from 'react';
import {ListFilter, Terminal} from '@tamagui/lucide-icons';
import {Heading, Popover, YStack} from 'tamagui';

import SearchableInput from '@app/components/SearchableInput';

import type {
  SearchSet,
  SearchableInputProps,
} from '@app/components/SearchableInput';
import type React from 'react';
import type {LayoutChangeEvent, TextInput} from 'react-native';

// TODO: CommandPalette will either fuzzy search through your projects or run a command
// - When the user presses the up,down or tab keys or clicks on the icon navigate through the command palette list
// - When the user clicks on a command in the autocomplete list the command is executed
// - When the user presses tab with a autocomplete list open cycle through the list
// - When the user navigates the list with the keyboard using up or down arrows cycle through the list

export type CommandPaletteProps = SearchableInputProps & {
  isVisible: boolean;
  commands: SearchSet[];
  mode?: 'search' | 'command';
  onCommandSelected?: (command: React.Key) => void;
  onClosed?: () => void;
  wrap?: (children: React.ReactNode) => React.ReactNode;
};

export default function CommandPalette({
  isVisible,
  terms,
  commands,
  mode = 'search',
  onSearchResults,
  onCommandSelected,
  onClosed,
}: CommandPaletteProps) {
  const ref = useRef<TextInput>(null);
  const [searchResults, setSearchResults] = useState<SearchSet[]>([]);
  const [commandPaletteWidth, setCommandPaletteWidth] = useState<number>(300);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible && ref.current?.isFocused() === false) {
      setTimeout(() => ref.current?.focus(), 1);
    }
  }, [isVisible, ref]);

  const handleBlur = useCallback(() => {
    setPopoverOpen(false);
    onClosed?.();
  }, [onClosed]);

  const handleSearchResults = useCallback(
    (results: SearchSet[]) => {
      setSearchResults(results);
      if (mode === 'search') {
        onSearchResults?.(results);
      }
    },
    [mode, onSearchResults],
  );

  const handleEndEditing = useCallback(() => {
    const command = searchResults.length > 0 ? searchResults[0] : null;
    if (command) {
      onCommandSelected?.(command.key);
    }
  }, [onCommandSelected, searchResults]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    setCommandPaletteWidth(width);
  }, []);

  useEffect(() => {
    if (mode === 'command') {
      setPopoverOpen(searchResults.length > 0 ? true : false);
    }
  }, [searchResults, mode]);

  return (
    // TODO: Implement AnimatePresence, the parent element needs to animate on show/hide, maybe we remove the internal visibility state, and add a callback to the parent
    <>
      {isVisible && (
        <Popover open={popoverOpen} placement="bottom">
          <Popover.Anchor overflow="hidden" padding="$0" margin="$0">
            <YStack padding="$5" paddingBottom="$0">
              <SearchableInput
                ref={ref}
                icon={mode === 'command' ? Terminal : ListFilter}
                terms={mode === 'command' ? commands : terms}
                onSearchResults={handleSearchResults}
                onEndEditing={handleEndEditing}
                onBlur={handleBlur}
                onLayout={handleLayout}
              />
            </YStack>
          </Popover.Anchor>
          <Popover.Content
            margin="$4"
            padding="$1"
            width={commandPaletteWidth}
            minHeight={100}
            borderWidth="$1"
            backgroundColor="$color3"
            borderColor="$color9"
            alignItems="stretch">
            <YStack margin="$2" marginLeft="$3" gap="$0" alignItems="stretch">
              {searchResults.map(result => (
                <Heading key={result.key} size="$6">
                  {result.value}
                </Heading>
              ))}
            </YStack>
          </Popover.Content>
        </Popover>
      )}
    </>
  );
}
