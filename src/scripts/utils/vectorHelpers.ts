import Vector, { IVector } from "../geometry/Vector";

// Utils
import { limitNumber } from "./MathHelpers";

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
export const limitXY = (vector: IVector, limit: number) => {
  const x = limitNumber(vector.x, limit);
  const y = limitNumber(vector.y, limit);

  return new Vector(x, y);
};
