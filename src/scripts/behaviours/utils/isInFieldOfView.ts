import { config } from "../../actors/Boid/config"
import type { BoidEntity } from "../../types/entities"
import { mag, subtract } from "../../utils/vectorHelper"

export const isInFieldOfView = (
  target: BoidEntity,
  source: BoidEntity
): boolean => {
  const offset = subtract(target.state.location, source.state.location)
  const distance = mag(offset)
  if (distance === 0) return false

  const velocity = source.state.velocity
  const speed = mag(velocity)
  if (speed === 0 || config.fieldOfViewDegrees >= 360) return true

  const cosineToTarget =
    (offset.x * velocity.x + offset.y * velocity.y) / (distance * speed)
  const minimumCosine = Math.cos((config.fieldOfViewDegrees * Math.PI) / 360)

  return cosineToTarget >= minimumCosine
}
