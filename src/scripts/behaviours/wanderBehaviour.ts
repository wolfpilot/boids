import { config } from "../actors/Boid/config"
import VectorImpl from "../geometry/Vector"
import type { BoidEntity } from "../types/entities"
import type { Vector } from "../types/geometry"
import {
  add,
  limitMagnitude,
  multiply,
  normalize,
  setAngle,
  setMagnitude,
} from "../utils/vectorHelper"

interface Options {
  source: BoidEntity
  randomValue: number
}

interface WanderResult {
  force: Vector
  nextAngle: number
}

const LOOK_AHEAD_MULTIPLIER = 2
const CIRCLE_RADIUS_MULTIPLIER = 0.5
const ANGLE_CHANGE = 0.5
const FULL_TURN = Math.PI * 2

export const wander = ({ source, randomValue }: Options): WanderResult => {
  const size = source.traits.size
  const wanderAngle = source.state.wanderAngle

  const direction = normalize(source.state.velocity)

  const circleCenter = multiply(direction, size * LOOK_AHEAD_MULTIPLIER)

  const displacement = new VectorImpl(0, -1)
  setAngle(displacement, wanderAngle)
  setMagnitude(displacement, size * 20 * CIRCLE_RADIUS_MULTIPLIER)

  const force = limitMagnitude(
    add(circleCenter, displacement),
    config.maxSteeringForce
  )
  const nextAngle =
    (wanderAngle + (randomValue - 0.5) * ANGLE_CHANGE + FULL_TURN) % FULL_TURN

  return { force, nextAngle }
}
