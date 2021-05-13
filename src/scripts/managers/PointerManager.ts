// Store
import { uiService } from "../stores/ui"

class PointerManager {
  public init() {
    document.addEventListener("pointermove", this.handlePointerMove)
  }

  private handlePointerMove(e: PointerEvent): void {
    uiService.updatePointerVector({
      x: e.x,
      y: e.y,
    })
  }
}

// Export as singleton
export default new PointerManager()
