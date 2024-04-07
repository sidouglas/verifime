export const uuid = () => crypto.randomUUID();

export const isObjectEmpty = (obj: Record<string, unknown>) =>
  Object.keys(obj).length === 0;
