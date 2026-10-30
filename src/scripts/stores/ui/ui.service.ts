import { UiStore } from "@stores/ui/ui.store"

// Types
import { Vector } from "@ts/geometry"

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
