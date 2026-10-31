import type { BoidEntity } from "@ts/entities"
import type { Vector } from "@ts/geometry"
import { smoothstep } from "@utils/mathHelper"
import { mag, subtract } from "@utils/vectorHelper"

export const getFleeingInfluence = (
  source: BoidEntity,
  target: Vector,
  radius: number
): number => {
  if (radius <= 0) return 0

  const distance = mag(subtract(source.state.location, target))
  return 1 - smoothstep(radius * 0.9, radius, distance)
}
