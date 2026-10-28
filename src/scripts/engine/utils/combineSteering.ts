import { config } from "../../actors/Boid/config"
import { SteeringForces, SteeringForcesTypes } from "../../behaviours/types"
import VectorImpl from "../../geometry/Vector"
import type { Vector } from "../../types/geometry"
import { add, limitMagnitude, multiply } from "../../utils/vectorHelper"

const behaviours = Object.keys(config.steeringWeights) as SteeringForcesTypes[]

export const combineSteering = (
  forces: SteeringForces,
  acceleration: Vector = new VectorImpl(0, 0)
): Vector => {
  const steering = behaviours.reduce((acc, val) => {
    const force = forces[val]

    if (force) {
      const weight = config.steeringWeights[val]

      return add(acc, multiply(force, weight))
    }

    return acc
  }, acceleration)

  return limitMagnitude(steering, config.maxSteeringForce)
}
