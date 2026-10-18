import { UiStore } from "./ui.store"

// Types
import { Vector } from "../../types/geometry"

export class UiService {
  constructor(private uiStore: UiStore) {}

  updatePointerVector(val: Vector) {
    this.uiStore.update({
      pointerVector: val,
      isPointerPresent: true,
    })
  }

  clearPointerPresence() {
    this.uiStore.update({
      isPointerPresent: false,
    })
  }
}
