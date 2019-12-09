export const isObject = (arg: any) =>
  arg !== null && typeof arg === "object" && Array.isArray(arg) === false;
