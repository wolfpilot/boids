// Types
import { IBoidEntity } from "../types/entities"
import { IVector } from "../types/geometry"

// Config
import { config as boidConfig } from "../actors/Boid/config"

// Utils
import {
  subtract,
  mag,
  setMagnitude,
  limitMagnitude,
} from "../utils/vectorHelper"

// Geometry
import Vector from "../geometry/Vector"

interface IOptions {
  target: IVector
  source: IBoidEntity
}

export const seek = ({ target, source }: IOptions): Vector => {
  let desiredVelocity: IVector

  const targetVector = subtract(target, source.state.location)
  const targetDistance = mag(targetVector)

  if (targetDistance === 0) {
    desiredVelocity = new Vector(0, 0)
  } else if (targetDistance < source.traits.brakingDistance) {
    // Slow down in proportion to the remaining distance.
    const speed =
      (targetDistance / source.traits.brakingDistance) * source.traits.maxSpeed
    desiredVelocity = setMagnitude(targetVector, speed)
  } else {
    // Assume that the actor will desire to head towards its target at max speed
    desiredVelocity = setMagnitude(targetVector, source.traits.maxSpeed)
  }

  // Calculate the resulting steering vector
  const steerVector = subtract(desiredVelocity, source.state.velocity)

  // Assign a force that allows only a certain amount of maneuverability
  const res = limitMagnitude(steerVector, boidConfig.maxSteeringForce)

  return res
}
