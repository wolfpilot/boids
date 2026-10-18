import { BoidEntity } from "../../types/entities"
import { Vector } from "../../types/geometry"

export interface Options {
  target: Vector
  source: BoidEntity
}
