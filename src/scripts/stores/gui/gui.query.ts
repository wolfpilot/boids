import { Query } from "@datorama/akita"

// Types
import {
  BoidMultipliers,
  GuiStoreState,
  PointerMode,
} from "@stores/gui/gui.types"
import type { ThemeNameTypes } from "@theme/types"

// Store
import { GuiStore } from "@stores/gui/gui.store"

export class GuiQuery extends Query<GuiStoreState> {
  allState$ = this.select()
  logFps$ = this.select("logFps")
  maxFps$ = this.select("maxFps")
  theme$ = this.select("theme")
  boidMultipliers$ = this.select([
    "maxSpeedMultiplier",
    "brakingMultiplier",
    "alignmentMultiplier",
    "cohesionMultiplier",
    "seekingMultiplier",
    "fleeingMultiplier",
    "separationMultiplier",
    "frictionMultiplier",
  ])

  constructor(protected store: GuiStore) {
    super(store)
  }

  get allValues(): GuiStoreState {
    return this.getValue()
  }

  get boidMultipliers(): BoidMultipliers {
    const state = this.getValue()
    return {
      maxSpeedMultiplier: state.maxSpeedMultiplier,
      brakingMultiplier: state.brakingMultiplier,
      alignmentMultiplier: state.alignmentMultiplier,
      cohesionMultiplier: state.cohesionMultiplier,
      seekingMultiplier: state.seekingMultiplier,
      fleeingMultiplier: state.fleeingMultiplier,
      separationMultiplier: state.separationMultiplier,
      frictionMultiplier: state.frictionMultiplier,
    }
  }

  // engine
  get maxFps(): number {
    return this.getValue().maxFps
  }

  get logFps(): boolean {
    return this.getValue().logFps
  }

  // pointer
  get pointerMode(): PointerMode {
    return this.getValue().pointerMode
  }

  get theme(): ThemeNameTypes {
    return this.getValue().theme
  }

  // vector
  get maxSpeedMultiplier(): number {
    return this.getValue().maxSpeedMultiplier
  }

  get brakingMultiplier(): number {
    return this.getValue().brakingMultiplier
  }

  get alignmentMultiplier(): number {
    return this.getValue().alignmentMultiplier
  }

  get cohesionMultiplier(): number {
    return this.getValue().cohesionMultiplier
  }

  get seekingMultiplier(): number {
    return this.getValue().seekingMultiplier
  }

  get fleeingMultiplier(): number {
    return this.getValue().fleeingMultiplier
  }

  get separationMultiplier(): number {
    return this.getValue().separationMultiplier
  }

  get frictionMultiplier(): number {
    return this.getValue().frictionMultiplier
  }

  // boids
  get showTargetVector(): boolean {
    return this.getValue().showTargetVector
  }

  get showNormalizedTargetVector(): boolean {
    return this.getValue().showNormalizedTargetVector
  }

  get showVelocityVector(): boolean {
    return this.getValue().showVelocityVector
  }

  get showAlignmentArea(): boolean {
    return this.getValue().showAlignmentArea
  }

  get showCohesionArea(): boolean {
    return this.getValue().showCohesionArea
  }

  get showSeekingArea(): boolean {
    return this.getValue().showSeekingArea
  }

  get showFleeingArea(): boolean {
    return this.getValue().showFleeingArea
  }

  get showSeparationArea(): boolean {
    return this.getValue().showSeparationArea
  }

  get showStoppingArea(): boolean {
    return this.getValue().showStoppingArea
  }
}
