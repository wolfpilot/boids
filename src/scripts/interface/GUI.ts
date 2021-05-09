import * as dat from "dat.gui"

// Config
import { config } from "../config"

// Utils
import * as PubSub from "../services/pubSub"

const defaults = {
  maxFps: config.app.maxFramerate,
  showTargetVector: true,
  showNormalizedTargetVector: true,
  showAwarenessArea: true,
  showSeparationArea: true,
}

class GUI {
  public init(): void {
    this.setupGUI()
  }

  // TODO: Split these later into setup UI and controllers
  private setupGUI() {
    const gui = new dat.GUI()

    const maxFpsCtrl = gui.add(defaults, "maxFps")
    const targetVectorCtrl = gui.add(defaults, "showTargetVector")
    const normalizedVectorCtrl = gui.add(defaults, "showNormalizedTargetVector")
    const awarenessAreaCtrl = gui.add(defaults, "showAwarenessArea")
    const separationAreaCtrl = gui.add(defaults, "showSeparationArea")

    maxFpsCtrl.onChange((value: number) => {
      PubSub.publish("gui:maxFps", value)
    })

    targetVectorCtrl.onChange((value: boolean) => {
      PubSub.publish("gui:showTargetVector", value)
    })

    normalizedVectorCtrl.onChange((value: boolean) => {
      PubSub.publish("gui:showNormalizedTargetVector", value)
    })

    awarenessAreaCtrl.onChange((value: boolean) => {
      PubSub.publish("gui:showAwarenessArea", value)
    })

    separationAreaCtrl.onChange((value: boolean) => {
      PubSub.publish("gui:showSeparationArea", value)
    })
  }
}

export default GUI
