// Types
import { EntityState } from "@datorama/akita"
import { BoidEntity } from "@ts/entities"

export interface BoidsStoreState extends EntityState<BoidEntity, number> {
  boids: BoidEntity[]
}
