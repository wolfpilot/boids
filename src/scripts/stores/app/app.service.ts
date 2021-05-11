import { AppStore } from "./app.store"

export class AppService {
  constructor(private appStore: AppStore) {}

  updateIsRunning(val: boolean): void {
    this.appStore.update({ isRunning: val })
  }

  updateElapsedTime(val: number): void {
    this.appStore.update({ elapsedTime: val })
  }

  updateLastDrawTime(val: number): void {
    this.appStore.update({ lastDrawTime: val })
  }
}
