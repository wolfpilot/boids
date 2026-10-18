// Types
import type { BoidEntity } from "../../types/entities"
import type { Vector } from "../../types/geometry"

export interface Options {
  source: BoidEntity
  randomValue: number
}

export interface WanderResult {
  force: Vector
  nextAngle: number
}
