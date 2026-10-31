import { ThemeNameTypes } from "@theme/types"
import { GuiStore } from "@stores/gui/gui.store"
import { BoidMultipliers, PointerMode } from "@stores/gui/gui.types"

export class GuiService {
  constructor(private guiStore: GuiStore) {}

  // fps
  updateMaxFps(val: number) {
    this.guiStore.update({ maxFps: val })
  }

  updateLogFps(val: boolean) {
    this.guiStore.update({ logFps: val })
  }

  // pointer
  updatePointerMode(mode: PointerMode) {
    this.guiStore.update({ pointerMode: mode })
  }

  // theme
  updateTheme(name: ThemeNameTypes) {
    this.guiStore.update({ theme: name })
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

  // boids
  updateMaxSpeedMultiplier(value: number): boolean {
    return this.updateBoidsMultiplier("maxSpeedMultiplier", value)
  }

  updateBrakingMultiplier(value: number): boolean {
    return this.updateBoidsMultiplier("brakingMultiplier", value)
  }

  updateAlignmentMultiplier(value: number): boolean {
    return this.updateBoidsMultiplier("alignmentMultiplier", value)
  }

  updateCohesionMultiplier(value: number): boolean {
    return this.updateBoidsMultiplier("cohesionMultiplier", value)
  }

  updateSeekingMultiplier(value: number): boolean {
    return this.updateBoidsMultiplier("seekingMultiplier", value)
  }

  updateFleeingMultiplier(value: number): boolean {
    return this.updateBoidsMultiplier("fleeingMultiplier", value)
  }

  updateSeparationMultiplier(value: number): boolean {
    return this.updateBoidsMultiplier("separationMultiplier", value)
  }

  updateFrictionMultiplier(value: number): boolean {
    return this.updateBoidsMultiplier("frictionMultiplier", value)
  }

  private updateBoidsMultiplier(
    key: keyof BoidMultipliers,
    value: number
  ): boolean {
    if (!Number.isFinite(value) || value < 0) return false

    this.guiStore.update({
      [key]: value,
    })

    return true
  }
}
