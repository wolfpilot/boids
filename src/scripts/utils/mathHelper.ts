/**
 * Return a sum of all numbers provided
 */
export const sum = (numbers: number[]): number =>
  numbers.reduce((acc, val) => acc + val)

/**
 * Return a number mapped from one range to another
 *
 * For more info, see:
 * https://stackoverflow.com/questions/5731863/mapping-a-numeric-range-onto-another
 */
export const mapFromToRange = (
  num: number,
  inputStart: number,
  inputEnd: number,
  outputStart: number,
  outputEnd: number
): number => {
  const dIn = inputEnd - inputStart
  const dOut = outputEnd - outputStart

  return outputStart + (dOut / dIn) * (num - inputStart)
}

/**
 * Return a random number within defined range
 *
 * For more info, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
export const getRandomNumber = (min: number, max = 0): number =>
  Math.floor(Math.random() * (max - min + 1)) + min
