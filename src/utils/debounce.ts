export const debounce = <T>(func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: T[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
