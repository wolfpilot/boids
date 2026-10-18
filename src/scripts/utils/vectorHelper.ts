// Types
import { Vector } from "../types/geometry"

// Utils
import { sum } from "./mathHelper"

// Geometry
import VectorImpl from "../geometry/Vector"

// Returns a new copy of the supplied vector
export const clone = (v: Vector): Vector => new VectorImpl(v.x, v.y)

// Returns a new vector that adds v2 to v1
export const add = (v1: Vector, v2: Vector): Vector =>
  new VectorImpl(v1.x + v2.x, v1.y + v2.y)

// Returns a new vector pointing to target v1 vector
export const subtract = (v1: Vector, v2: Vector): Vector =>
  new VectorImpl(v1.x - v2.x, v1.y - v2.y)

export const multiply = (v: Vector, factor: number): Vector => {
  const { x, y } = v

  const newX = x * factor
  const newY = y * factor

  return new VectorImpl(newX, newY)
}

export const divide = (vector: Vector, factor: number): Vector => {
  const { x, y } = vector

  const newX = x / factor
  const newY = y / factor

  return new VectorImpl(newX, newY)
}

// Calculate the magnitude (length) of a vector
export const mag = (v: Vector): number => Math.sqrt(v.x * v.x + v.y * v.y)

export const magSq = (v: Vector): number => v.x * v.x + v.y * v.y

export const normalize = (v: Vector): Vector => {
  const magnitude = mag(v)

  if (magnitude === 0) {
    return new VectorImpl(0, 0)
  } else {
    return divide(v, magnitude)
  }
}

// Return a new vector where the X and Y are limited by an absolute number
export const limitMagnitude = (v: Vector, max: number): Vector => {
  if (mag(v) > max) {
    const normV = normalize(v)

    return multiply(normV, max)
  } else {
    return new VectorImpl(v.x, v.y)
  }
}

export const setMagnitude = (v: Vector, factor: number): Vector => {
  const normV = normalize(v)
  const multV = multiply(normV, factor)

  v.x = multV.x
  v.y = multV.y

  return v
}

export const setAngle = (v: Vector, radians: number) => {
  const len: number = mag(v)

  v.x = Math.cos(radians) * len
  v.y = Math.sin(radians) * len

  return v
}

// Return the combination of all forces applied to an initial force vector
export const applyForces = (v: Vector, vectors: Vector[]): Vector => {
  const xCoords = vectors.map((v: Vector) => v.x)
  const yCoords = vectors.map((v: Vector) => v.y)

  return new VectorImpl(v.x + sum(xCoords), v.y + sum(yCoords))
}
