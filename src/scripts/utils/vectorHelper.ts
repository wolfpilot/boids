import Vector, { IVector } from "../geometry/Vector"

// Utils
import { sum } from "./mathHelper"

// Returns a new vector that adds v2 to v1
export const add = (v1: IVector, v2: IVector): Vector =>
  new Vector(v1.x + v2.x, v1.y + v2.y)

// Returns a new vector pointing to target v1 vector
export const subtract = (v1: IVector, v2: IVector): Vector =>
  new Vector(v1.x - v2.x, v1.y - v2.y)

export const multiply = (vector: IVector, factor: number): Vector => {
  const { x, y } = vector

  const newX = x * factor
  const newY = y * factor

  return new Vector(newX, newY)
}

export const divide = (vector: IVector, factor: number): Vector => {
  const { x, y } = vector

  const newX = x / factor
  const newY = y / factor

  return new Vector(newX, newY)
}

// Calculate the magnitude (length) of a vector
export const mag = (v: IVector): number => Math.sqrt(v.x * v.x + v.y * v.y)

export const magSq = (v: IVector): number => v.x * v.x + v.y * v.y

export const normalize = (v: IVector): Vector => {
  const magnitude = mag(v)

  if (magnitude === 0) {
    return new Vector(1, 0)
  } else {
    return divide(v, magnitude)
  }
}

// Return a new vector where the X and Y are limited by an absolute number
export const limitMagnitude = (v: IVector, max: number): Vector => {
  if (mag(v) > max) {
    const normV = normalize(v)

    return multiply(normV, max)
  } else {
    return v
  }
}

// Return the combination of all forces applied to an initial force vector
export const applyForces = (v: IVector, vectors: IVector[]): Vector => {
  const xCoords = vectors.map((v: IVector) => v.x)
  const yCoords = vectors.map((v: IVector) => v.y)

  return new Vector(v.x + sum(xCoords), v.y + sum(yCoords))
}
