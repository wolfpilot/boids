/**
 * Return a sum of all numbers provided
 */
export const sum = (numbers: number[]): number =>
  numbers.reduce((acc, val) => acc + val);

/**
 * Return a random number within defined range
 *
 * For more info, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
export const getRandomNumber = (min: number, max = 0): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;
