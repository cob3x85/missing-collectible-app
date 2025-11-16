import { useEffect, useState } from 'react';

/**
 * Custom hook to debounce a value over a specified delay.
 * @param input search term
 * @param delay in milliseconds
 * @returns debouncedValue the debounced value
 */
export const useDebounceValue = (input: string = '', delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(input);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(input);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [input]);

  return { debouncedValue };
};
