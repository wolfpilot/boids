// Types
import type { BoidEntity } from "@ts/entities"
import type { Vector } from "@ts/geometry"

export interface Options {
  source: BoidEntity
  randomOffset: Vector
}

export interface WanderResult {
  force: Vector
  nextAngle: number
}
