import { config } from "@actors/Boid/config"
import VectorImpl from "@geometry/Vector"
import { add, mag, multiply, normalize } from "@utils/vectorHelper"
import { Options, WanderResult } from "@behaviours/wander/types"

const CIRCLE_DISTANCE = Math.SQRT2
const FULL_TURN = Math.PI * 2

export const wander = ({ source, randomOffset }: Options): WanderResult => {
  const previousPoint = new VectorImpl(
    Math.cos(source.state.wanderAngle),
    Math.sin(source.state.wanderAngle)
  )
  const displacedPoint = add(
    previousPoint,
    multiply(randomOffset, config.wander.rate)
  )
  const point =
    mag(displacedPoint) === 0 ? previousPoint : normalize(displacedPoint)
  const circleCenter = multiply(
    normalize(source.state.velocity),
    CIRCLE_DISTANCE
  )
  const force = add(circleCenter, multiply(point, config.wander.strength))
  const nextAngle = (Math.atan2(point.y, point.x) + FULL_TURN) % FULL_TURN

  return { force, nextAngle }
}
