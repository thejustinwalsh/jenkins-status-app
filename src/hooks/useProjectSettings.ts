import {useAtom} from 'jotai';

import {atomWithStorage} from '@app/lib/storage';

export type ProjectSettings = {
  id: string;
  name: string;
  url: string;
  // TODO: use key-chain to store credentials and provide a link to the key-chain id
  auth: {
    username: string;
    password: string;
  };
  notifications: {
    onSuccess: boolean;
    onFailure: boolean;
  };
};

const debugData: ProjectSettings[] = [
  {
    id: '1',
    name: 'Project 1',
    url: 'https://example.com',
    auth: {
      username: 'user',
      password: 'pass',
    },
    notifications: {
      onSuccess: false,
      onFailure: true,
    },
  },
  {
    id: '2',
    name: 'Project 2',
    url: 'https://example.com',
    auth: {
      username: 'user',
      password: 'pass',
    },
    notifications: {
      onSuccess: true,
      onFailure: true,
    },
  },
  {
    id: '3',
    name: 'Project 3',
    url: 'https://example.com',
    auth: {
      username: 'user',
      password: 'pass',
    },
    notifications: {
      onSuccess: true,
      onFailure: false,
    },
  },
];

// TODO: remove debug data
const settingsAtom = atomWithStorage<ProjectSettings[]>(
  'project-settings',
  debugData,
);

export function useProjectSettings() {
  return useAtom(settingsAtom);
}

export function useProjectSetting(id: string) {
  const [projects] = useProjectSettings();
  return projects.find(p => p.id === id);
}
