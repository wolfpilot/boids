import { BoidEntity } from "@ts/entities"
import { Vector } from "@ts/geometry"

export interface Options {
  target: Vector
  source: BoidEntity
}
