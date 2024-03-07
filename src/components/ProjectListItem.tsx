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
import {useProjectNotifier} from '@app/hooks/useProjectNotifier';
import {useProject} from '@app/hooks/useProjects';
import {useBuildState, useProjectState} from '@app/hooks/useProjectState';
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
  const [project] = useProject(id);
  const {project: state, isLoading} = useProjectState(project.id);

  if (isLoading || state === undefined) {
    return (
      <ListItem
        key={id}
        id={id}
        noTextWrap
        hoverTheme={defaults.hoverTheme}
        pressTheme={defaults.pressTheme}
        overflow="hidden"
        size={defaults.size}
        scaleSpace={defaults.scaleSpace}
        scaleIcon={defaults.scaleIcon}
        color={defaults.status.canceled.color}
        icon={defaults.status.canceled.icon}
        iconAfter={ChevronRight}
        title={project.name}
        subTitle="Fetching status..."
        onPress={onPress}
      />
    );
  }

  return (
    <ProjectListItemBuild
      key={id}
      id={id}
      title={project.name}
      number={state.lastBuild.number}
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
  const {build, isLoading, isValidating} = useBuildState(id, number);
  const [value, setValue] = useState<number | undefined>();
  const [subTitle, setSubTitle] = useState<string | undefined>();

  // TODO: maybe project notifications should be a service?
  // - We don't want the notifications to be dependent of the screen you are on
  useProjectNotifier(id);

  const variant = useMemo(() => {
    // eslint-disable-next-line no-void -- ensure we update when new data is available
    void isValidating;

    return build?.inProgress ? 'progress' : 'default';
  }, [build?.inProgress, isValidating]);

  const hasProgress = useMemo(() => variant === 'progress', [variant]);

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

    const updateProgress = () => {
      const timestamp = build?.timestamp ?? Date.now();
      const estimatedDuration = build?.estimatedDuration ?? 0;
      const progress = Math.max(
        0,
        Math.min(
          ((Date.now() - timestamp) / estimatedDuration) * defaults.max,
          defaults.max,
        ),
      );
      setValue(progress);
      req = setTimeout(updateProgress, 60) as unknown as number;
    };

    if (variant === 'progress' && build && build.inProgress) {
      updateProgress();
    } else if (req !== -1) {
      clearTimeout(req);
    }
    return () => clearTimeout(req);
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
      id={id}
      noTextWrap
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
      hasProgress={hasProgress}
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
