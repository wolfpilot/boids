export interface CanvasState {
  isEnabled: boolean
  fill: string
}

export interface Canvas {
  state: CanvasState
  init: () => void
  draw: () => void
}

// Setup
const initialState: CanvasState = {
  isEnabled: true,
  fill: "#fff",
}

class CanvasImpl implements Canvas {
  public state: CanvasState
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas
    this.ctx = ctx

    this.state = {
      ...initialState,
    }
  }

  public init() {
    this.resize()
  }

  public draw() {
    this.ctx.fillStyle = this.state.fill
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private resize() {
    const dpi = window.devicePixelRatio

    const wWidth = window.innerWidth
    const wHeight = window.innerHeight

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
