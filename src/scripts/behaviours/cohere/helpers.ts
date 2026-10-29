import { BoidEntity } from "../../types/entities"
import { mag, subtract } from "../../utils/vectorHelper"
import { getFieldOfViewWeight } from "../utils/isInFieldOfView"
import { getRangeWeight } from "../utils/getRangeWeight"

export const getInfluence = (
  target: BoidEntity,
  source: BoidEntity
): number => {
  const distance = mag(subtract(target.state.location, source.state.location))
  const rangeWeight = getRangeWeight(distance, source.traits.cohesionAreaSize)
  if (rangeWeight === 0) return 0

  return rangeWeight * getFieldOfViewWeight(target, source)
}
