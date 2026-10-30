import { Query } from "@datorama/akita"

// Types
import { AppStoreState } from "@stores/app/app.types"

// Store
import { AppStore } from "@stores/app/app.store"

export class AppQuery extends Query<AppStoreState> {
  allState$ = this.select()
  isRunning$ = this.select("isRunning")
  elapsedTime$ = this.select("elapsedTime")
  lastDrawTime$ = this.select("lastDrawTime")

  constructor(protected store: AppStore) {
    super(store)
  }

  get allValues(): AppStoreState {
    return this.getValue()
  }

  get isRunning(): boolean {
    return this.getValue().isRunning
  }

  get elapsedTime(): number {
    return this.getValue().elapsedTime
  }

  get lastDrawTime(): number {
    return this.getValue().lastDrawTime
  }
}
