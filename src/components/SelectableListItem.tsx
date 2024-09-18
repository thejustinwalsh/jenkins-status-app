import {useCallback} from 'react';
import {CheckSquare, Square} from '@tamagui/lucide-icons';
import {ListItem} from 'tamagui';
import {useDebouncedCallback} from 'use-debounce';

type SelectableListItemProps = {
  title: string;
  selected?: boolean;
  onSelectChange?: () => void;
};

export default function SelectableListItem({
  title,
  selected,
  onSelectChange,
}: SelectableListItemProps) {
  const handleSelected = useDebouncedCallback(
    useCallback(() => {
      onSelectChange?.();
    }, [onSelectChange]),
    1000,
    {leading: true},
  );

  const icon = selected ? CheckSquare : Square;

  return (
    <ListItem
      icon={icon}
      size={defaults.size}
      scaleSpace={defaults.scaleSpace}
      scaleIcon={defaults.scaleIcon}
      title={title}
      onPress={handleSelected}
    />
  );
}

const defaults: {
  size: string;
  scaleSpace: number;
  scaleIcon: number;
} = {
  size: '$5',
  scaleSpace: 0.75,
  scaleIcon: 1.75,
};
