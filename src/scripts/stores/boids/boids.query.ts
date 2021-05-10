import { QueryEntity } from "@datorama/akita"

// Types
import { IBoidEntity } from "../../types/entities"

// Store
import { IBoidsStoreState, BoidsStore } from "./boids.store"

export class BoidsQuery extends QueryEntity<IBoidsStoreState> {
  allState$ = this.select()

  constructor(protected store: BoidsStore) {
    super(store)
  }

  get all(): IBoidEntity[] {
    return this.getAll()
  }

  public getBoid(id: number): IBoidEntity | undefined {
    return this.getEntity(id)
  }

  public getOtherBoids(id: number): IBoidEntity[] {
    return this.getAll().filter((boid) => boid.id !== id)
  }
}
