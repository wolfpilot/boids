import { Store, StoreConfig } from "@datorama/akita"

export interface IGuiStoreState {
  maxFps: number
  showFps: boolean
  showTargetVector: boolean
  showNormalizedTargetVector: boolean
  showVelocityVector: boolean
  showAwarenessArea: boolean
  showSeparationArea: boolean
}

const initialState: IGuiStoreState = {
  maxFps: 30,
  showFps: true,
  showTargetVector: true,
  showNormalizedTargetVector: true,
  showVelocityVector: true,
  showAwarenessArea: true,
  showSeparationArea: true,
}

@StoreConfig({ name: "gui" })
export class GuiStore extends Store<IGuiStoreState> {
  constructor() {
    super(initialState)
  }
}
