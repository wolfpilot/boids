import { Store, StoreConfig } from "@datorama/akita"

// Types
import { IVector } from "../../types/geometry"

export interface IUiStoreState {
  pointerVector: IVector
}

const initialState: IUiStoreState = {
  pointerVector: {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  },
}

@StoreConfig({ name: "ui" })
export class UiStore extends Store<IUiStoreState> {
  constructor() {
    super(initialState)
  }
}
