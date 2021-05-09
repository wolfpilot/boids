import * as objectHelper from "./objectHelper"

describe("objectHelper", () => {
  it("should return whether the argument is a object", () => {
    expect(objectHelper.isObject(undefined)).toBe(false)
    expect(objectHelper.isObject(null)).toBe(false)
    expect(objectHelper.isObject(0)).toBe(false)
    expect(objectHelper.isObject(100)).toBe(false)
    expect(objectHelper.isObject("")).toBe(false)
    expect(objectHelper.isObject("test")).toBe(false)
    expect(objectHelper.isObject([1, 2, 3])).toBe(false)
    expect(objectHelper.isObject({})).toBe(true)
    expect(objectHelper.isObject({ x: 0, y: 10 })).toBe(true)
  })
})
