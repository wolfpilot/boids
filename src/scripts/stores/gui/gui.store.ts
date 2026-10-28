import { Store, StoreConfig } from "@datorama/akita"
import { GuiStoreState } from "./gui.types"

const initialState: GuiStoreState = {
  maxFps: 60,
  logFps: true,
  showTargetVector: false,
  showNormalizedTargetVector: false,
  showVelocityVector: true,
  showAlignmentArea: false,
  showCohesionArea: false,
  showSeekingArea: false,
  showSeparationArea: true,
  showStoppingArea: false,
}

@StoreConfig({ name: "gui" })
export class GuiStore extends Store<GuiStoreState> {
  constructor() {
    super(initialState)
  }
}
