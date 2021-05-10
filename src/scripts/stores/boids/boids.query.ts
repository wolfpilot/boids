import { QueryEntity } from "@datorama/akita"

// Types
import { IBoid } from "../../actors/Boid/Boid"

// Store
import { IBoidsStoreState, BoidsStore } from "./boids.store"

export class BoidsQuery extends QueryEntity<IBoidsStoreState> {
  allState$ = this.select()

  constructor(protected store: BoidsStore) {
    super(store)
  }

  get all(): IBoid[] {
    return this.getAll()
  }
}
