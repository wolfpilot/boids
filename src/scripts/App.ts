// Types
import { Canvas } from "./actors/Canvas/types"

// Actors
import CanvasImpl from "./actors/Canvas/Canvas"

// Stores
import { appQuery } from "./stores/app"
import { guiQuery } from "./stores/gui"

// Managers
import VisibilityManager from "./managers/VisibilityManager"
import PointerManager from "./managers/PointerManager"

// Config
import { config } from "./config"

// Utils
import { generateRandomizedBoids } from "./utils/boidHelper"
import Engine from "./engine/Engine"

// Interface
import GUI from "./interface/GUI"
import FpsMonitor from "./interface/FpsMonitor"

/**
 * App creates the canvas, boid actors, managers and interface.
 *
 * It performs no updates or rendering itself, leaving the Engine
 * to coordinate that.
 */
class App {
  public canvasEl: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D
  private canvas: Canvas
  private gui: GUI
  private fpsMonitor: FpsMonitor
  private engine: Engine

  constructor() {
    const wWidth = window.innerWidth
    const wHeight = window.innerHeight

    this.canvasEl = <HTMLCanvasElement>document.getElementById("canvas")
    this.ctx = <CanvasRenderingContext2D>(
      this.canvasEl.getContext("2d", { alpha: false })
    )
    this.canvas = new CanvasImpl(this.canvasEl, this.ctx)
    this.gui = new GUI()
    this.fpsMonitor = new FpsMonitor()

    const boids = generateRandomizedBoids({
      ...config.boids,
      ctx: this.ctx,
      maxX: wWidth,
      maxY: wHeight,
    })

    this.engine = new Engine({
      canvas: this.canvas,
      boids,
      maxFps: guiQuery.maxFps,
    })
  }

  public init() {
    if (!this.ctx) {
      throw new Error("Canvas context could not be initialised.")
    }

    this.engine.init()

    VisibilityManager.init()
    PointerManager.init()

    this.canvas.init()
    this.gui.init()
    this.fpsMonitor.init()

    // Keep the FPS cap up to date when the GUI setting changes
    guiQuery.maxFps$.subscribe((maxFps) => {
      this.engine.setMaxFps(maxFps)
    })

    guiQuery.globalMultipliers$.subscribe((multipliers) => {
      this.engine.setGlobalMultipliers(multipliers)
    })

    // VisibilityManager updates isRunning when the tab is hidden or shown
    appQuery.isRunning$.subscribe((isRunning) => {
      isRunning ? this.engine.start() : this.engine.stop()
    })
  }
}

export default App
