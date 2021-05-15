import { Query } from "@datorama/akita"

// Store
import { IGuiStoreState, GuiStore } from "./gui.store"

export class GuiQuery extends Query<IGuiStoreState> {
  allState$ = this.select()
  showFps$ = this.select("showFps")

  constructor(protected store: GuiStore) {
    super(store)
  }

  get allValues(): IGuiStoreState {
    return this.getValue()
  }

  get maxFps(): number {
    return this.getValue().maxFps
  }

  get showFps(): boolean {
    return this.getValue().showFps
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

  get showAwarenessArea(): boolean {
    return this.getValue().showAwarenessArea
  }

  get showSeparationArea(): boolean {
    return this.getValue().showSeparationArea
  }
}
