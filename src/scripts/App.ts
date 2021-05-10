// Actors
import Canvas, { ICanvas } from "./actors/Canvas/Canvas"
import Boid, { IBoid } from "./actors/Boid/Boid"

// Stores
import { appStore, appService, appQuery } from "./stores/app"
import { guiQuery } from "./stores/gui"
import { boidsStore } from "./stores/boids.store"

// Utils
import { getRandomNumber } from "./utils/mathHelper"

// Interface
import GUI from "./interface/GUI"

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
}): IBoid[] => {
  const boids = [...new Array(config.boids.count)].map(() => {
    const size = getRandomNumber(config.boids.minSize, config.boids.maxSize)

    const options = {
      ctx,
      x: getRandomNumber(0, wWidth),
      y: getRandomNumber(0, wHeight),
      size,
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

  constructor() {
    this.canvasEl = <HTMLCanvasElement>document.getElementById("canvas")
    this.ctx = <CanvasRenderingContext2D>(
      this.canvasEl.getContext("2d", { alpha: false })
    )
    this.canvas = new Canvas(this.canvasEl, this.ctx)
    this.gui = new GUI()
  }

  public init(): void {
    if (!this.ctx) {
      throw new Error("Canvas context could not be initialised.")
    }

    // TODO: Dynamic resize listener and redraw
    const wWidth = window.innerWidth
    const wHeight = window.innerHeight

    const boids = generateBoids({
      ctx: this.ctx,
      wWidth,
      wHeight,
    })

    boidsStore.setState({
      entities: boids,
    })

    this.canvas.init()
    this.gui.init()

    this.startFpsCounter()
    this.startAnimation()
  }

  private startFpsCounter(): void {
    if (!config.app.showFps) return

    setInterval(this.sampleFps, 1000)
  }

  private startAnimation(): void {
    const lastDrawTime = performance.now()

    appService.updateLastDrawTime(lastDrawTime)

    requestAnimationFrame(this.tick)
  }

  private sampleFps(): void {
    const now = performance.now()

    if (appQuery.fpsCount > 0) {
      const delta = now - appQuery.lastFpsSampleTime
      const fps = ((appQuery.fpsCount / delta) * 1000).toFixed(2)

      appStore.update({
        fps,
        fpsCount: 0,
      })
    }

    appService.updateLastFpsSampleTime(now)
  }

  private tick = (timestamp: number): void => {
    if (!appQuery.isRunning) return

    const fpsInterval = 1000 / guiQuery.maxFps
    const elapsed = timestamp - appQuery.lastDrawTime

    requestAnimationFrame(this.tick)

    appStore.update({
      fpsInterval,
      elapsedTime: timestamp - appQuery.lastDrawTime,
    })

    if (elapsed > fpsInterval) {
      const lastDrawTime = timestamp - (elapsed % fpsInterval)

      appStore.update({
        lastDrawTime,
        fpsCount: appQuery.fpsCount + 1,
      })

      this.draw()
    }
  }

  private draw(): void {
    if (this.canvas && this.canvas.state.isEnabled) {
      this.canvas.render()
    }

    if (boidsStore.state.entities && boidsStore.state.entities.length) {
      boidsStore.state.entities.forEach((boid: IBoid) => boid.render())
    }
  }
}

export default App
