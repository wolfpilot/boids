import { Query } from "@datorama/akita"

// Store
import { IAppStoreState, AppStore } from "./app.store"

export class AppQuery extends Query<IAppStoreState> {
  allState$ = this.select()
  elapsedTime$ = this.select("elapsedTime")
  lastDrawTime$ = this.select("lastDrawTime")

  constructor(protected store: AppStore) {
    super(store)
  }

  get allValues(): IAppStoreState {
    return this.getValue()
  }

  get isRunning(): boolean {
    return this.getValue().isRunning
  }

  get fps(): string {
    return this.getValue().fps
  }

  get fpsCount(): number {
    return this.getValue().fpsCount
  }

  get fpsInterval(): number {
    return this.getValue().fpsInterval
  }

  get lastFpsSampleTime(): number {
    return this.getValue().lastFpsSampleTime
  }

  get lastDrawTime(): number {
    return this.getValue().lastDrawTime
  }

  get elapsedTime(): number {
    return this.getValue().elapsedTime
  }
}
