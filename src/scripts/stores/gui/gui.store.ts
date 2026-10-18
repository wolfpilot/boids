import { Store, StoreConfig } from "@datorama/akita"

export interface GuiStoreState {
  maxFps: number
  logFps: boolean
  showTargetVector: boolean
  showNormalizedTargetVector: boolean
  showVelocityVector: boolean
  showAlignmentArea: boolean
  showSeekingArea: boolean
  showSeparationArea: boolean
  showStoppingArea: boolean
}

const initialState: GuiStoreState = {
  maxFps: 60,
  logFps: true,
  showTargetVector: false,
  showNormalizedTargetVector: false,
  showVelocityVector: false,
  showAlignmentArea: false,
  showSeekingArea: false,
  showSeparationArea: false,
  showStoppingArea: false,
}

@StoreConfig({ name: "gui" })
export class GuiStore extends Store<GuiStoreState> {
  constructor() {
    super(initialState)
  }
}
