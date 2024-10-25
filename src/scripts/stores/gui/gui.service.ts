import { GuiStore } from "./gui.store"

export class GuiService {
  constructor(private guiStore: GuiStore) {}

  updateMaxFps(val: number): void {
    this.guiStore.update({ maxFps: val })
  }

  updateLogFps(val: boolean): void {
    this.guiStore.update({ logFps: val })
  }

  updateShowTargetVector(val: boolean): void {
    this.guiStore.update({ showTargetVector: val })
  }

  updateShowNormalizedTargetVector(val: boolean): void {
    this.guiStore.update({ showNormalizedTargetVector: val })
  }

  updateShowVelocityVector(val: boolean): void {
    this.guiStore.update({ showVelocityVector: val })
  }

  updateShowAwarenessArea(val: boolean): void {
    this.guiStore.update({ showAwarenessArea: val })
  }

  updateShowSeparationArea(val: boolean): void {
    this.guiStore.update({ showSeparationArea: val })
  }

  updateShowStoppingArea(val: boolean): void {
    this.guiStore.update({ showStoppingArea: val })
  }
}
