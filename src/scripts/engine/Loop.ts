export interface IFrameScheduler {
  now: () => number
  requestFrame: (callback: FrameRequestCallback) => number
  cancelFrame: (id: number) => void
}

export interface IFramePlan {
  timestamp: number
  elapsedMs: number
  updates: number
  shouldDraw: boolean
}

interface IOptions {
  onFrame: (plan: IFramePlan) => void
  maxFps: number
  scheduler?: IFrameScheduler
}

const UPDATE_INTERVAL_MS = 1000 / 60
const MAX_UPDATES_PER_FRAME = 5
const TIME_TOLERANCE_MS = 1e-8

const browserScheduler: IFrameScheduler = {
  now: () => performance.now(),
  requestFrame: (callback) => requestAnimationFrame(callback),
  cancelFrame: (id) => cancelAnimationFrame(id),
}

export default class Loop {
  private readonly onFrame: (plan: IFramePlan) => void
  private readonly scheduler: IFrameScheduler
  private isRunning = false
  private maxFps: number
  private frameId: number | null = null
  private lastFrameTime = 0
  private lastDrawTime = 0
  private unprocessedTimeMs = 0

  constructor({ onFrame, maxFps, scheduler = browserScheduler }: IOptions) {
    this.onFrame = onFrame
    this.maxFps = maxFps
    this.scheduler = scheduler
  }

  public setMaxFps(maxFps: number) {
    this.maxFps = maxFps
  }

  public start() {
    if (this.isRunning) return

    this.isRunning = true
    this.lastFrameTime = this.scheduler.now()
    this.lastDrawTime = this.lastFrameTime
    this.unprocessedTimeMs = 0
    this.frameId = this.scheduler.requestFrame(this.handleAnimationFrame)
  }

  public stop() {
    if (!this.isRunning) return

    this.isRunning = false

    if (this.frameId !== null) {
      this.scheduler.cancelFrame(this.frameId)
    }

    this.frameId = null
    this.unprocessedTimeMs = 0
  }

  private handleAnimationFrame = (timestamp: number) => {
    this.frameId = null

    if (!this.isRunning) return

    const elapsedMs = Math.max(
      0,
      Math.min(
        timestamp - this.lastFrameTime,
        UPDATE_INTERVAL_MS * MAX_UPDATES_PER_FRAME
      )
    )

    this.lastFrameTime = timestamp
    this.unprocessedTimeMs += elapsedMs

    let updates = 0

    while (
      this.unprocessedTimeMs + TIME_TOLERANCE_MS >= UPDATE_INTERVAL_MS &&
      updates < MAX_UPDATES_PER_FRAME
    ) {
      this.unprocessedTimeMs -= UPDATE_INTERVAL_MS
      updates++
    }

    this.unprocessedTimeMs = Math.max(0, this.unprocessedTimeMs)

    const renderIntervalMs = 1000 / Math.max(1, this.maxFps)
    const elapsedSinceDrawMs = timestamp - this.lastDrawTime
    const elapsedRenderIntervals = Math.floor(
      (elapsedSinceDrawMs + TIME_TOLERANCE_MS) / renderIntervalMs
    )

    const shouldDraw = elapsedRenderIntervals > 0

    if (shouldDraw) {
      this.lastDrawTime = Math.min(
        timestamp,
        this.lastDrawTime + elapsedRenderIntervals * renderIntervalMs
      )
    }

    this.onFrame({ timestamp, elapsedMs, updates, shouldDraw })

    if (this.isRunning) {
      this.frameId = this.scheduler.requestFrame(this.handleAnimationFrame)
    }
  }
}
