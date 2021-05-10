import Vector from "../geometry/Vector"
import { IVector } from "../geometry/Vector"
import { IBoid } from "../actors/Boid/Boid"

// Helpers
import {
  subtract,
  multiply,
  normalize,
  magSq,
  limitMagnitude,
} from "../utils/vectorHelper"
import { mapFromToRange } from "../utils/mathHelper"

interface IOptions {
  target: IVector
  source: IBoid
  maxSteeringForce: number
  maxSpeed: number
}

// Setup
const brakingForce = 100

export const seek = ({
  target,
  source,
  maxSteeringForce,
  maxSpeed,
}: IOptions): Vector => {
  let desired = new Vector(0, 0)

  const targetLocation = subtract(target, source.state.location)
  const targetDistanceSq = magSq(targetLocation)
  const normTargetDirection = normalize(targetLocation)

  // Check if in braking range
  if (targetDistanceSq > 0 && targetDistanceSq < source.brakingDistance) {
    const brakeSq = brakingForce * brakingForce

    // Scale force proportionally to distance and braking force
    const brakeMultiplier = mapFromToRange(
      targetDistanceSq,
      0,
      brakeSq,
      0,
      source.maxSpeed
    )

    desired = multiply(targetLocation, brakeMultiplier)
  } else {
    // Assume that the actor will desire to head towards its target at max speed
    desired = multiply(normTargetDirection, maxSpeed)
  }

  // Assign a force that allows only a certain amount of maneuverability
  const seekVector = subtract(desired, source.state.velocity)
  const seek = limitMagnitude(seekVector, maxSteeringForce)

  return seek
}
