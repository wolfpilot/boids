import { Query } from "@datorama/akita"

// Types
import {
  GlobalBoidMultipliers,
  GuiStoreState,
  PointerMode,
} from "@stores/gui/gui.types"

// Store
import { GuiStore } from "@stores/gui/gui.store"

export class GuiQuery extends Query<GuiStoreState> {
  allState$ = this.select()
  logFps$ = this.select("logFps")
  maxFps$ = this.select("maxFps")
  globalMultipliers$ = this.select("globalMultipliers")

  constructor(protected store: GuiStore) {
    super(store)
  }

  get allValues(): GuiStoreState {
    return this.getValue()
  }

  get maxFps(): number {
    return this.getValue().maxFps
  }

  get globalMultipliers(): GlobalBoidMultipliers {
    return this.getValue().globalMultipliers
  }

  get logFps(): boolean {
    return this.getValue().logFps
  }

  get pointerMode(): PointerMode {
    return this.getValue().pointerMode
  }

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
