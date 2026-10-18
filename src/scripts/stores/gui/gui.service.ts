import { GuiStore } from "./gui.store"

export class GuiService {
  constructor(private guiStore: GuiStore) {}

  updateMaxFps(val: number) {
    this.guiStore.update({ maxFps: val })
  }

  updateLogFps(val: boolean) {
    this.guiStore.update({ logFps: val })
  }

  updateShowTargetVector(val: boolean) {
    this.guiStore.update({ showTargetVector: val })
  }

  updateShowNormalizedTargetVector(val: boolean) {
    this.guiStore.update({ showNormalizedTargetVector: val })
  }

  updateShowVelocityVector(val: boolean) {
    this.guiStore.update({ showVelocityVector: val })
  }

  updateShowAlignmentArea(val: boolean) {
    this.guiStore.update({ showAlignmentArea: val })
  }

  updateShowSeekingArea(val: boolean) {
    this.guiStore.update({ showSeekingArea: val })
  }

  updateShowSeparationArea(val: boolean) {
    this.guiStore.update({ showSeparationArea: val })
  }

  updateShowStoppingArea(val: boolean) {
    this.guiStore.update({ showStoppingArea: val })
  }
}
