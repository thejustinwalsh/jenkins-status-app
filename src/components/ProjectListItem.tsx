import {
  XCircle,
  CheckCircle2,
  ChevronRight,
  CircleEllipsis,
  PauseCircle,
  AlertCircle,
} from '@tamagui/lucide-icons';

import ListItem from '@app/components/StatusListItem';

import type {IconProps} from '@tamagui/helpers-icon';

type ProjectListStatusProps = {
  color: string;
  icon: React.NamedExoticComponent<IconProps>;
};

type ProjectListItemProps = {
  variant?: 'default' | 'progress';
  title: string;
  value?: string | number;
  status: 'succeeded' | 'failed' | 'inProgress' | 'pending' | 'canceled';
  onPress?: () => void;
};

const defaults: {
  hoverTheme: boolean;
  pressTheme: boolean;
  size: string;
  scaleSpace: number;
  scaleIcon: number;
  max: number;
  status: {
    succeeded: ProjectListStatusProps;
    failed: ProjectListStatusProps;
    inProgress: ProjectListStatusProps;
    pending: ProjectListStatusProps;
    canceled: ProjectListStatusProps;
  };
} = {
  hoverTheme: true,
  pressTheme: true,
  size: '$5',
  scaleSpace: 0.75,
  scaleIcon: 1.75,
  max: 100,
  status: {
    succeeded: {
      color: '$green9',
      icon: CheckCircle2,
    },
    failed: {
      color: '$red9',
      icon: AlertCircle,
    },
    inProgress: {
      color: '$color11',
      icon: CircleEllipsis,
    },
    pending: {
      color: '$blue9',
      icon: PauseCircle,
    },
    canceled: {
      color: '$color11',
      icon: XCircle,
    },
  },
};

export default function ProjectListItem({
  variant = 'default',
  title,
  value = '',
  status,
  onPress,
}: ProjectListItemProps) {
  return (
    <ListItem
      hoverTheme
      pressTheme
      overflow="hidden"
      size={defaults.size}
      scaleSpace={defaults.scaleSpace}
      scaleIcon={defaults.scaleIcon}
      color={defaults.status[status].color}
      icon={defaults.status[status].icon}
      iconAfter={ChevronRight}
      title={title}
      subTitle={variant === 'progress' ? variant : value}
      hasProgress={variant === 'progress'}
      value={typeof value === 'number' ? value : 0}
      max={defaults.max}
      onPress={onPress}
    />
  );
}
