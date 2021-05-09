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

  constructor() {
    this.canvasEl = <HTMLCanvasElement>document.getElementById("canvas")
    this.ctx = <CanvasRenderingContext2D>this.canvasEl.getContext("2d")
    this.canvas = new Canvas(this.canvasEl, this.ctx)

    this.canvas.init()
  }

  public init(): void {
    if (!this.ctx) {
      throw new Error("Canvas context could not be initialised.")
    }

    const wWidth = window.innerWidth
    const wHeight = window.innerHeight

    const gui = new GUI()

    const boids = generateBoids({
      ctx: this.ctx,
      wWidth,
      wHeight,
    })

    gui.init()

    appStore.setState({
      boids,
    })

    appStore.state.boids.forEach((boid: IBoid) => boid.init())

    requestAnimationFrame(this.tick)
  }

  private tick = (timestamp: number) => {
    if (!appStore.state.isRunning) return

    if (!appStore.state.startTimestamp) {
      appStore.setState({
        startTimestamp: timestamp,
      })
    }

    // The elapsed time since starting a new animation cycle
    const elapsed = timestamp - appStore.state.startTimestamp

    appStore.setState({
      elapsedTime: elapsed,
    })

    if (this.canvas && this.canvas.state.isEnabled) {
      this.canvas.render()
    }

    if (appStore.state.boids && appStore.state.boids.length) {
      appStore.state.boids.forEach((boid: IBoid) => boid.render())
    }

    requestAnimationFrame((newTimestamp) => this.tick(newTimestamp))
  }
}

export default App
