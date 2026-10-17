// Store
import { appService } from "../stores/app"

class VisibilityManager {
  public init() {
    document.addEventListener(
      "visibilitychange",
      this.handleVisibilityToggle,
      false
    )
    this.handleVisibilityToggle()
  }

  private handleVisibilityToggle = () => {
    const isVisible = document.visibilityState === "visible"

    appService.updateIsRunning(isVisible)
  }
}

// Export as singleton
export default new VisibilityManager()
