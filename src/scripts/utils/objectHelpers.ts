export const isObject = (arg: any): boolean =>
  arg !== null && typeof arg === "object" && Array.isArray(arg) === false;
