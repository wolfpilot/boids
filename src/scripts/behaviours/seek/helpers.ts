import { BoidEntity } from "../../types/entities"
import { Vector } from "../../types/geometry"
import { mag, subtract } from "../../utils/vectorHelper"

export const isInSeekingArea = (source: BoidEntity, target: Vector): boolean =>
  mag(subtract(target, source.state.location)) < source.traits.seekingAreaSize
