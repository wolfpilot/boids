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

// Setup
const MAX_FRAMERATE = 30

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

    this.canvas.init()
    this.gui.init()

    appStore.setState({
      boids,
    })

    appStore.state.boids.forEach((boid: IBoid) => boid.init())

    this.startAnimation()
  }

  private startAnimation(): void {
    const fpsInterval = 1000 / MAX_FRAMERATE
    const lastDrawTime = performance.now()

    appStore.setState({
      fpsInterval,
      lastDrawTime,
    })

    requestAnimationFrame(this.tick)
  }

  private tick = (timestamp: number): void => {
    if (!appStore.state.isRunning) return

    // The elapsed time since starting a new animation cycle
    const elapsed = timestamp - appStore.state.lastDrawTime

    requestAnimationFrame(this.tick)

    appStore.setState({
      elapsedTime: timestamp - appStore.state.lastDrawTime,
    })

    // Draw next frame if enough time has elapsed
    if (elapsed > appStore.state.fpsInterval) {
      const lastDrawTime = timestamp - (elapsed % appStore.state.fpsInterval)

      appStore.setState({
        lastDrawTime,
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
