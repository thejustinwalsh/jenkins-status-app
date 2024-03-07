import {useCallback, useMemo} from 'react';
import {atom, useAtom} from 'jotai';

import {atomWithStorage, idgen} from '@app/lib/storage';

export type ProjectSettingIndex = {
  id: string;
  key: string;
};

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

const settingKey = (id: string, key: string) => ({
  id,
  name: key,
  url: 'https://devnull-as-a-service.com/dev/null',
  auth: {username: '', password: ''},
  notifications: {onFailure: false, onSuccess: false},
});

const projectsConfig = atomWithStorage<ProjectSettingIndex[]>('projects', []);

export function useProjects() {
  const [projects, setProjects] = useAtom(projectsConfig);
  const addProject = useCallback(
    (key: string) => {
      setProjects([...projects, {id: idgen(), key}]);
    },
    [projects, setProjects],
  );
  return [projects, setProjects, addProject] as const;
}

export function useProject(id: string) {
  const [index, setIndex] = useProjects();
  const idx = useMemo(() => index.find(i => i.id === id), [index, id]);
  const projectConfig = useMemo(
    () =>
      idx
        ? atomWithStorage<ProjectSettings>(
            `project-${id}`,
            settingKey(idx.id, idx.key),
          )
        : atom<ProjectSettings>(settingKey(NaN.toString(), 'Not Found')),
    [id, idx],
  );

  const [project, setProjectPrime] = useAtom(projectConfig);
  const setProject = useCallback(
    (p: ProjectSettings) => {
      const i = index.findIndex(f => f.id === project.id);
      if (i >= 0) {
        setIndex([
          ...index.slice(0, i),
          {id: p.id, key: p.name},
          ...index.slice(i + 1),
        ]);
        setProjectPrime(p);
      } else {
        throw new Error(`Project "${id}" not found`);
      }
    },
    [id, index, project, setIndex, setProjectPrime],
  );

  if (project === undefined) {
    throw new Error(`Project "${id}" not found`);
  }

  return [project, setProject] as const;
}
