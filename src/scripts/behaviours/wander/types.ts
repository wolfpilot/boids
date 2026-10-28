// Types
import type { BoidEntity } from "../../types/entities"
import type { Vector } from "../../types/geometry"

export interface Options {
  source: BoidEntity
  randomOffset: Vector
}

export interface WanderResult {
  force: Vector
  nextAngle: number
}
