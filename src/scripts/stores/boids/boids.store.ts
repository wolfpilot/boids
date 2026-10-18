import { EntityStore, StoreConfig } from "@datorama/akita"

// Types
import { BoidsStoreState } from "./boids.types"

const initialState: BoidsStoreState = {
  boids: [],
}

@StoreConfig({ name: "boids" })
export class BoidsStore extends EntityStore<BoidsStoreState> {
  constructor() {
    super(initialState)
  }
}
