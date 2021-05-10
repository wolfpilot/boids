import { EntityState, EntityStore, StoreConfig } from "@datorama/akita"

// Types
import { IBoid } from "../../actors/Boid/Boid"

const initialState: IBoidsStoreState = {
  boids: [],
}

export interface IBoidsStoreState extends EntityState<IBoid, number> {
  boids: IBoid[]
}

@StoreConfig({ name: "boids" })
export class BoidsStore extends EntityStore<IBoidsStoreState> {
  constructor() {
    super(initialState)
  }
}
