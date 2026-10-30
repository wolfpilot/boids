import { BoidEntity } from "@ts/entities"
import { Vector } from "@ts/geometry"
import { mag, subtract } from "@utils/vectorHelper"
import { smoothstep } from "@utils/mathHelper"

export const isInSeekingArea = (source: BoidEntity, target: Vector): boolean =>
  mag(subtract(target, source.state.location)) < source.traits.seekingAreaSize

export const getSeekingInfluence = (
  source: BoidEntity,
  target: Vector
): number => {
  const radius = source.traits.seekingAreaSize
  if (radius <= 0) return 0

  const distance = mag(subtract(target, source.state.location))
  return 1 - smoothstep(radius * 0.9, radius, distance)
}
