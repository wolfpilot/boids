import { AppStore } from "./app.store"

export class AppService {
  constructor(private appStore: AppStore) {}

  updateIsRunning(val: boolean) {
    this.appStore.update({ isRunning: val })
  }

  updateElapsedTime(val: number) {
    this.appStore.update({ elapsedTime: val })
  }

  updateLastDrawTime(val: number) {
    this.appStore.update({ lastDrawTime: val })
  }
}
