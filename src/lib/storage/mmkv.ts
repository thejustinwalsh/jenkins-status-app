import {MMKV} from 'react-native-mmkv';
import {
  atomWithStorage as atomWithStorageProxy,
  createJSONStorage,
} from 'jotai/utils';

export const mmkv = new MMKV();

function getItem<T>(key: string): T | null {
  const value = mmkv.getString(key);
  return value ? JSON.parse(value) : null;
}

function setItem<T>(key: string, value: T): void {
  mmkv.set(key, JSON.stringify(value));
}

function removeItem(key: string): void {
  mmkv.delete(key);
}

function clearAll(): void {
  mmkv.clearAll();
}

export const atomWithStorage = <T>(key: string, initialValue: T) =>
  atomWithStorageProxy<T>(
    key,
    initialValue,
    createJSONStorage<T>(() => ({
      getItem,
      setItem,
      removeItem,
      clearAll,
    })),
  );
