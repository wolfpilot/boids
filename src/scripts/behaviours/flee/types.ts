import type { BoidEntity } from "@ts/entities"
import type { Vector } from "@ts/geometry"

export interface Options {
  source: BoidEntity
  target: Vector
}
