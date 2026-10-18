// Types
import { Vector } from "../../types/geometry"

// Config
import { config as boidConfig } from "../../actors/Boid/config"

// Utils
import {
  add,
  subtract,
  multiply,
  normalize,
  mag,
  limitMagnitude,
} from "../../utils/vectorHelper"
import { isInRange } from "./helpers"

// Geometry
import VectorImpl from "../../geometry/Vector"
import { Options } from "./types"

// Keep a distance from neighbouring boids
export const separate = ({ boids, source }: Options): Vector => {
  let separate = new VectorImpl(0, 0)

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
