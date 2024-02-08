import {Searcher} from 'fast-fuzzy';
import {useCallback, useMemo} from 'react';
import {Input} from 'tamagui';

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
};

type CommandPaletteProps = {
  terms: SearchSet[];
  commands: SearchSet[];
};

export function SearchableInput({
  terms,
  onSearchResults,
}: SearchableInputProps) {
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

  return (
    <Input
      // @ts-expect-error
      enableFocusRing={false}
      size="$4"
      fontSize="$8"
      paddingTop="$2"
      onChangeText={handleSearch}
    />
  );
}

export default function CommandPalette({terms, commands}: CommandPaletteProps) {
  void terms;
  void commands;
  return <Input />;
}
