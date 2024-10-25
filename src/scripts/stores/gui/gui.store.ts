import { Store, StoreConfig } from "@datorama/akita"

export interface IGuiStoreState {
  maxFps: number
  logFps: boolean
  showTargetVector: boolean
  showNormalizedTargetVector: boolean
  showVelocityVector: boolean
  showAwarenessArea: boolean
  showSeparationArea: boolean
  showStoppingArea: boolean
}

const initialState: IGuiStoreState = {
  maxFps: 60,
  logFps: true,
  showTargetVector: false,
  showNormalizedTargetVector: false,
  showVelocityVector: false,
  showAwarenessArea: false,
  showSeparationArea: true,
  showStoppingArea: false,
}

@StoreConfig({ name: "gui" })
export class GuiStore extends Store<IGuiStoreState> {
  constructor() {
    super(initialState)
  }
}
