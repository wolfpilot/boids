// Types
import { BoidEntity } from "../../types/entities"

// Utils
import { subtract, mag } from "../../utils/vectorHelper"

export const isInRange = (target: BoidEntity, source: BoidEntity): boolean => {
  const nLocation = subtract(target.state.location, source.state.location)
  const nDistance = mag(nLocation)

  return nDistance > 0 && nDistance < source.traits.alignmentAreaSize
}
