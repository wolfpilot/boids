import { AppStore } from "./app.store"

export class AppService {
  constructor(private appStore: AppStore) {}

  updateIsRunning(val: boolean): void {
    this.appStore.update({ isRunning: val })
  }

  updateFps(val: string): void {
    this.appStore.update({ fps: val })
  }

  updateFpsCount(val: number): void {
    this.appStore.update({ fpsCount: val })
  }

  updateFpsInterval(val: number): void {
    this.appStore.update({ fpsInterval: val })
  }

  updateLastFpsSampleTime(val: number): void {
    this.appStore.update({ lastFpsSampleTime: val })
  }

  updateLastDrawTime(val: number): void {
    this.appStore.update({ lastDrawTime: val })
  }

  updateElapsedTime(val: number): void {
    this.appStore.update({ elapsedTime: val })
  }
}
