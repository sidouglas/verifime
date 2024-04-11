export const uuid = () => crypto.randomUUID();

export const isObjectEmpty = (obj: Record<string, unknown>) =>
  Object.keys(obj).length === 0;

export function roundNumber(value: number | string, decimalPlaces = 0) {
  const num = Number(value);
  var p = Math.pow(10, decimalPlaces);
  var n = num * p * (1 + Number.EPSILON);
  return Math.round(n) / p;
}
