import {useMemo} from 'react';
import {encode as btoa} from 'base-64';
import useSWR from 'swr';

import {useProjectSettings} from './useProjectSettings';

import type {ProjectSettings} from './useProjectSettings';

export type ProjectStatus = {
  id: string;
  name: string;
  fullDisplayName: string;
  description: string;
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

export type ProjectInfo = {
  id: string;
  name: string;
  variant: 'default' | 'progress';
  status: 'inProgress' | 'succeeded' | 'failed' | 'pending' | 'canceled';
  details?: ProjectStatus;
  build?: BuildStatus;
};

const REFETCH = 1000 * 60 * 10;

function fetchProject(
  url: string,
  {username, password}: ProjectSettings['auth'],
) {
  const api = new URL('/api/json', url).toString();
  return fetch(api, {
    headers: {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    },
  }).then(res => res.json() as Promise<ProjectStatus>);
}

function fetchBuild(
  url: string,
  {username, password}: ProjectSettings['auth'],
) {
  const api = new URL('/api/json', url).toString();
  return fetch(api, {
    headers: {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    },
  }).then(res => res.json() as Promise<BuildStatus>);
}

export function useProject(id: string) {
  const [settings] = useProjectSettings();
  const settingsMap = useMemo(
    () => new Map(settings.map(s => [s.id, s])),
    [settings],
  );

  const project = settingsMap.get(id);
  if (!project) {
    throw new Error(`Project "${id}" not found`);
  }

  const {data, error, isLoading} = useSWR(
    project.url,
    url => fetchProject(url, project.auth),
    {refreshInterval: REFETCH},
  );

  return {
    project: data,
    isError: error,
    isLoading,
  };
}

export function useBuild(id: string, number?: number) {
  const [settings] = useProjectSettings();
  const settingsMap = useMemo(
    () => new Map(settings.map(s => [s.id, s])),
    [settings],
  );

  const project = settingsMap.get(id);
  if (!project) {
    throw new Error(`Project "${id}" not found`);
  }

  const buildUrl = new URL(`/${number}`, project.url).toString();
  const {data, error, isLoading} = useSWR(
    () => (number ? buildUrl : null),
    url => fetchBuild(url, project.auth),
    {refreshInterval: REFETCH},
  );

  return {
    build: data,
    isError: error,
    isLoading,
  };
}
