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
import { calculateNextBoidStates } from "./simulation/calculateNextBoidStates"
import FixedTimestepLoop, { IFramePlan } from "./simulation/FixedTimestepLoop"

// Interface
import GUI from "./interface/GUI"
import FpsMonitor from "./interface/FpsMonitor"

/**
 * App coordinates physics and drawing. Each fixed physics update reads the
 * current boids as one snapshot, calculates every next state from that same
 * input, and publishes the completed collection. If several updates are due,
 * each one starts from the collection published by the previous update.
 *
 * Drawing happens after those updates. The canvas is cleared, then each Boid
 * actor reads its latest state from the store and draws it. Drawing does not
 * change the physics state; the loop only decides when these phases are due.
 */
class App {
  public canvasEl: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D
  private canvas: ICanvas
  private gui: GUI
  private fpsMonitor: FpsMonitor
  private boids: Boid[]
  private loop: FixedTimestepLoop

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
    this.loop = new FixedTimestepLoop({
      onFrame: this.applyFramePlan,
      maxFps: guiQuery.maxFps,
    })
  }

  public init() {
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

    // Keep the FPS cap up to date when the GUI setting changes
    guiQuery.maxFps$.subscribe((maxFps) => {
      this.loop.setMaxFps(maxFps)
    })

    // VisibilityManager updates isRunning when the tab is hidden or shown
    appQuery.isRunning$.subscribe((isRunning) => {
      isRunning ? this.loop.start() : this.loop.stop()
    })
  }

  private applyFramePlan = ({
    timestamp,
    elapsedMs,
    physicsUpdates,
    shouldDraw,
  }: IFramePlan) => {
    appService.updateElapsedTime(elapsedMs)

    for (let i = 0; i < physicsUpdates; i++) {
      this.advanceBoidPhysics()
    }

    if (shouldDraw) {
      appService.updateLastDrawTime(timestamp)
      this.draw()
    }
  }

  private advanceBoidPhysics() {
    const snapshot = boidsQuery.all

    boidsStore.set(calculateNextBoidStates(snapshot, uiQuery.pointerVector))
  }

  private draw() {
    if (this.canvas && this.canvas.state.isEnabled) {
      this.canvas.draw()
    }

    if (this.boids && this.boids.length) {
      this.boids.forEach((boid) => boid.draw())
    }
  }
}

export default App
