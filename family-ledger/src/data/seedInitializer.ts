/**
 * Utility for initializing and managing seed data across features
 * Provides a consistent interface for localStorage management
 */

const memoryStorage = new Map<string, string>();

const isStorageAvailable = () => {
  return (
    typeof window !== 'undefined' &&
    typeof window.localStorage !== 'undefined' &&
    typeof window.localStorage.getItem === 'function' &&
    typeof window.localStorage.setItem === 'function' &&
    typeof window.localStorage.removeItem === 'function'
  );
};

const getStorage = () => {
  if (isStorageAvailable()) {
    return window.localStorage;
  }

  return {
    getItem: (key: string) => {
      return memoryStorage.get(key) ?? null;
    },
    setItem: (key: string, value: string) => {
      memoryStorage.set(key, value);
    },
    removeItem: (key: string) => {
      memoryStorage.delete(key);
    },
  };
};

/**
 * Generic function to read data from storage with seed fallback
 * @param storageKey - The key to store data under
 * @param seedData - Initial seed data to use if storage is empty
 * @param sortFn - Optional function to sort the data
 * @returns Data from storage or seed data
 */
export const readFromStorage = <T>(
  storageKey: string,
  seedData: T[],
  sortFn?: (data: T[]) => T[],
): T[] => {
  const storage = getStorage();
  const storedData = storage.getItem(storageKey);

  if (!storedData) {
    const initialData = sortFn ? sortFn(seedData) : seedData;
    storage.setItem(storageKey, JSON.stringify(initialData));
    return cloneData(initialData);
  }

  const parsedData = JSON.parse(storedData) as T[];
  return sortFn ? sortFn(parsedData) : parsedData;
};

/**
 * Generic function to write data to storage
 * @param storageKey - The key to store data under
 * @param data - Data to store
 * @param sortFn - Optional function to sort the data before storing
 * @returns The stored data
 */
export const writeToStorage = <T>(
  storageKey: string,
  data: T[],
  sortFn?: (data: T[]) => T[],
): T[] => {
  const storage = getStorage();
  const nextData = sortFn ? sortFn(data) : data;
  storage.setItem(storageKey, JSON.stringify(nextData));
  return nextData;
};

/**
 * Clone an array of objects to avoid mutation
 */
export const cloneData = <T>(data: T[]): T[] => {
  return data.map((item) => ({ ...item }));
};

/**
 * Clear stored data and reset to seed
 */
export const resetStorageForKey = (storageKey: string) => {
  memoryStorage.delete(storageKey);

  if (isStorageAvailable()) {
    window.localStorage.removeItem(storageKey);
  }
};

/**
 * Clear all stored data
 */
export const resetAllStorage = () => {
  memoryStorage.clear();

  if (isStorageAvailable()) {
    window.localStorage.clear();
  }
};
