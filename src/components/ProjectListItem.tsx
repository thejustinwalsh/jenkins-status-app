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
import {useProjectSetting} from '@app/hooks/useProjectSettings';
import {useBuild, useProject} from '@app/hooks/useProjectStatus';
import appBridge from '@app/lib/native';

import type {IconProps} from '@tamagui/helpers-icon';

export type ProjectListStatusProps = {
  color: string;
  icon: React.NamedExoticComponent<IconProps>;
};

export type ProjectListItemProps = {
  id: string;
  onPress?: () => void;
};

export type ProjectListItemBuildProps = ProjectListItemProps & {
  title: string;
  number: number;
};

export default function ProjectListItem({id, onPress}: ProjectListItemProps) {
  const [settings] = useProjectSetting(id);
  const {project, isLoading} = useProject(settings.id);

  if (isLoading || project === undefined) {
    return (
      <ListItem
        key={id}
        hoverTheme={defaults.hoverTheme}
        pressTheme={defaults.pressTheme}
        overflow="hidden"
        size={defaults.size}
        scaleSpace={defaults.scaleSpace}
        scaleIcon={defaults.scaleIcon}
        color={defaults.status.canceled.color}
        icon={defaults.status.canceled.icon}
        iconAfter={ChevronRight}
        title={settings.name}
        subTitle="Fetching status..."
        onPress={onPress}
      />
    );
  }

  return (
    <ProjectListItemBuild
      key={id}
      id={id}
      title={settings.name}
      number={project.lastBuild.number}
      onPress={onPress}
    />
  );
}

export function ProjectListItemBuild({
  id,
  title,
  number,
  onPress,
}: ProjectListItemBuildProps) {
  const {build, isLoading, isValidating} = useBuild(id, number);
  const [value, setValue] = useState<number | undefined>();
  const [subTitle, setSubTitle] = useState<string | undefined>();

  const variant = useMemo(() => {
    // eslint-disable-next-line no-void -- ensure we update when new data is available
    void isValidating;

    return build?.inProgress ? 'progress' : 'default';
  }, [build?.inProgress, isValidating]);

  const status = useMemo(() => {
    // eslint-disable-next-line no-void -- ensure we update when new data is available
    void isValidating;

    if (isLoading) {
      return 'canceled';
    }
    if (build === undefined) {
      return 'canceled';
    }
    if (build.inProgress) {
      return 'inProgress';
    }
    if (build.result === 'SUCCESS') {
      return 'succeeded';
    }
    if (build.result === 'FAILURE') {
      return 'failed';
    }
    return 'pending';
  }, [build, isLoading, isValidating]);

  // TODO: make this a custom hook for smooth progress updates
  useEffect(() => {
    let req: number = -1;
    if (variant === 'progress' && build && build.inProgress) {
      const updateProgress = () => {
        setValue(
          Math.max(
            0,
            Math.min(
              ((Date.now() - build.timestamp) / build.estimatedDuration) *
                defaults.max,
              defaults.max,
            ),
          ),
        );
        req = requestAnimationFrame(updateProgress);
      };
      updateProgress();
    } else if (req !== -1) {
      cancelAnimationFrame(req);
    }
    return () => cancelAnimationFrame(req);
  }, [build, variant]);

  // TODO: make this a custom hook for updating the project timestamps
  useEffect(() => {
    let req: number = -1;
    let interval = 15000;
    let isInBackground = false;

    const updateTimestamp = () => {
      setSubTitle(
        variant === 'default' && build
          ? new RelativeTime().from(new Date(build.timestamp + build.duration))
          : undefined,
      );
      interval =
        build && Date.now() - build.timestamp > 1000 * 60 * 60 ? 60000 : 15000;
      req = setTimeout(updateTimestamp, interval) as unknown as number;
    };

    const onPopoverStateChange = (isVisible: boolean) => {
      isInBackground = !isVisible;
      isInBackground ? clearTimeout(req) : updateTimestamp();
    };

    let subscription = appBridge.addListener('popover', onPopoverStateChange);
    if (build && !isInBackground) {
      updateTimestamp();
    } else if (req !== -1) {
      clearTimeout(req);
    }

    return () => {
      clearTimeout(req);
      subscription.remove();
    };
  }, [build, variant]);

  return (
    <ListItem
      key={id}
      hoverTheme={defaults.hoverTheme}
      pressTheme={defaults.pressTheme}
      overflow="hidden"
      size={defaults.size}
      scaleSpace={defaults.scaleSpace}
      scaleIcon={defaults.scaleIcon}
      color={defaults.status[status].color}
      icon={defaults.status[status].icon}
      iconAfter={ChevronRight}
      title={title}
      subTitle={subTitle ?? ' '}
      hasProgress={variant === 'progress'}
      value={value}
      max={defaults.max}
      onPress={onPress}
    />
  );
}

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
