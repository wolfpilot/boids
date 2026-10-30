import { config } from "../../actors/Boid/config"
import {
  SteeringForces,
  SteeringForcesTypes,
  SteeringWeights,
} from "../../behaviours/types"
import VectorImpl from "../../geometry/Vector"
import type { Vector } from "../../types/geometry"
import { add, limitMagnitude, multiply } from "../../utils/vectorHelper"

const behaviours = Object.keys(config.steeringWeights) as SteeringForcesTypes[]

interface SteeringOptions {
  acceleration?: Vector
  maxSteeringForce?: number
  weights?: SteeringWeights
}

export const combineSteering = (
  forces: SteeringForces,
  {
    acceleration = new VectorImpl(0, 0),
    maxSteeringForce = config.maxSteeringForce,
    weights = config.steeringWeights,
  }: SteeringOptions = {}
): Vector => {
  const steering = behaviours.reduce((acc, val) => {
    const force = forces[val]

    if (force) {
      const weight = weights[val]

      return add(acc, multiply(force, weight))
    }

    return acc
  }, acceleration)

  return limitMagnitude(steering, maxSteeringForce)
}
