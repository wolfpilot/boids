import * as mathHelper from "./mathHelper"

describe("mathHelper", () => {
  it("should sum up numbers", () => {
    const nums = [-3, -2, -1, 0, 1, 2, 3, 4, 5]

    const result = mathHelper.sum(nums)
    const expected = 9

    expect(result).toBe(expected)
  })

  it("should return a random number in the specified boundaries", () => {
    const min = -2
    const max = 3

    const result = mathHelper.getRandomNumber(min, max)
    const isConstrained = result >= min && result <= max

    expect(isConstrained).toBe(true)
  })
})
