// Types
import { BoidEntity } from "@ts/entities"

// Utils
import { subtract, mag } from "@utils/vectorHelper"
import { getRangeWeight } from "@behaviours/utils/getRangeWeight"

export const getInfluence = (
  target: BoidEntity,
  source: BoidEntity
): number => {
  const nLocation = subtract(target.state.location, source.state.location)
  const nDistance = mag(nLocation)

  return getRangeWeight(
    nDistance,
    source.traits.separationAreaSize + target.traits.size
  )
}
