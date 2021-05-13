import { UiStore } from "./ui.store"

// Types
import { IVector } from "../../types/geometry"

export class UiService {
  constructor(private uiStore: UiStore) {}

  updatePointerVector(val: IVector): void {
    this.uiStore.update({
      pointerVector: val,
    })
  }
}
