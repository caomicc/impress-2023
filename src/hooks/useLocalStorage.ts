import React, { useCallback, useState } from 'react';

/**
 * useLocalStorage is like React.useState, but it persists the value in the
 * device's `localStorage`, so it comes back even after reloading the page.
 *
 * Adapted from https://usehooks.com/useLocalStorage/.
 */
let storageListeners: any = [];

export function useLocalStorage(key: unknown, initialValue: unknown) {
  const loadValue = useCallback(() => {
    if (typeof localStorage === 'undefined') {
      return initialValue;
    }
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(loadValue);

  const setValue = useCallback(
    (value: any) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
        storageListeners.forEach((l) => l());
      } catch (error) {
        console.error(error);
      }
    },
    [key],
  );

  const reloadValue = React.useCallback(() => {
    setStoredValue(loadValue());
  }, [loadValue, setStoredValue]);

  // Listen for changes elsewhere on the page, and update here too!
  React.useEffect(() => {
    storageListeners.push(reloadValue);
    return () => {
      storageListeners = storageListeners.filter((l) => l !== reloadValue);
    };
  }, [reloadValue]);

  // Listen for changes in other tabs, and update here too! (This does not
  // catch same-page updates!)
  React.useEffect(() => {
    window.addEventListener('storage', reloadValue);
    return () => window.removeEventListener('storage', reloadValue);
  }, [reloadValue]);

  return [storedValue, setValue];
}
