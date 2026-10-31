// Utils
import { getRandomNumber } from "@utils/mathHelper"

// Actors
import BoidImpl from "@actors/Boid/Boid"

interface GenerateRandomizedBoidsOptions {
  total: number
  ctx: CanvasRenderingContext2D
  maxX: number
  maxY: number
  minSize: number
  maxSize: number
  maxSpeedMultiplier: number
  brakingMultiplier: number
  alignmentMultiplier: number
  cohesionMultiplier: number
  seekingMultiplier: number
  fleeingMultiplier: number
  separationMultiplier: number
  frictionMultiplier: number
  colors: string[]
}

export const generateRandomizedBoids = ({
  total,
  ctx,
  maxX,
  maxY,
  minSize,
  maxSize,
  maxSpeedMultiplier,
  frictionMultiplier,
  brakingMultiplier,
  alignmentMultiplier,
  cohesionMultiplier,
  seekingMultiplier,
  fleeingMultiplier,
  separationMultiplier,
  colors,
}: GenerateRandomizedBoidsOptions): BoidImpl[] => {
  if (total < 1) {
    throw new Error("Total number should be a minimum of 1.")
  }

  if (minSize < 0 || maxSize < minSize) {
    throw new Error("The min or max size params are incorrect.")
  }

  return [...new Array(total)].map((_, index) => {
    const options = {
      id: index,
      ctx,
      x: getRandomNumber(0, maxX),
      y: getRandomNumber(0, maxY),
      size: getRandomNumber(minSize, maxSize),
      maxSpeedMultiplier,
      frictionMultiplier,
      brakingMultiplier,
      alignmentMultiplier,
      cohesionMultiplier,
      seekingMultiplier,
      fleeingMultiplier,
      separationMultiplier,
      color: colors[getRandomNumber(0, colors.length - 1)],
    }

    return new BoidImpl(options)
  })
}
