import {useMemo} from 'react';
import {useQueries} from '@tanstack/react-query';
import {encode as btoa} from 'base-64';

import {useProjectSettings} from './useProjectSettings';

import type {ProjectSettings} from './useProjectSettings';

export type ProjectStatus = {
  id: string;
  healthReport: HealthReport[];
  inQueue: boolean;
  lastBuild: Build;
  lastCompletedBuild: Build;
  lastFailedBuild: Build;
  lastSuccessfulBuild: Build;
  disabled: boolean;
};

export type Build = {
  number: number;
  url: string;
};

export type HealthReport = {
  description: string;
  score: number;
};

export type BuildStatus = {
  id: string;
  number: number;
  building: boolean;
  duration: number;
  estimatedDuration: number;
  inProgress: boolean;
  result: string;
  timestamp: number;
};

const REFETCH = 60 * 1000;

function fetchProjectStatus(
  url: string,
  {username, password}: ProjectSettings['auth'],
) {
  const api = new URL('/api/json', url).toString();
  return fetch(api, {
    headers: {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    },
  }).then(res => res.json());
}

function fetchBuildStatus(
  url: string,
  {username, password}: ProjectSettings['auth'],
  number: number,
) {
  const api = new URL(`/${number}/api/json`, url).toString();
  return fetch(api, {
    headers: {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    },
  }).then(res => res.json());
}

export function useProjectStatus() {
  const [settings] = useProjectSettings();
  const settingsMap = useMemo(
    () => new Map(settings.map(s => [s.id, s])),
    [settings],
  );

  // Fetch all root project statuses
  const projectsQuery = useQueries({
    queries: settings.map(({id, url, auth}) => ({
      queryKey: ['project', id],
      refetchInterval: REFETCH,
      refetchIntervalInBackground: true,
      queryFn: () => fetchProjectStatus(url, auth),
      placeholderData: (prev: ProjectStatus): ProjectStatus => ({
        id: prev?.id ?? id,
        healthReport: prev?.healthReport ?? [],
        inQueue: prev?.inQueue ?? false,
        lastBuild: prev?.lastBuild ?? {number: 0, url: ''},
        lastCompletedBuild: prev?.lastCompletedBuild ?? {number: 0, url: ''},
        lastFailedBuild: prev?.lastFailedBuild ?? {number: 0, url: ''},
        lastSuccessfulBuild: prev?.lastSuccessfulBuild ?? {number: 0, url: ''},
        disabled: prev?.disabled ?? false,
      }),
      select: (data: ProjectStatus): ProjectStatus => ({
        id,
        healthReport: data.healthReport.map(report => ({
          description: report.description,
          score: report.score,
        })),
        inQueue: data.inQueue,
        lastBuild: {
          number: data.lastBuild.number,
          url: data.lastBuild.url,
        },
        lastCompletedBuild: {
          number: data.lastCompletedBuild.number,
          url: data.lastCompletedBuild.url,
        },
        lastFailedBuild: {
          number: data.lastFailedBuild.number,
          url: data.lastFailedBuild.url,
        },
        lastSuccessfulBuild: {
          number: data.lastSuccessfulBuild.number,
          url: data.lastSuccessfulBuild.url,
        },
        disabled: data.disabled,
      }),
    })),
  });

  // Fetch the status of the last build for each project
  const buildQueries = useQueries({
    queries: projectsQuery.map(({data: project}) => {
      return {
        enabled: !!project && project.lastBuild.number > 0,
        queryKey: ['project', project?.id, project?.lastBuild.number],
        refetchInterval: REFETCH,
        refetchIntervalInBackground: true,
        // This should not run until the query keys are defined
        queryFn: () =>
          fetchBuildStatus(
            settingsMap.get(project!.id)!.url,
            settingsMap.get(project!.id)!.auth,
            project!.lastBuild.number,
          ),
        placeholderData: (prev: BuildStatus): BuildStatus => ({
          id: prev?.id ?? 0,
          number: prev?.number ?? project?.lastBuild.number ?? 0,
          building: prev?.building ?? false,
          duration: prev?.duration ?? 0,
          estimatedDuration: prev?.estimatedDuration ?? 0,
          inProgress: prev?.inProgress ?? false,
          result: prev?.result ?? '',
          timestamp: prev?.timestamp ?? 0,
        }),
        select: (data: BuildStatus): BuildStatus => ({
          id: data.id,
          number: data.number,
          building: data.building,
          duration: data.duration,
          estimatedDuration: data.estimatedDuration,
          inProgress: data.inProgress,
          result: data.result,
          timestamp: data.timestamp,
        }),
      };
    }),
  });

  return useMemo(
    () => ({
      projects: projectsQuery.map(
        ({data}, i) =>
          data ?? {
            id: settings[i].id,
            healthReport: [],
            inQueue: false,
            lastBuild: {number: 0, url: ''},
            lastCompletedBuild: {number: 0, url: ''},
            lastFailedBuild: {number: 0, url: ''},
            lastSuccessfulBuild: {number: 0, url: ''},
            disabled: false,
          },
      ),
      builds: buildQueries.map(
        ({data}, i) =>
          data ?? {
            id: projectsQuery[i].data?.id ?? 0,
            number: projectsQuery[i].data?.lastBuild?.number ?? 0,
            building: false,
            duration: 0,
            estimatedDuration: 0,
            inProgress: false,
            result: '',
            timestamp: 0,
          },
      ),
    }),
    [projectsQuery, buildQueries, settings],
  );
}
