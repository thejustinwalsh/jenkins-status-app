import {useEffect, useMemo, useState} from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  CircleEllipsis,
  PauseCircle,
  XCircle,
} from '@tamagui/lucide-icons';
import RelativeTime from '@yaireo/relative-time';

import ListItem from '@app/components/StatusListItem';

import type {IconProps} from '@tamagui/helpers-icon';

export type ProjectListStatusProps = {
  color: string;
  icon: React.NamedExoticComponent<IconProps>;
};

export type ProjectListItemProps = {
  variant?: 'default' | 'progress';
  title: string;
  timestamp?: number;
  duration?: number;
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
  status,
  timestamp,
  duration,
  onPress,
}: ProjectListItemProps) {
  const [value, setValue] = useState<number | undefined>();

  const subTitle = useMemo(
    () =>
      variant === 'default' && timestamp !== undefined
        ? new RelativeTime().from(new Date(timestamp + (duration ?? 0)))
        : null,
    [timestamp, duration, variant],
  );

  useEffect(() => {
    let req: number = -1;
    if (variant === 'progress' && timestamp !== undefined) {
      req = requestAnimationFrame(() => {
        setValue(
          Math.max(
            0,
            Math.min(
              ((Date.now() - timestamp) / (duration ?? 0)) * defaults.max,
              defaults.max,
            ),
          ),
        );
      });
    }
    return () => cancelAnimationFrame(req);
  }, [duration, timestamp, variant]);

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
      subTitle={subTitle}
      hasProgress={variant === 'progress'}
      value={value}
      max={defaults.max}
      onPress={onPress}
    />
  );
}
