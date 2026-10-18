import * as vectorHelper from "./vectorHelper"

// Geometry
import VectorImpl from "../geometry/Vector"

describe("vectorHelper", () => {
  it("should clone a vector correctly", () => {
    const v = new VectorImpl(0, 5)

    const result = vectorHelper.clone(v)
    const expected = new VectorImpl(0, 5)

    expect(result).toStrictEqual(expected)
  })

  it("should add two vectors correctly", () => {
    const v1 = new VectorImpl(0, 5)
    const v2 = new VectorImpl(-10, 25)

    const result = vectorHelper.add(v1, v2)
    const expected = new VectorImpl(-10, 30)

    expect(result).toStrictEqual(expected)
  })

  it("should subtract two vectors correctly", () => {
    const v1 = new VectorImpl(0, 5)
    const v2 = new VectorImpl(-10, 25)

    const result = vectorHelper.subtract(v1, v2)
    const expected = new VectorImpl(10, -20)

    expect(result).toStrictEqual(expected)
  })

  it("should multiply correctly", () => {
    const v = new VectorImpl(0, 5)
    const multiplier = 5

    const result = vectorHelper.multiply(v, multiplier)
    const expected = new VectorImpl(0, 25)

    expect(result).toStrictEqual(expected)
  })

  it("should divide correctly", () => {
    const v = new VectorImpl(0, 5)
    const multiplier = 5

    const result = vectorHelper.divide(v, multiplier)
    const expected = new VectorImpl(0, 1)

    expect(result).toStrictEqual(expected)
  })

  it("should calculate the magnitude of a vector", () => {
    const v = new VectorImpl(0, 5)

    const result = vectorHelper.mag(v)
    const expected = 5

    expect(result).toBe(expected)
  })

  it("should calculate the squared magnitude of a vector", () => {
    const v = new VectorImpl(0, 5)

    const result = vectorHelper.magSq(v)
    const expected = 25

    expect(result).toBe(expected)
  })

  it("should normalize a 0 length vector", () => {
    const v = new VectorImpl(0, 0)

    const result = vectorHelper.normalize(v)
    const expected = new VectorImpl(0, 0)

    expect(result).toStrictEqual(expected)
  })

  it("should normalize a non-0 length vector", () => {
    const v = new VectorImpl(-10, 25)

    const result = vectorHelper.normalize(v)
    const expected = vectorHelper.divide(v, vectorHelper.mag(v))

    expect(result).toStrictEqual(expected)
  })

  it("should limit the magnitude of a vector", () => {
    const v1 = new VectorImpl(0, 0)
    const v2 = new VectorImpl(-10, 25)
    const max = 2.5

    const result1 = vectorHelper.limitMagnitude(v1, max)
    const expected1 = new VectorImpl(0, 0)

    expect(result1).toStrictEqual(expected1)

    const result2 = vectorHelper.limitMagnitude(v2, max)
    const expected2 = vectorHelper.multiply(vectorHelper.normalize(v2), max)

    expect(result2).toStrictEqual(expected2)
  })

  it("should set the magnitude of a provided vector", () => {
    const v = new VectorImpl(-10, 25)

    const result = vectorHelper.mag(vectorHelper.setMagnitude(v, 3))
    const expected = 3

    expect(result).toBeCloseTo(expected)
  })

  it("should not create a direction when setting the magnitude of a zero vector", () => {
    expect(vectorHelper.setMagnitude(new VectorImpl(0, 0), 3)).toStrictEqual(
      new VectorImpl(0, 0)
    )
  })

  it("should set a vector's angle without changing its length", () => {
    const v = new VectorImpl(5, 10)

    const originalAngle = Math.atan2(v.y, v.x)
    const result = vectorHelper.setAngle(v, originalAngle + 2 * Math.PI)

    expect(result).toBe(v)
    expect(result.x).toBeCloseTo(v.x)
    expect(result.y).toBeCloseTo(v.y)
  })

  it("should apply forces to the vector", () => {
    const v = new VectorImpl(-10, 25)
    const forces = [
      new VectorImpl(2, 5),
      new VectorImpl(-7, 0),
      new VectorImpl(20, 0.7),
    ]

    const result = vectorHelper.applyForces(v, forces)
    const expected = new VectorImpl(5, 30.7)

    expect(result).toStrictEqual(expected)
  })
})
