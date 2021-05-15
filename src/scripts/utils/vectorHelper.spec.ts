import * as vectorHelper from "./vectorHelper"

// Geometry
import Vector from "../geometry/Vector"

describe("vectorHelper", () => {
  it("should add two vectors correctly", () => {
    const v1 = new Vector(0, 5)
    const v2 = new Vector(-10, 25)

    const result = vectorHelper.add(v1, v2)
    const expected = new Vector(-10, 30)

    expect(result).toStrictEqual(expected)
  })

  it("should subtract two vectors correctly", () => {
    const v1 = new Vector(0, 5)
    const v2 = new Vector(-10, 25)

    const result = vectorHelper.subtract(v1, v2)
    const expected = new Vector(10, -20)

    expect(result).toStrictEqual(expected)
  })

  it("should multiply correctly", () => {
    const v = new Vector(0, 5)
    const multiplier = 5

    const result = vectorHelper.multiply(v, multiplier)
    const expected = new Vector(0, 25)

    expect(result).toStrictEqual(expected)
  })

  it("should divide correctly", () => {
    const v = new Vector(0, 5)
    const multiplier = 5

    const result = vectorHelper.divide(v, multiplier)
    const expected = new Vector(0, 1)

    expect(result).toStrictEqual(expected)
  })

  it("should calculate the magnitude of a vector", () => {
    const v = new Vector(0, 5)

    const result = vectorHelper.mag(v)
    const expected = 5

    expect(result).toBe(expected)
  })

  it("should calculate the squared magnitude of a vector", () => {
    const v = new Vector(0, 5)

    const result = vectorHelper.magSq(v)
    const expected = 25

    expect(result).toBe(expected)
  })

  it("should normalize a 0 length vector", () => {
    const v = new Vector(0, 0)

    const result = vectorHelper.normalize(v)
    const expected = new Vector(1, 0)

    expect(result).toStrictEqual(expected)
  })

  it("should normalize a non-0 length vector", () => {
    const v = new Vector(-10, 25)

    const result = vectorHelper.normalize(v)
    const expected = vectorHelper.divide(v, vectorHelper.mag(v))

    expect(result).toStrictEqual(expected)
  })

  it("should limit the magnitude of a vector", () => {
    const v1 = new Vector(0, 0)
    const v2 = new Vector(-10, 25)
    const max = 2.5

    const result1 = vectorHelper.limitMagnitude(v1, max)
    const expected1 = new Vector(0, 0)

    expect(result1).toStrictEqual(expected1)

    const result2 = vectorHelper.limitMagnitude(v2, max)
    const expected2 = vectorHelper.multiply(vectorHelper.normalize(v2), max)

    expect(result2).toStrictEqual(expected2)
  })

  it("should set the magnitude of a provided vector", () => {
    const v = new Vector(-10, 25)

    const result = vectorHelper.mag(vectorHelper.setMagnitude(v, 3))
    const expected = 3

    expect(result).toBeCloseTo(expected)
  })

  it("should apply forces to the vector", () => {
    const v = new Vector(-10, 25)
    const forces = [new Vector(2, 5), new Vector(-7, 0), new Vector(20, 0.7)]

    const result = vectorHelper.applyForces(v, forces)
    const expected = new Vector(5, 30.7)

    expect(result).toStrictEqual(expected)
  })
})
