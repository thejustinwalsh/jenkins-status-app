import {useCallback, useMemo} from 'react';
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

const settingsAtom = atomWithStorage<ProjectSettings[]>('project-settings', []);

// TODO: Without default projects in storage, we should provide a way to add them
export function useProjectSettings() {
  return useAtom(settingsAtom);
}

export function useProjectSetting(id: string) {
  const [projects, setProjects] = useProjectSettings();
  const project = useMemo(
    () => projects.find(p => p.id === id),
    [projects, id],
  );
  if (project === undefined) {
    throw new Error(`Project "${id}" not found`);
  }

  const setProject = useCallback(
    (p: ProjectSettings) =>
      setProjects([...projects.map(pr => (pr.id === p.id ? p : pr))]),
    [projects, setProjects],
  );

  return [project, setProject] as const;
}
