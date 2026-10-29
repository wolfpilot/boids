import { config } from "../../actors/Boid/config"
import type { BoidEntity } from "../../types/entities"
import { mag, subtract } from "../../utils/vectorHelper"
import { smoothstep } from "../../utils/mathHelper"

export const getFieldOfViewWeight = (
  target: BoidEntity,
  source: BoidEntity
): number => {
  const offset = subtract(target.state.location, source.state.location)
  const distance = mag(offset)
  if (distance === 0) return 0

  const velocity = source.state.velocity
  const speed = mag(velocity)
  if (speed === 0 || config.fieldOfViewDegrees >= 360) return 1

  const cosineToTarget =
    (offset.x * velocity.x + offset.y * velocity.y) / (distance * speed)
  const halfAngle = config.fieldOfViewDegrees / 2
  const outerCosine = Math.cos((halfAngle * Math.PI) / 180)
  const innerCosine = Math.cos((Math.max(0, halfAngle - 20) * Math.PI) / 180)
  const angularWeight = smoothstep(outerCosine, innerCosine, cosineToTarget)
  const speedWeight = smoothstep(0, source.traits.maxSpeed * 0.1, speed)

  return 1 - speedWeight * (1 - angularWeight)
}

export const isInFieldOfView = (
  target: BoidEntity,
  source: BoidEntity
): boolean => getFieldOfViewWeight(target, source) > 0
