import { QueryEntity } from "@datorama/akita"

// Types
import { BoidEntity } from "@ts/entities"
import { BoidsStoreState } from "@stores/boids/boids.types"

// Store
import { BoidsStore } from "@stores/boids/boids.store"

export class BoidsQuery extends QueryEntity<BoidsStoreState> {
  allState$ = this.select()

  constructor(protected store: BoidsStore) {
    super(store)
  }

  get all(): BoidEntity[] {
    return this.getAll()
  }

  public getBoid(id: number): BoidEntity | undefined {
    return this.getEntity(id)
  }

  public getOtherBoids(id: number): BoidEntity[] {
    return this.getAll({
      filterBy: (entity) => entity.id !== id,
    })
  }
}
