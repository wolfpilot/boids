// Utils
import { getRandomNumber } from "./mathHelper"

// Actors
import Boid from "../actors/Boid/Boid"

export interface IGenerateBoidOptions {
  id: number
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  size: number
  brakingFactor: number
  awarenessFactor: number
  color: string
}

export interface IGenerateRandomizedBoidsOptions {
  ctx: CanvasRenderingContext2D
  total: number
  maxX: number
  maxY: number
  minSize: number
  maxSize: number
  brakingFactor: number
  awarenessFactor: number
  colors: string[]
}

export const generateBoid = ({
  id,
  ctx,
  x,
  y,
  size,
  brakingFactor,
  awarenessFactor,
  color,
}: IGenerateBoidOptions): Boid => {
  const options = {
    id,
    ctx,
    x,
    y,
    size,
    brakingDistance: size * brakingFactor,
    awarenessAreaSize: size * awarenessFactor,
    color,
  }

  return new Boid(options)
}

export const generateRandomizedBoids = ({
  ctx,
  total,
  maxX,
  maxY,
  minSize,
  maxSize,
  brakingFactor,
  awarenessFactor,
  colors,
}: IGenerateRandomizedBoidsOptions): Boid[] => {
  return [...new Array(total)].map((_, index) => {
    const options = {
      id: index,
      ctx,
      x: getRandomNumber(0, maxX),
      y: getRandomNumber(0, maxY),
      size: getRandomNumber(minSize, maxSize),
      brakingFactor,
      awarenessFactor,
      color: colors[getRandomNumber(0, colors.length - 1)],
    }

    return generateBoid(options)
  })
}
