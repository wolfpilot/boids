// Store
import { uiService } from "@stores/ui"

class PointerManager {
  public init() {
    document.documentElement.addEventListener(
      "pointerenter",
      this.handlePointerMove
    )
    document.addEventListener("pointermove", this.handlePointerMove)
    document.documentElement.addEventListener(
      "pointerleave",
      this.handlePointerLeave
    )
    window.addEventListener("blur", this.handleWindowBlur)
  }

  private handlePointerMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return

    uiService.updatePointerVector({
      x: e.clientX,
      y: e.clientY,
    })
  }

  private handlePointerLeave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return

    uiService.clearPointerPresence()
  }

  private handleWindowBlur = () => {
    uiService.clearPointerPresence()
  }
}

// Export as singleton
export default new PointerManager()
