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

    const fpsFolder = gui.addFolder("fps")
    const boidFolder = gui.addFolder("vector")

    const maxFpsCtrl = fpsFolder.add(defaults, "maxFps")
    const showFpsCtrl = fpsFolder.add(defaults, "showFps")

    const targetVectorCtrl = boidFolder.add(defaults, "showTargetVector")
    const normalizedVectorCtrl = boidFolder.add(
      defaults,
      "showNormalizedTargetVector"
    )
    const awarenessAreaCtrl = boidFolder.add(defaults, "showAwarenessArea")
    const separationAreaCtrl = boidFolder.add(defaults, "showSeparationArea")

    fpsFolder.open()
    boidFolder.open()

    maxFpsCtrl.onChange((value: number) => {
      guiService.updateMaxFps(value)
    })

    showFpsCtrl.onChange((value: boolean) => {
      guiService.updateShowFps(value)
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
