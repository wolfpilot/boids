import { Query } from "@datorama/akita"

// Store
import { GuiStoreState, GuiStore } from "./gui.store"

export class GuiQuery extends Query<GuiStoreState> {
  allState$ = this.select()
  logFps$ = this.select("logFps")
  maxFps$ = this.select("maxFps")

  constructor(protected store: GuiStore) {
    super(store)
  }

  get allValues(): GuiStoreState {
    return this.getValue()
  }

  get maxFps(): number {
    return this.getValue().maxFps
  }

  get logFps(): boolean {
    return this.getValue().logFps
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

  get showSeekingArea(): boolean {
    return this.getValue().showSeekingArea
  }

  get showSeparationArea(): boolean {
    return this.getValue().showSeparationArea
  }

  get showStoppingArea(): boolean {
    return this.getValue().showStoppingArea
  }
}
