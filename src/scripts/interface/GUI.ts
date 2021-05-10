import * as dat from "dat.gui"

// Store
import { guiService, guiQuery } from "../stores/gui"

// Create mutable config object from the store's initial state
const defaults = { ...guiQuery.allValues }

class GUI {
  public init(): void {
    this.setupGUI()
  }

  private setupGUI() {
    const gui = new dat.GUI()

    const maxFpsCtrl = gui.add(defaults, "maxFps")
    const targetVectorCtrl = gui.add(defaults, "showTargetVector")
    const normalizedVectorCtrl = gui.add(defaults, "showNormalizedTargetVector")
    const awarenessAreaCtrl = gui.add(defaults, "showAwarenessArea")
    const separationAreaCtrl = gui.add(defaults, "showSeparationArea")

    maxFpsCtrl.onChange((value: number) => {
      guiService.updateMaxFps(value)
    })

    targetVectorCtrl.onChange((value: boolean) => {
      guiService.updateShowTargetVector(value)
    })

    normalizedVectorCtrl.onChange((value: boolean) => {
      guiService.updateShowNormalizedTargetVector(value)
    })

    awarenessAreaCtrl.onChange((value: boolean) => {
      guiService.updateShowAwarenessArea(value)
    })

    separationAreaCtrl.onChange((value: boolean) => {
      guiService.updateShowSeparationArea(value)
    })
  }
}

export default GUI
