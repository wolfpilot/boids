// Types
import { IBoidEntity } from "../types/entities"
import { IVector } from "../types/geometry"

// Config
import { config as boidConfig } from "../actors/Boid/config"

// Utils
import {
  subtract,
  multiply,
  mag,
  setMagnitude,
  limitMagnitude,
} from "../utils/vectorHelper"
import { mapFromToRange } from "../utils/mathHelper"

// Geometry
import Vector from "../geometry/Vector"

interface IOptions {
  target: IVector
  source: IBoidEntity
}

export const seek = ({ target, source }: IOptions): Vector => {
  let desiredVelocity = new Vector(0, 0)

  const targetVector = subtract(target, source.state.location)
  const targetDistance = mag(targetVector)

  const shouldBrake =
    targetDistance > 0 && targetDistance < source.traits.brakingDistance

  if (shouldBrake) {
    // Scale force proportionally to distance and max speed
    const speed = mapFromToRange(
      targetDistance,
      0,
      100,
      0,
      source.traits.maxSpeed
    )

    desiredVelocity = multiply(targetVector, speed)
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
