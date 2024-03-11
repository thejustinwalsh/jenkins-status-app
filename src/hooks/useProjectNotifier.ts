import {useMemo} from 'react';
import {useAtom} from 'jotai';

import appBridge from '@app/lib/native';
import {atomWithStorage} from '@app/lib/storage';
import {useProject} from './useProjects';
import {useBuildState, useProjectState} from './useProjectState';

export type NotificationState = {
  build: number;
  notifiedOn: number;
  status: 'success' | 'failure' | 'stalled';
};

export function useProjectNotifier(id: string) {
  const [project] = useProject(id);
  const {project: state} = useProjectState(id);
  const {build} = useBuildState(id, state?.lastBuild.number);
  const notificationConfig = useMemo(
    () =>
      atomWithStorage<NotificationState>(`project-notifications-${id}`, {
        build: 0,
        notifiedOn: 0,
        status: 'stalled',
      }),
    [id],
  );

  const [notification, setNotification] = useAtom(notificationConfig);

  // Determine if we should notify
  const pending: NotificationState = {
    build: build?.number ?? 0,
    notifiedOn: Date.now(),
    status: 'success',
  };
  if (state && build && state.lastBuild.number === build.number) {
    if (build.inProgress) {
      if (build.timestamp + build.estimatedDuration * 1.5 < Date.now()) {
        pending.status = 'stalled';
      }
    } else if (state.lastSuccessfulBuild.number === build.number) {
      pending.status = 'success';
    } else if (state.lastFailedBuild.number === build.number) {
      pending.status = 'failure';
    }
  }

  // Notify if necessary
  if (pending.build !== notification.build) {
    setNotification(pending);

    // Notify on status change from previous build
    if (pending.status === 'failure') {
      if (project.notifications.onFailure) {
        appBridge.sendNotification(
          `${project.name} failed`,
          `Build #${pending.build} failed`,
          project.url,
        );
      }
    } else if (
      pending.status === 'success' &&
      pending.status !== notification.status
    ) {
      if (project.notifications.onSuccess) {
        appBridge.sendNotification(
          `${project.name} succeeded`,
          `Build #${pending.build} succeeded`,
          project.url,
        );
      }
    } else if (
      pending.status === 'stalled' &&
      pending.status !== notification.status
    ) {
      // TODO: add onStalled notification setting
      if (project.notifications.onFailure) {
        appBridge.sendNotification(
          `${project.name} stalled`,
          `Build #${pending.build} stalled`,
          project.url,
        );
      }
    }
  }
}
