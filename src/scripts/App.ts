// Actors
import Canvas, { ICanvas } from "./actors/Canvas/Canvas"
import Boid from "./actors/Boid/Boid"

// Stores
import { appStore, appService, appQuery } from "./stores/app"
import { guiQuery } from "./stores/gui"
import { boidsStore } from "./stores/boids"

// Utils
import { getRandomNumber } from "./utils/mathHelper"

// Interface
import GUI from "./interface/GUI"
import FpsMonitor from "./interface/FpsMonitor"

// Config
import { config } from "./config"

// Utils
const generateBoids = ({
  ctx,
  wWidth,
  wHeight,
}: {
  ctx: CanvasRenderingContext2D
  wWidth: number
  wHeight: number
}): Boid[] => {
  const boids = [...new Array(config.boids.count)].map((_, index) => {
    const size = getRandomNumber(config.boids.minSize, config.boids.maxSize)

    const options = {
      id: index,
      ctx,
      x: getRandomNumber(0, wWidth),
      y: getRandomNumber(0, wHeight),
      size,
      brakingDistance: size * config.boids.brakingFactor,
      awarenessAreaSize: size * config.boids.awarenessFactor,
      color:
        config.boids.colors[getRandomNumber(0, config.boids.colors.length - 1)],
    }

    return new Boid(options)
  })

  return boids
}

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
    this.boids = generateBoids({
      ctx: this.ctx,
      wWidth,
      wHeight,
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
