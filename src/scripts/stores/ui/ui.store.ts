import { Store, StoreConfig } from "@datorama/akita"
import { UiStoreState } from "./ui.types"

const initialState: UiStoreState = {
  pointerVector: {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  },
  isPointerPresent: false,
}

@StoreConfig({ name: "ui" })
export class UiStore extends Store<UiStoreState> {
  constructor() {
    super(initialState)
  }
}
