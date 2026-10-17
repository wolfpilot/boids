// Actors
import Canvas, { ICanvas } from "./actors/Canvas/Canvas"
import Boid from "./actors/Boid/Boid"

// Stores
import { appService, appQuery } from "./stores/app"
import { guiQuery } from "./stores/gui"
import { boidsStore, boidsQuery } from "./stores/boids"
import { uiQuery } from "./stores/ui"

// Managers
import VisibilityManager from "./managers/VisibilityManager"
import PointerManager from "./managers/PointerManager"

// Config
import { config } from "./config"

// Utils
import { generateRandomizedBoids } from "./utils/boidHelper"
import { stepBoids } from "./simulation/stepBoids"
import FixedStepLoop from "./simulation/FixedStepLoop"

// Interface
import GUI from "./interface/GUI"
import FpsMonitor from "./interface/FpsMonitor"

/** Advances all boids from one shared snapshot, then draws the completed state. */
class App {
  public canvasEl: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D
  private canvas: ICanvas
  private gui: GUI
  private fpsMonitor: FpsMonitor
  private boids: Boid[]
  private loop: FixedStepLoop

  constructor() {
    const wWidth = window.innerWidth
    const wHeight = window.innerHeight

    this.canvasEl = <HTMLCanvasElement>document.getElementById("canvas")
    this.ctx = <CanvasRenderingContext2D>(
      this.canvasEl.getContext("2d", { alpha: false })
    )
    this.canvas = new Canvas(this.canvasEl, this.ctx)
    this.gui = new GUI()
    this.fpsMonitor = new FpsMonitor()
    this.boids = generateRandomizedBoids({
      ...config.boids,
      ctx: this.ctx,
      maxX: wWidth,
      maxY: wHeight,
    })
    this.loop = new FixedStepLoop({
      step: () => this.stepSimulation(),
      draw: (timestamp) => {
        appService.updateLastDrawTime(timestamp)
        this.draw()
      },
      getMaxFps: () => guiQuery.maxFps,
      onFrame: (elapsedTime) => appService.updateElapsedTime(elapsedTime),
    })
  }

  public init(): void {
    if (!this.ctx) {
      throw new Error("Canvas context could not be initialised.")
    }

    const boidEntities = this.boids.map((boid) => ({
      id: boid.id,
      traits: boid.traits,
      state: boid.state,
    }))

    boidsStore.set(boidEntities)

    VisibilityManager.init()
    PointerManager.init()

    this.canvas.init()
    this.gui.init()
    this.fpsMonitor.init()
    appQuery.isRunning$.subscribe((isRunning) => {
      if (isRunning) this.loop.start()
      else this.loop.stop()
    })
  }

  private stepSimulation(): void {
    const snapshot = boidsQuery.all
    boidsStore.set(stepBoids(snapshot, uiQuery.pointerVector))
  }

  private draw(): void {
    if (this.canvas && this.canvas.state.isEnabled) {
      this.canvas.draw()
    }

    if (this.boids && this.boids.length) {
      this.boids.forEach((boid) => boid.draw())
    }
  }
}

export default App
