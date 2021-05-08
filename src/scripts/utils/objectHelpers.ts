export const isObject = (arg: unknown): boolean =>
  arg !== null && typeof arg === "object" && Array.isArray(arg) === false
