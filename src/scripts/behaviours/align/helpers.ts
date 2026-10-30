// Types
import { BoidEntity } from "@ts/entities"

// Utils
import { subtract, mag } from "@utils/vectorHelper"
import { getFieldOfViewWeight } from "@behaviours/utils/isInFieldOfView"
import { getRangeWeight } from "@behaviours/utils/getRangeWeight"

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
