import * as mathHelper from "@utils/mathHelper"

describe("mathHelper", () => {
  it("should sum up numbers", () => {
    const nums = [-3, -2, -1, 0, 1, 2, 3, 4, 5]

    const result = mathHelper.sum(nums)
    const expected = 9

    expect(result).toBe(expected)
  })

  it("should map a specified number to a new range", () => {
    const result1 = mathHelper.mapFromToRange(0, 0, 128, 500, 2500)
    expect(result1).toBe(500)

    const result2 = mathHelper.mapFromToRange(64, 0, 128, 500, 2500)
    expect(result2).toBe(1500)

    const result3 = mathHelper.mapFromToRange(128, 0, 128, 500, 2500)
    expect(result3).toBe(2500)

    const result4 = mathHelper.mapFromToRange(256, 0, 128, 500, 2500)
    expect(result4).toBe(4500)
  })

  it("should return a random number in the specified boundaries", () => {
    const min = -2
    const max = 3

    const result = mathHelper.getRandomNumber(min, max)
    const isConstrained = result >= min && result <= max

    expect(isConstrained).toBe(true)
  })

  it("eases between two boundaries and clamps outside them", () => {
    expect(mathHelper.smoothstep(10, 20, 5)).toBe(0)
    expect(mathHelper.smoothstep(10, 20, 10)).toBe(0)
    expect(mathHelper.smoothstep(10, 20, 15)).toBe(0.5)
    expect(mathHelper.smoothstep(10, 20, 20)).toBe(1)
    expect(mathHelper.smoothstep(10, 20, 25)).toBe(1)
  })
})
