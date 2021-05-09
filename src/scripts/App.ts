import Canvas, { ICanvas } from "./actors/Canvas/Canvas"
import Boid, { IBoid } from "./actors/Boid/Boid"

// Stores
import { appStore } from "./stores/appStore"

// Utils
import { getRandomNumber } from "./utils/MathHelpers"

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
    this.ctx = <CanvasRenderingContext2D>this.canvasEl.getContext("2d")
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

    appStore.setState({
      boids,
    })

    // Setup
    this.canvas.init()
    this.gui.init()

    appStore.state.boids.forEach((boid) => boid.init())

    // Run
    this.startFpsCounter()
    this.startAnimation()
  }

  private startFpsCounter(): void {
    if (!config.app.showFps) return

    setInterval(this.sampleFps, 1000)
  }

  private startAnimation(): void {
    const fpsInterval = 1000 / config.app.maxFramerate
    const lastDrawTime = performance.now()

    appStore.setState({
      fpsInterval,
      lastDrawTime,
    })

    requestAnimationFrame(this.tick)
  }

  private sampleFps(): void {
    const now = performance.now()

    if (appStore.state.fpsCount > 0) {
      const delta = now - appStore.state.lastFpsSampleTime
      const fps = ((appStore.state.fpsCount / delta) * 1000).toFixed(2)

      appStore.setState({
        fps,
        fpsCount: 0,
      })
    }

    appStore.setState({
      lastFpsSampleTime: now,
    })
  }

  private tick = (timestamp: number): void => {
    if (!appStore.state.isRunning) return

    const elapsed = timestamp - appStore.state.lastDrawTime

    requestAnimationFrame(this.tick)

    appStore.setState({
      elapsedTime: timestamp - appStore.state.lastDrawTime,
    })

    if (elapsed > appStore.state.fpsInterval) {
      const lastDrawTime = timestamp - (elapsed % appStore.state.fpsInterval)

      appStore.setState({
        lastDrawTime,
        fpsCount: appStore.state.fpsCount + 1,
      })

      this.draw()
    }
  }

  private draw(): void {
    if (this.canvas && this.canvas.state.isEnabled) {
      this.canvas.render()
    }

    if (appStore.state.boids && appStore.state.boids.length) {
      appStore.state.boids.forEach((boid: IBoid) => boid.render())
    }
  }
}

export default App
