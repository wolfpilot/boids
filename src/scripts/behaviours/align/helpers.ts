// Types
import { BoidEntity } from "../../types/entities"

// Utils
import { subtract, mag } from "../../utils/vectorHelper"
import { getFieldOfViewWeight } from "../utils/isInFieldOfView"
import { getRangeWeight } from "../utils/getRangeWeight"

export const getInfluence = (
  target: BoidEntity,
  source: BoidEntity
): number => {
  const nLocation = subtract(target.state.location, source.state.location)
  const nDistance = mag(nLocation)
  const rangeWeight = getRangeWeight(nDistance, source.traits.alignmentAreaSize)
  if (rangeWeight === 0) return 0

  return rangeWeight * getFieldOfViewWeight(target, source)
}
