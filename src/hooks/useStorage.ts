import {useCallback, useMemo} from 'react';
import {atom, useAtom} from 'jotai';

import {atomWithStorage, idgen} from '@app/lib/storage';

export type StorageIndex = {
  id: string;
  key: string;
};

export function useStorage(prefix: string) {
  const storageConfig = useMemo(
    () => atomWithStorage<StorageIndex[]>(prefix, []),
    [prefix],
  );

  const [storage, setStorage] = useAtom(storageConfig);
  const addStorage = useCallback(
    (key: string) => {
      setStorage([...storage, {id: idgen(), key}]);
    },
    [storage, setStorage],
  );
  return [storage, setStorage, addStorage] as const;
}

export function useStorageItem<Value extends StorageIndex>(
  prefix: string,
  id: string,
  defaultItem: Value,
) {
  const [index, setIndex] = useStorage(prefix);
  const idx = useMemo(() => index.find(i => i.id === id), [index, id]);
  const storageConfig = useMemo(
    () =>
      idx
        ? atomWithStorage<Value>(`${prefix}-${id}`, defaultItem)
        : atom<Value>(defaultItem),
    [defaultItem, id, idx, prefix],
  );

  const [storage, setStoragePrime] = useAtom(storageConfig);
  const setStorage = useCallback(
    (v: Value) => {
      const i = index.findIndex(f => f.id === v.id);
      if (i >= 0) {
        setIndex([
          ...index.slice(0, i),
          {id: v.id, key: v.key},
          ...index.slice(i + 1),
        ]);
        setStoragePrime(v);
      } else {
        throw new Error(`Storage Item "${prefix}-${id}" not found`);
      }
    },
    [index, setIndex, setStoragePrime, prefix, id],
  );

  if (storage === undefined) {
    throw new Error(`Storage Item "${prefix}-${id}" not found`);
  }

  return [storage, setStorage] as const;
}
