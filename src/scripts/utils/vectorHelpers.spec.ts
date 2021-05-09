import * as vectorHelpers from "./vectorHelpers"

// Geometry
import Vector from "../geometry/Vector"

describe("vectorHelpers", () => {
  it("should add two vectors correctly", () => {
    const v1 = new Vector(0, 5)
    const v2 = new Vector(-10, 25)

    const result = vectorHelpers.add(v1, v2)
    const expected = new Vector(-10, 30)

    expect(result).toStrictEqual(expected)
  })

  it("should subtract two vectors correctly", () => {
    const v1 = new Vector(0, 5)
    const v2 = new Vector(-10, 25)

    const result = vectorHelpers.subtract(v1, v2)
    const expected = new Vector(10, -20)

    expect(result).toStrictEqual(expected)
  })

  it("should multiply correctly", () => {
    const v = new Vector(0, 5)
    const multiplier = 5

    const result = vectorHelpers.multiply(v, multiplier)
    const expected = new Vector(0, 25)

    expect(result).toStrictEqual(expected)
  })

  it("should divide correctly", () => {
    const v = new Vector(0, 5)
    const multiplier = 5

    const result = vectorHelpers.divide(v, multiplier)
    const expected = new Vector(0, 1)

    expect(result).toStrictEqual(expected)
  })

  it("should calculate the magnitude of a vector", () => {
    const v = new Vector(0, 5)

    const result = vectorHelpers.mag(v)
    const expected = 5

    expect(result).toBe(expected)
  })

  it("should normalize a 0 length vector", () => {
    const v = new Vector(0, 0)

    const result = vectorHelpers.normalize(v)
    const expected = new Vector(1, 0)

    expect(result).toStrictEqual(expected)
  })

  it("should normalize a non-0 length vector", () => {
    const v = new Vector(-10, 25)

    const result = vectorHelpers.normalize(v)
    const expected = vectorHelpers.divide(v, vectorHelpers.mag(v))

    expect(result).toStrictEqual(expected)
  })

  it("should limit the magnitude of a vector", () => {
    const v1 = new Vector(0, 0)
    const v2 = new Vector(-10, 25)
    const max = 2.5

    const result1 = vectorHelpers.limitMagnitude(v1, max)
    const expected1 = new Vector(0, 0)

    expect(result1).toStrictEqual(expected1)

    const result2 = vectorHelpers.limitMagnitude(v2, max)
    const expected2 = vectorHelpers.multiply(vectorHelpers.normalize(v2), max)

    expect(result2).toStrictEqual(expected2)
  })

  it("should apply forces to the vector", () => {
    const v = new Vector(-10, 25)
    const forces = [new Vector(2, 5), new Vector(-7, 0), new Vector(20, 0.7)]

    const result = vectorHelpers.applyForces(v, forces)
    const expected = new Vector(5, 30.7)

    expect(result).toStrictEqual(expected)
  })
})
