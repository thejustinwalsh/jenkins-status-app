/**
 * @jest-environment jsdom
 */

import {renderHook} from '@testing-library/react';

import appBridge from '@app/lib/native';
import {useProjectNotifier} from './useProjectNotifier';

import type {NotificationState} from './useProjectNotifier';
import type {ProjectSettings} from './useProjects';
import type {BuildStatus, ProjectStatus} from './useProjectState';

global.fetch = jest.fn();

jest.mock('./useProjects', () => ({
  useProject: jest.fn(
    (id: string): [ProjectSettings] =>
      [
        [
          {
            id: '0',
            name: 'Notify Success',
            url: 'http://example.com',
            auth: {username: '', password: ''},
            notifications: {
              onSuccess: true,
              onFailure: false,
            },
          },
          {
            id: '1',
            name: 'Notify Failure',
            url: 'http://example.com',
            auth: {username: '', password: ''},
            notifications: {
              onSuccess: false,
              onFailure: true,
            },
          },
          {
            id: '2',
            name: 'Notify Success & Failure',
            url: 'http://example.com',
            auth: {username: '', password: ''},
            notifications: {
              onSuccess: true,
              onFailure: true,
            },
          },
        ][parseInt(id, 10)],
      ] as const,
  ),
}));

jest.mock('./useProjectState', () => ({
  useProjectState: jest.fn((id: string): {project: ProjectStatus} => ({
    project: {
      id: id,
      name: 'Notify Success',
      description: 'Notify on success',
      healthReport: [{description: 'Success', score: 100}],
      fullDisplayName: 'Notify Success',
      inQueue: false,
      disabled: false,
      lastBuild: {
        url: 'http://example.com',
        number: parseInt(id, 10),
      },
      lastSuccessfulBuild: {
        url: 'http://example.com',
        number: parseInt(id, 10) === 0 ? 0 : -1,
      },
      lastFailedBuild: {
        url: 'http://example.com',
        number: parseInt(id, 10) === 1 ? 1 : -1,
      },
      lastCompletedBuild: {
        url: 'http://example.com',
        number: parseInt(id, 10),
      },
    },
  })),
  useBuildState: jest.fn(
    (id: string, number: number): {build: BuildStatus} => ({
      build: {
        id,
        number: number,
        building: false,
        duration: 0,
        estimatedDuration: 0,
        inProgress: false,
        result: 'SUCCESS',
        timestamp: Date.now(),
      },
    }),
  ),
}));

jest.mock('@app/lib/storage', () => ({
  atomWithStorage: jest.fn((id: string) => id),
}));

jest.mock('jotai', () => ({
  useAtom: jest.fn(
    (id: string): [NotificationState, () => void] =>
      [
        {
          'project-notifications-0': {
            build: -1,
            notifiedOn: 0,
            status: 'failure',
          },
          'project-notifications-1': {
            build: 0,
            notifiedOn: 0,
            status: 'success',
          },
          'project-notifications-2': {
            build: 1,
            notifiedOn: 0,
            status: 'stalled',
          },
        }[id] as NotificationState,
        jest.fn(),
      ] as const,
  ),
}));

describe('useProjectNotifier', () => {
  it('should notify on success state change', () => {
    const sendNotification = jest.spyOn(appBridge, 'sendNotification');
    renderHook(() => useProjectNotifier('0'));
    expect(sendNotification).toHaveBeenCalledWith(
      'Notify Success succeeded',
      'Build #0 succeeded',
      'http://example.com',
    );
  });

  it('should notify on failure state change', () => {
    const sendNotification = jest.spyOn(appBridge, 'sendNotification');
    renderHook(() => useProjectNotifier('1'));
    expect(sendNotification).toHaveBeenCalledWith(
      'Notify Failure failed',
      'Build #1 failed',
      'http://example.com',
    );
  });
});
