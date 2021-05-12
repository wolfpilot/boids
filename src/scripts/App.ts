// Actors
import Canvas, { ICanvas } from "./actors/Canvas/Canvas"
import Boid from "./actors/Boid/Boid"

// Stores
import { appStore, appService, appQuery } from "./stores/app"
import { guiQuery } from "./stores/gui"
import { boidsStore } from "./stores/boids"

// Config
import { config } from "./config"

// Utils
import { generateRandomizedBoids } from "./utils/actorHelper"

// Interface
import GUI from "./interface/GUI"
import FpsMonitor from "./interface/FpsMonitor"

/**
 * The "game" engine.
 *
 * Responsible for two main tasks:
 * 1. Run the update loop which keeps track of internal timestamps.
 *
 *    Actors can subscribe to either the elapsed or last draw time
 *    to keep renders in sync. Essentially, this simply calculates
 *    the next state to be drawn.
 *
 * 2. Call individual actors to draw at the specified FPS interval.
 *
 *    Actors should NOT draw on each state update since there is no
 *    guarantee that they will end up in sync. Instead, call each
 *    actor's draw method in a logical stacking order.
 */
class App {
  public canvasEl: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D
  private canvas: ICanvas
  private gui: GUI
  private fpsMonitor: FpsMonitor
  private boids: Boid[]

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
  }

  public init(): void {
    if (!this.ctx) {
      throw new Error("Canvas context could not be initialised.")
    }

    const boidEntities = this.boids.map((boid) => ({
      id: boid.id,
      config: boid.config,
      state: boid.state,
    }))

    boidsStore.set(boidEntities)

    this.canvas.init()
    this.gui.init()
    this.fpsMonitor.init()
    this.boids.forEach((boid) => boid.init())

    this.startAnimation()
  }

  private startAnimation(): void {
    const lastDrawTime = performance.now()

    appService.updateLastDrawTime(lastDrawTime)

    requestAnimationFrame(this.tick)
  }

  private tick = (timestamp: number): void => {
    if (!appQuery.isRunning) return

    requestAnimationFrame(this.tick)

    const elapsedTime = timestamp - appQuery.lastDrawTime
    const fpsInterval = 1000 / guiQuery.maxFps

    appStore.update({
      elapsedTime,
    })

    if (elapsedTime > fpsInterval) {
      const lastDrawTime = timestamp - (elapsedTime % fpsInterval)

      appStore.update({
        lastDrawTime,
      })

      this.draw()
    }
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
