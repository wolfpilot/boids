import { Store, StoreConfig } from "@datorama/akita"

export interface IGuiStoreState {
  maxFps: number
  showTargetVector: boolean
  showNormalizedTargetVector: boolean
  showAwarenessArea: boolean
  showSeparationArea: boolean
}

const initialState: IGuiStoreState = {
  maxFps: 30,
  showTargetVector: true,
  showNormalizedTargetVector: true,
  showAwarenessArea: true,
  showSeparationArea: true,
}

@StoreConfig({ name: "gui" })
export class GuiStore extends Store<IGuiStoreState> {
  constructor() {
    super(initialState)
  }
}
