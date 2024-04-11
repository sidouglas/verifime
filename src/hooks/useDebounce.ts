import { useEffect, useMemo, useRef } from 'react';

import { debounce } from '@/utils/debounce';

export const useDebounce = <T extends () => void>(callback: T, timer = 500) => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, timer);
  }, [timer]);

  return debouncedCallback;
};
