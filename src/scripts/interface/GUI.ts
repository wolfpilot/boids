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

    const engineFolder = gui.addFolder("engine")
    const pointerFolder = gui.addFolder("pointer")
    const vectorFolder = gui.addFolder("vector")
    const boidsFolder = gui.addFolder("boids")

    // engine
    const maxFpsCtrl = engineFolder.add(defaults, "maxFps")
    const logFpsCtrl = engineFolder.add(defaults, "logFps")

    // pointer
    const pointerModeCtrl = pointerFolder.add(defaults, "pointerMode", [
      "seek",
      "flee",
    ])

    // vector
    const targetVectorCtrl = vectorFolder.add(defaults, "showTargetVector")
    const normalizedVectorCtrl = vectorFolder.add(
      defaults,
      "showNormalizedTargetVector"
    )
    const velocityVectorCtrl = vectorFolder.add(defaults, "showVelocityVector")

    const alignmentAreaCtrl = vectorFolder.add(defaults, "showAlignmentArea")
    const cohesionAreaCtrl = vectorFolder.add(defaults, "showCohesionArea")
    const seekingAreaCtrl = vectorFolder.add(defaults, "showSeekingArea")
    const fleeingAreaCtrl = vectorFolder.add(defaults, "showFleeingArea")
    const separationAreaCtrl = vectorFolder.add(defaults, "showSeparationArea")
    const stoppingAreaCtrl = vectorFolder.add(defaults, "showStoppingArea")

    // boids
    const maxSpeedCtrl = boidsFolder
      .add(defaults, "maxSpeedMultiplier")
      .step(0.01)
    maxSpeedCtrl.updateDisplay()
    const brakingCtrl = boidsFolder
      .add(defaults, "brakingMultiplier")
      .step(0.01)
    brakingCtrl.updateDisplay()
    const alignmentCtrl = boidsFolder
      .add(defaults, "alignmentMultiplier")
      .step(0.01)
    alignmentCtrl.updateDisplay()
    const cohesionCtrl = boidsFolder
      .add(defaults, "cohesionMultiplier")
      .step(0.01)
    cohesionCtrl.updateDisplay()
    const seekingCtrl = boidsFolder
      .add(defaults, "seekingMultiplier")
      .step(0.01)
    seekingCtrl.updateDisplay()
    const fleeingCtrl = boidsFolder
      .add(defaults, "fleeingMultiplier")
      .step(0.01)
    fleeingCtrl.updateDisplay()
    const separationCtrl = boidsFolder
      .add(defaults, "separationMultiplier")
      .step(0.01)
    separationCtrl.updateDisplay()
    const frictionCtrl = boidsFolder
      .add(defaults, "frictionMultiplier")
      .step(0.01)
    frictionCtrl.updateDisplay()

    engineFolder.open()
    pointerFolder.open()
    vectorFolder.open()
    boidsFolder.open()

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
      guiService.updateMaxSpeedMultiplier(guiQuery.maxSpeedMultiplier)
      maxSpeedCtrl.updateDisplay()
    })

    brakingCtrl.onChange((value: number) => {
      guiService.updateBrakingMultiplier(value)
    })
    brakingCtrl.onFinishChange(() => {
      guiService.updateBrakingMultiplier(guiQuery.brakingMultiplier)
      brakingCtrl.updateDisplay()
    })

    alignmentCtrl.onChange((value: number) => {
      guiService.updateAlignmentMultiplier(value)
    })
    alignmentCtrl.onFinishChange(() => {
      guiService.updateAlignmentMultiplier(guiQuery.alignmentMultiplier)
      alignmentCtrl.updateDisplay()
    })

    cohesionCtrl.onChange((value: number) => {
      guiService.updateCohesionMultiplier(value)
    })
    cohesionCtrl.onFinishChange(() => {
      guiService.updateCohesionMultiplier(guiQuery.cohesionMultiplier)
      cohesionCtrl.updateDisplay()
    })

    seekingCtrl.onChange((value: number) => {
      guiService.updateSeekingMultiplier(value)
    })
    seekingCtrl.onFinishChange(() => {
      guiService.updateSeekingMultiplier(guiQuery.seekingMultiplier)
      seekingCtrl.updateDisplay()
    })

    fleeingCtrl.onChange((value: number) => {
      guiService.updateFleeingMultiplier(value)
    })
    fleeingCtrl.onFinishChange(() => {
      guiService.updateFleeingMultiplier(guiQuery.fleeingMultiplier)
      fleeingCtrl.updateDisplay()
    })

    separationCtrl.onChange((value: number) => {
      guiService.updateSeparationMultiplier(value)
    })
    separationCtrl.onFinishChange(() => {
      guiService.updateSeparationMultiplier(guiQuery.separationMultiplier)
      separationCtrl.updateDisplay()
    })

    frictionCtrl.onChange((value: number) => {
      guiService.updateFrictionMultiplier(value)
    })
    frictionCtrl.onFinishChange(() => {
      guiService.updateFrictionMultiplier(guiQuery.frictionMultiplier)
      frictionCtrl.updateDisplay()
    })
  }
}

export default GUI
