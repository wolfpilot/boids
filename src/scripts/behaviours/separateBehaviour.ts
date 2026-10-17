// Types
import { IBoidEntity } from "../types/entities"

// Config
import { config as boidConfig } from "../actors/Boid/config"

// Utils
import {
  add,
  subtract,
  multiply,
  normalize,
  mag,
  limitMagnitude,
} from "../utils/vectorHelper"

// Geometry
import Vector from "../geometry/Vector"

interface IOptions {
  boids: IBoidEntity[]
  source: IBoidEntity
}

// Utils
const isInRange = (target: IBoidEntity, source: IBoidEntity): boolean => {
  const nLocation = subtract(target.state.location, source.state.location)
  const nDistance = mag(nLocation)

  return (
    nDistance > 0 &&
    nDistance < source.traits.separationAreaSize + target.traits.size
  )
}

// Keep a distance from neighbouring boids
export const separate = ({ boids, source }: IOptions): Vector => {
  let separate = new Vector(0, 0)

  const neighbours = boids.filter((boid) => isInRange(boid, source))

  // Check if any neighbors are found within the acceptable vicinity
  if (neighbours.length === 0) return separate

  // Calculate the forces necessary to separate this from other boids
  neighbours.forEach((boid) => {
    let desired = subtract(source.state.location, boid.state.location)
    const distance = mag(desired)
    const radius = source.traits.separationAreaSize + boid.traits.size

    // Compute directional unit vector
    desired = normalize(desired)

    // Increase separation as the neighbour gets closer.
    const strength = (radius - distance) / radius
    desired = multiply(desired, source.traits.maxSpeed * strength)

    separate = add(separate, desired)
  })

  return limitMagnitude(separate, boidConfig.maxSteeringForce)
}
