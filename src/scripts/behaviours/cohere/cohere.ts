import { config } from "../../actors/Boid/config"
import VectorImpl from "../../geometry/Vector"
import { Vector } from "../../types/geometry"
import {
  add,
  divide,
  limitMagnitude,
  mag,
  multiply,
  normalize,
  subtract,
} from "../../utils/vectorHelper"
import { isInRange } from "./helpers"
import { Options } from "./types"

export const cohere = ({ boids, source }: Options): Vector => {
  const neighbours = boids.filter((boid) => isInRange(boid, source))

  if (neighbours.length === 0) return new VectorImpl(0, 0)

  const totalLocation = neighbours.reduce(
    (total, boid) => add(total, boid.state.location),
    new VectorImpl(0, 0)
  )
  const center = divide(totalLocation, neighbours.length)
  const direction = subtract(center, source.state.location)

  const distance = mag(direction)

  if (distance === 0) return new VectorImpl(0, 0)

  const desiredVelocity = multiply(normalize(direction), source.traits.maxSpeed)
  const steering = subtract(desiredVelocity, source.state.velocity)

  return multiply(
    limitMagnitude(steering, config.maxSteeringForce),
    distance / source.traits.cohesionAreaSize
  )
}
