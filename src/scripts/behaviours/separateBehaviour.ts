// Types
import { IBoidEntity } from "../types/entities"

// Utils
import { add, subtract, multiply, normalize, mag } from "../utils/vectorHelper"

// Geometry
import Vector from "../geometry/Vector"

// Actors
import { IBoid } from "../actors/Boid/Boid"

interface IOptions {
  boids: IBoidEntity[]
  source: IBoid
}

// Keep a distance from neighbouring boids
export const separate = ({ boids, source }: IOptions): Vector => {
  let separate = new Vector(0, 0)

  // Get all other boids that can be found in the designated surrounding area
  const neighbours = boids.filter((boid) => {
    const nLocation = subtract(boid.state.location, source.state.location)
    const nDistance = mag(nLocation)

    if (
      nDistance > 0 &&
      nDistance < source.config.separationAreaSize + boid.config.size
    ) {
      return boid
    }
  })

  // Check if any neighbors are found within the acceptable vicinity
  if (neighbours.length === 0) {
    return separate
  }

  // Calculate the forces necessary to separate this from other boids
  neighbours.forEach((boid) => {
    let desired = subtract(source.state.location, boid.state.location)

    // Compute directional unit vector
    desired = normalize(desired)

    // Scale force proportionally to distance & radius
    desired = multiply(desired, source.config.maxSpeed)
    // desired.scale utils.map distSq, radiiSq, 0, 0, agent.maxSpeed

    separate = add(separate, desired)
  })

  return separate
}
