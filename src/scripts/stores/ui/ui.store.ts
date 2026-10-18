import { Store, StoreConfig } from "@datorama/akita"

// Types
import { Vector } from "../../types/geometry"

export interface UiStoreState {
  pointerVector: Vector
}

const initialState: UiStoreState = {
  pointerVector: {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  },
}

@StoreConfig({ name: "ui" })
export class UiStore extends Store<UiStoreState> {
  constructor() {
    super(initialState)
  }
}
