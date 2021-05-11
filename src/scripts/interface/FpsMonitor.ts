// Store
import { appQuery } from "../stores/app"
import { guiQuery } from "../stores/gui"

export interface IFpsMonitorState {
  count: number
  lastRenderTime: number
}

const initialState: IFpsMonitorState = {
  count: 0,
  lastRenderTime: 0,
}

class FpsMonitor {
  public state: IFpsMonitorState

  constructor() {
    this.state = {
      ...initialState,
    }
  }

  public init(): void {
    if (!guiQuery.showFps) return

    appQuery.elapsedTime$.subscribe(this.tick)

    setInterval(this.render, 1000)
  }

  private tick = (): void => {
    this.state = {
      ...this.state,
      count: this.state.count + 1,
    }
  }

  private render = (): void => {
    if (!this.state.count) return

    const now = performance.now()

    const delta = now - this.state.lastRenderTime
    const fps = ((this.state.count / delta) * 1000).toFixed(2)

    this.state = {
      ...this.state,
      count: 0,
      lastRenderTime: now,
    }

    console.info(`FPS: ${fps}`)
  }
}

export default FpsMonitor
