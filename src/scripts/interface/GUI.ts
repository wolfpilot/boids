import * as dat from "dat.gui"

// Store
import { guiService, guiQuery } from "@stores/gui"
import type { PointerMode } from "@stores/gui/gui.types"

// Create mutable config object from the store's initial state
const defaults = { ...guiQuery.allValues }

class GUI {
  public init() {
    this.setupGUI()
  }

  private setupGUI() {
    const gui = new dat.GUI({ width: 300 })

    const fpsFolder = gui.addFolder("fps")
    const boidFolder = gui.addFolder("vector")
    const pointerFolder = gui.addFolder("pointer")
    const globalFolder = gui.addFolder("global")

    // fps
    const maxFpsCtrl = fpsFolder.add(defaults, "maxFps")
    const logFpsCtrl = fpsFolder.add(defaults, "logFps")

    // vector
    const targetVectorCtrl = boidFolder.add(defaults, "showTargetVector")
    const normalizedVectorCtrl = boidFolder.add(
      defaults,
      "showNormalizedTargetVector"
    )
    const velocityVectorCtrl = boidFolder.add(defaults, "showVelocityVector")

    const alignmentAreaCtrl = boidFolder.add(defaults, "showAlignmentArea")
    const cohesionAreaCtrl = boidFolder.add(defaults, "showCohesionArea")
    const seekingAreaCtrl = boidFolder.add(defaults, "showSeekingArea")
    const fleeingAreaCtrl = boidFolder.add(defaults, "showFleeingArea")
    const separationAreaCtrl = boidFolder.add(defaults, "showSeparationArea")
    const stoppingAreaCtrl = boidFolder.add(defaults, "showStoppingArea")

    // pointer
    const pointerModeCtrl = pointerFolder.add(defaults, "pointerMode", [
      "seek",
      "flee",
    ])

    // global
    const globalInputs = { ...guiQuery.globalMultipliers }
    const maxSpeedCtrl = globalFolder
      .add(globalInputs, "maxSpeedMultiplier")
      .step(0.01)
    maxSpeedCtrl.updateDisplay()
    const brakingCtrl = globalFolder
      .add(globalInputs, "brakingMultiplier")
      .step(0.01)
    brakingCtrl.updateDisplay()
    const alignmentCtrl = globalFolder
      .add(globalInputs, "alignmentMultiplier")
      .step(0.01)
    alignmentCtrl.updateDisplay()
    const cohesionCtrl = globalFolder
      .add(globalInputs, "cohesionMultiplier")
      .step(0.01)
    cohesionCtrl.updateDisplay()
    const seekingCtrl = globalFolder
      .add(globalInputs, "seekingMultiplier")
      .step(0.01)
    seekingCtrl.updateDisplay()
    const fleeingCtrl = globalFolder
      .add(globalInputs, "fleeingMultiplier")
      .step(0.01)
    fleeingCtrl.updateDisplay()
    const separationCtrl = globalFolder
      .add(globalInputs, "separationMultiplier")
      .step(0.01)
    separationCtrl.updateDisplay()
    const frictionCtrl = globalFolder
      .add(globalInputs, "frictionMultiplier")
      .step(0.01)
    frictionCtrl.updateDisplay()

    fpsFolder.open()
    boidFolder.open()
    pointerFolder.open()
    globalFolder.open()

    // fps
    maxFpsCtrl.onChange((value: number) => {
      guiService.updateMaxFps(value)
    })

    logFpsCtrl.onChange((value: boolean) => {
      guiService.updateLogFps(value)
    })

    // vector
    targetVectorCtrl.onChange((value: boolean) => {
      guiService.updateShowTargetVector(value)
    })

    normalizedVectorCtrl.onChange((value: boolean) => {
      guiService.updateShowNormalizedTargetVector(value)
    })

    velocityVectorCtrl.onChange((value: boolean) => {
      guiService.updateShowVelocityVector(value)
    })

    alignmentAreaCtrl.onChange((value: boolean) => {
      guiService.updateShowAlignmentArea(value)
    })

    cohesionAreaCtrl.onChange((value: boolean) => {
      guiService.updateShowCohesionArea(value)
    })

    seekingAreaCtrl.onChange((value: boolean) => {
      guiService.updateShowSeekingArea(value)
    })

    fleeingAreaCtrl.onChange((value: boolean) => {
      guiService.updateShowFleeingArea(value)
    })

    separationAreaCtrl.onChange((value: boolean) => {
      guiService.updateShowSeparationArea(value)
    })

    stoppingAreaCtrl.onChange((value: boolean) => {
      guiService.updateShowStoppingArea(value)
    })

    // pointer
    pointerModeCtrl.onChange((mode: PointerMode) => {
      guiService.updatePointerMode(mode)
    })

    // global
    maxSpeedCtrl.onChange((value: number) => {
      guiService.updateMaxSpeedMultiplier(value)
    })
    maxSpeedCtrl.onFinishChange(() => {
      globalInputs.maxSpeedMultiplier =
        guiQuery.globalMultipliers.maxSpeedMultiplier
      maxSpeedCtrl.updateDisplay()
    })

    brakingCtrl.onChange((value: number) => {
      guiService.updateBrakingMultiplier(value)
    })
    brakingCtrl.onFinishChange(() => {
      globalInputs.brakingMultiplier =
        guiQuery.globalMultipliers.brakingMultiplier
      brakingCtrl.updateDisplay()
    })

    alignmentCtrl.onChange((value: number) => {
      guiService.updateAlignmentMultiplier(value)
    })
    alignmentCtrl.onFinishChange(() => {
      globalInputs.alignmentMultiplier =
        guiQuery.globalMultipliers.alignmentMultiplier
      alignmentCtrl.updateDisplay()
    })

    cohesionCtrl.onChange((value: number) => {
      guiService.updateCohesionMultiplier(value)
    })
    cohesionCtrl.onFinishChange(() => {
      globalInputs.cohesionMultiplier =
        guiQuery.globalMultipliers.cohesionMultiplier
      cohesionCtrl.updateDisplay()
    })

    seekingCtrl.onChange((value: number) => {
      guiService.updateSeekingMultiplier(value)
    })
    seekingCtrl.onFinishChange(() => {
      globalInputs.seekingMultiplier =
        guiQuery.globalMultipliers.seekingMultiplier
      seekingCtrl.updateDisplay()
    })

    fleeingCtrl.onChange((value: number) => {
      guiService.updateFleeingMultiplier(value)
    })
    fleeingCtrl.onFinishChange(() => {
      globalInputs.fleeingMultiplier =
        guiQuery.globalMultipliers.fleeingMultiplier
      fleeingCtrl.updateDisplay()
    })

    separationCtrl.onChange((value: number) => {
      guiService.updateSeparationMultiplier(value)
    })
    separationCtrl.onFinishChange(() => {
      globalInputs.separationMultiplier =
        guiQuery.globalMultipliers.separationMultiplier
      separationCtrl.updateDisplay()
    })

    frictionCtrl.onChange((value: number) => {
      guiService.updateFrictionMultiplier(value)
    })
    frictionCtrl.onFinishChange(() => {
      globalInputs.frictionMultiplier =
        guiQuery.globalMultipliers.frictionMultiplier
      frictionCtrl.updateDisplay()
    })
  }
}

export default GUI
