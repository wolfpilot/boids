// Types
import { BoidEntity } from "../types/entities"
import { Vector } from "../types/geometry"

// Config
import { config as boidConfig } from "../actors/Boid/config"

// Utils
import { add, subtract, multiply, divide, mag } from "../utils/vectorHelper"

// Geometry
import VectorImpl from "../geometry/Vector"

interface Options {
  boids: BoidEntity[]
  source: BoidEntity
}

// Utils
const isInRange = (target: BoidEntity, source: BoidEntity): boolean => {
  const nLocation = subtract(target.state.location, source.state.location)
  const nDistance = mag(nLocation)

  return nDistance > 0 && nDistance < source.traits.alignmentAreaSize
}

// Find the average steering vector that will align with the rest of the "pack"
export const align = ({ boids, source }: Options): Vector => {
  let align = new VectorImpl(0, 0)

  const neighbours = boids.filter((boid) => isInRange(boid, source))

  if (neighbours.length === 0) return align

  // Calculate the overall group direction
  const groupVelocity = neighbours
    .map((boid) => boid.state.velocity)
    .reduce((acc, val) => add(acc, val))

  const averageVelocity = divide(groupVelocity, neighbours.length)

  align = subtract(averageVelocity, source.state.velocity)
  align = multiply(align, boidConfig.alignmentFactor)

  return align
}
