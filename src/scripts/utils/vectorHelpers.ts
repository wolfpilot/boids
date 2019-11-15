import Vector, { IVector } from "../geometry/Vector";

// Utils
import { sum, limitNumber } from "./MathHelpers";

// Returns a new vector that adds v2 to v1
export const add = (v1: IVector, v2: IVector) => {
  return new Vector(v1.x + v2.x, v1.y + v2.y);
};

// Returns a new vector pointing to target v1 vector
export const subtract = (v1: IVector, v2: IVector) => {
  return new Vector(v1.x - v2.x, v1.y - v2.y);
};

export const multiply = (vector: IVector, factor: number) => {
  const { x, y } = vector;

  const newX = x * factor;
  const newY = y * factor;

  return new Vector(newX, newY);
};

export const divide = (vector: IVector, factor: number) => {
  const { x, y } = vector;

  const newX = x / factor;
  const newY = y / factor;

  return new Vector(newX, newY);
};

// Calculate the magnitude (length) of a vector
export const mag = (x: number, y: number) => {
  return Math.sqrt(x * x + y * y);
};

export const normalize = (v: IVector) => {
  const magnitude = mag(v.x, v.y);

  if (magnitude === 0) {
    return new Vector(1, 0);
  } else {
    return divide(v, magnitude);
  }
};

// Return a new vector where the X and Y are limited by an absolute number
export const limitXY = (vector: IVector, xLimit: number, yLimit: number) => {
  const x = limitNumber(vector.x, xLimit);
  const y = limitNumber(vector.y, yLimit);

  return new Vector(x, y);
};

// Return the combination of all forces applied to an initial force vector
export const applyForces = (v: IVector, vectors: IVector[]) => {
  const xCoords = vectors.map((v: IVector) => v.x);
  const yCoords = vectors.map((v: IVector) => v.y);

  return new Vector(v.x + sum(xCoords), v.y + sum(yCoords));
};
