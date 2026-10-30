import { BoidEntity } from "@ts/entities"
import { mag, subtract } from "@utils/vectorHelper"
import { getFieldOfViewWeight } from "@behaviours/utils/isInFieldOfView"
import { getRangeWeight } from "@behaviours/utils/getRangeWeight"

export const getInfluence = (
  target: BoidEntity,
  source: BoidEntity
): number => {
  const distance = mag(subtract(target.state.location, source.state.location))
  const rangeWeight = getRangeWeight(distance, source.traits.cohesionAreaSize)
  if (rangeWeight === 0) return 0

  return rangeWeight * getFieldOfViewWeight(target, source)
}
