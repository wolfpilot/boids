// Types
import { IBoidEntity } from "../types/entities"
import { IVector } from "../types/geometry"

// Config
import { config as boidConfig } from "../actors/Boid/config"

// Utils
import {
  subtract,
  multiply,
  normalize,
  magSq,
  limitMagnitude,
} from "../utils/vectorHelper"
import { mapFromToRange } from "../utils/mathHelper"

// Geometry
import Vector from "../geometry/Vector"

interface IOptions {
  target: IVector
  source: IBoidEntity
}

// Setup
const brakingForce = 100

export const seek = ({ target, source }: IOptions): Vector => {
  let desired = new Vector(0, 0)

  const targetLocation = subtract(target, source.state.location)
  const targetDistanceSq = magSq(targetLocation)
  const normTargetDirection = normalize(targetLocation)

  const shouldBrake =
    targetDistanceSq > 0 && targetDistanceSq < source.traits.brakingDistance

  if (shouldBrake) {
    const brakeSq = brakingForce * brakingForce

    // Scale force proportionally to distance and braking force
    const brakeMultiplier = mapFromToRange(
      targetDistanceSq,
      0,
      brakeSq,
      0,
      source.traits.maxSpeed
    )

    desired = multiply(targetLocation, brakeMultiplier)
  } else {
    // Assume that the actor will desire to head towards its target at max speed
    desired = multiply(normTargetDirection, source.traits.maxSpeed)
  }

  // Assign a force that allows only a certain amount of maneuverability
  const seekVector = subtract(desired, source.state.velocity)
  const seek = limitMagnitude(seekVector, boidConfig.maxSteeringForce)

  return seek
}
