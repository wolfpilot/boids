import { GuiStore } from "@stores/gui/gui.store"
import { GlobalBoidMultipliers } from "@stores/gui/gui.types"

export class GuiService {
  constructor(private guiStore: GuiStore) {}

  // fps
  updateMaxFps(val: number) {
    this.guiStore.update({ maxFps: val })
  }

  updateLogFps(val: boolean) {
    this.guiStore.update({ logFps: val })
  }

  // vector
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

  updateShowCohesionArea(val: boolean) {
    this.guiStore.update({ showCohesionArea: val })
  }

  updateShowSeekingArea(val: boolean) {
    this.guiStore.update({ showSeekingArea: val })
  }

  updateShowFleeingArea(val: boolean) {
    this.guiStore.update({ showFleeingArea: val })
  }

  updateShowSeparationArea(val: boolean) {
    this.guiStore.update({ showSeparationArea: val })
  }

  updateShowStoppingArea(val: boolean) {
    this.guiStore.update({ showStoppingArea: val })
  }

  // global
  updateMaxSpeedMultiplier(value: number): boolean {
    return this.updateMultiplier("maxSpeedMultiplier", value)
  }

  updateBrakingMultiplier(value: number): boolean {
    return this.updateMultiplier("brakingMultiplier", value)
  }

  updateAlignmentMultiplier(value: number): boolean {
    return this.updateMultiplier("alignmentMultiplier", value)
  }

  updateCohesionMultiplier(value: number): boolean {
    return this.updateMultiplier("cohesionMultiplier", value)
  }

  updateSeekingMultiplier(value: number): boolean {
    return this.updateMultiplier("seekingMultiplier", value)
  }

  updateFleeingMultiplier(value: number): boolean {
    return this.updateMultiplier("fleeingMultiplier", value)
  }

  updateSeparationMultiplier(value: number): boolean {
    return this.updateMultiplier("separationMultiplier", value)
  }

  updateFrictionMultiplier(value: number): boolean {
    return this.updateMultiplier("frictionMultiplier", value)
  }

  private updateMultiplier(
    key: keyof GlobalBoidMultipliers,
    value: number
  ): boolean {
    if (!Number.isFinite(value) || value < 0) return false

    this.guiStore.update({
      globalMultipliers: {
        ...this.guiStore.getValue().globalMultipliers,
        [key]: value,
      },
    })
    return true
  }
}
