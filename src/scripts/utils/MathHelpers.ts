/**
 * Return a sum of all numbers provided
 */
export const sum = (numbers: number[]) =>
  numbers.reduce((acc, val) => acc + val);

/**
 * Return a random number within defined range
 *
 * For more info, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
export const getRandomNumber = (min: number, max: number = 0) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
