import { EntityState, EntityStore, StoreConfig } from "@datorama/akita"

// Types
import { IBoidEntity } from "../../types/entities"

const initialState: IBoidsStoreState = {
  boids: [],
}

export interface IBoidsStoreState extends EntityState<IBoidEntity, number> {
  boids: IBoidEntity[]
}

@StoreConfig({ name: "boids" })
export class BoidsStore extends EntityStore<IBoidsStoreState> {
  constructor() {
    super(initialState)
  }
}
