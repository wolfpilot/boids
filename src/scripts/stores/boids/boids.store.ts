import { EntityState, EntityStore, StoreConfig } from "@datorama/akita"

// Types
import { BoidEntity } from "../../types/entities"

const initialState: BoidsStoreState = {
  boids: [],
}

export interface BoidsStoreState extends EntityState<BoidEntity, number> {
  boids: BoidEntity[]
}

@StoreConfig({ name: "boids" })
export class BoidsStore extends EntityStore<BoidsStoreState> {
  constructor() {
    super(initialState)
  }
}
