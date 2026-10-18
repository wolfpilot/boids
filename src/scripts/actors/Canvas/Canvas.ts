import type { Bounds } from "../../types/geometry"
import { Canvas, CanvasState } from "./types"

// Setup
const initialState: CanvasState = {
  isEnabled: true,
  fill: "#fff",
}

class CanvasImpl implements Canvas {
  public state: CanvasState
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private bounds: Bounds = { width: 0, height: 0 }

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas
    this.ctx = ctx

    this.state = {
      ...initialState,
    }
  }

  public init() {
    this.resize()
    window.addEventListener("resize", this.resize)
  }

  public getBounds(): Bounds {
    return { ...this.bounds }
  }

  public draw() {
    this.ctx.fillStyle = this.state.fill
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private resize = () => {
    const dpi = window.devicePixelRatio

    const wWidth = window.innerWidth
    const wHeight = window.innerHeight

    this.bounds = { width: wWidth, height: wHeight }

    this.canvas.width = wWidth * dpi
    this.canvas.height = wHeight * dpi

    this.canvas.style.width = `${wWidth}px`
    this.canvas.style.height = `${wHeight}px`

    // !: Do NOT cache the DPI as state!
    // It needs to be set every time after the canvas size is updated
    this.ctx.scale(dpi, dpi)

    // Everything's updated, now draw it again!
    this.draw()
  }
}

export default CanvasImpl
