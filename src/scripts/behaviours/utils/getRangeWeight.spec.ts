import { getRangeWeight } from "./getRangeWeight"

describe("getRangeWeight", () => {
  it("retains full influence through ninety percent of a radius", () => {
    expect(getRangeWeight(1, 10)).toBe(1)
    expect(getRangeWeight(9, 10)).toBe(1)
  })

  it("eases to zero at the radius", () => {
    expect(getRangeWeight(9.5, 10)).toBe(0.5)
    expect(getRangeWeight(9.99, 10)).toBeGreaterThan(0)
    expect(getRangeWeight(9.99, 10)).toBeLessThan(0.001)
    expect(getRangeWeight(10, 10)).toBe(0)
  })

  it("ignores coincident positions and zero radii", () => {
    expect(getRangeWeight(0, 10)).toBe(0)
    expect(getRangeWeight(1, 0)).toBe(0)
  })
})
