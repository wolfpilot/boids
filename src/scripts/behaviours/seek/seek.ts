// Types
import { Vector } from "../../types/geometry"

// Utils
import { subtract, mag, setMagnitude } from "../../utils/vectorHelper"
import { isInSeekingArea } from "./helpers"

// Geometry
import VectorImpl from "../../geometry/Vector"
import { Options } from "./types"

export const seek = ({ target, source }: Options): Vector => {
  if (!isInSeekingArea(source, target)) {
    return new VectorImpl(0, 0)
  }

  let desiredVelocity: Vector

  const targetVector = subtract(target, source.state.location)
  const targetDistance = mag(targetVector)

  if (targetDistance === 0) {
    desiredVelocity = new VectorImpl(0, 0)
  } else if (targetDistance < source.traits.brakingDistance) {
    // Slow down in proportion to the remaining distance.
    const speed =
      (targetDistance / source.traits.brakingDistance) * source.traits.maxSpeed
    desiredVelocity = setMagnitude(targetVector, speed)
  } else {
    // Assume that the actor will desire to head towards its target at max speed
    desiredVelocity = setMagnitude(targetVector, source.traits.maxSpeed)
  }

  return subtract(desiredVelocity, source.state.velocity)
}
