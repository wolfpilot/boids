// Types
import { IBoidEntity } from "../types/entities"

// Config
import { config as boidConfig } from "../actors/Boid/config"

// Utils
import {
  add,
  subtract,
  multiply,
  divide,
  normalize,
  mag,
} from "../utils/vectorHelper"

// Geometry
import Vector from "../geometry/Vector"

interface IOptions {
  boids: IBoidEntity[]
  source: IBoidEntity
}

// Find the average steering vector that will align with the rest of the "pack"
export const align = ({ boids, source }: IOptions): Vector => {
  let align = new Vector(0, 0)

  // Get all other boids that can be found in the designated surrounding area
  const neighbours = boids.filter((boid) => {
    // Get a vector to the neighbour's position
    const nLocation = subtract(boid.state.location, source.state.location)

    // Calculate the vector's length
    const nDistance = mag(nLocation)

    if (nDistance > 0 && nDistance < source.config.awarenessAreaSize) {
      return boid
    }
  })

  // Check if any neighbors are found within the acceptable vicinity
  if (neighbours.length === 0) {
    return align
  }

  // Calculate the overall group direction
  const groupVelocity = neighbours
    .map((boid) => boid.state.velocity)
    .reduce((acc, val) => add(acc, val))

  const normGroupVelocity = normalize(groupVelocity)
  const averageVelocity = divide(normGroupVelocity, neighbours.length)

  align = subtract(averageVelocity, source.state.velocity)
  align = multiply(align, boidConfig.alignmentFactor)

  return align
}
