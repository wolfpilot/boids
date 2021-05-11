import { Subscription } from "rxjs"

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
  private lastDrawTimeSub: Subscription | null
  private renderInterval: NodeJS.Timeout | null

  constructor() {
    this.state = {
      ...initialState,
    }

    this.lastDrawTimeSub = null
    this.renderInterval = null
  }

  public init(): void {
    guiQuery.showFps$.subscribe(this.handleShowFps)
  }

  private handleShowFps = (showFps: boolean): void => {
    if (showFps) {
      this.lastDrawTimeSub = appQuery.lastDrawTime$.subscribe(this.tick)
      this.renderInterval = setInterval(this.render, 1000)
    } else {
      this.lastDrawTimeSub && this.lastDrawTimeSub.unsubscribe()
      this.renderInterval && clearInterval(this.renderInterval)
    }
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
