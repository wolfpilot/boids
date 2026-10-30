export interface FrameScheduler {
  now: () => number
  requestFrame: (callback: FrameRequestCallback) => number
  cancelFrame: (id: number) => void
}

export interface FramePlan {
  timestamp: number
  elapsedMs: number
  updates: number
  shouldDraw: boolean
}

interface Options {
  onFrame: (plan: FramePlan) => void
  maxFps: number
  scheduler?: FrameScheduler
}

export const PHYSICS_UPDATES_PER_SECOND = 60
const UPDATE_INTERVAL_MS = 1000 / PHYSICS_UPDATES_PER_SECOND
const MAX_UPDATES_PER_FRAME = 5
const TIME_TOLERANCE_MS = 1e-8

const browserScheduler: FrameScheduler = {
  now: () => performance.now(),
  requestFrame: (callback) => requestAnimationFrame(callback),
  cancelFrame: (id) => cancelAnimationFrame(id),
}

export default class Loop {
  private readonly onFrame: (plan: FramePlan) => void
  private readonly scheduler: FrameScheduler
  private isRunning = false
  private maxFps: number
  private frameId: number | null = null
  private lastFrameTime = 0
  private lastDrawTime = 0
  private unprocessedTimeMs = 0

  constructor({ onFrame, maxFps, scheduler = browserScheduler }: Options) {
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

    const elapsedMs = this.recordElapsedTime(timestamp)
    const updates = this.consumeDueUpdates(elapsedMs)
    const shouldDraw = this.advanceDrawClock(timestamp)

    this.onFrame({ timestamp, elapsedMs, updates, shouldDraw })

    if (this.isRunning) {
      this.frameId = this.scheduler.requestFrame(this.handleAnimationFrame)
    }
  }

  private recordElapsedTime(timestamp: number): number {
    // Discard time beyond the catch-up limit after a slow or suspended frame.
    const timeSinceLastFrameMs = timestamp - this.lastFrameTime
    const maxCatchUpMs = UPDATE_INTERVAL_MS * MAX_UPDATES_PER_FRAME

    const elapsedMs = Math.max(0, Math.min(timeSinceLastFrameMs, maxCatchUpMs))

    this.lastFrameTime = timestamp
    return elapsedMs
  }

  private consumeDueUpdates(elapsedMs: number): number {
    this.unprocessedTimeMs += elapsedMs

    let updates = 0

    // The tolerance prevents floating-point rounding from delaying a full update.
    while (
      // Check if has time for update
      this.unprocessedTimeMs + TIME_TOLERANCE_MS >= UPDATE_INTERVAL_MS &&
      // and has not exceeded max updates per frame
      updates < MAX_UPDATES_PER_FRAME
    ) {
      this.unprocessedTimeMs -= UPDATE_INTERVAL_MS
      updates++
    }

    this.unprocessedTimeMs = Math.max(0, this.unprocessedTimeMs)
    return updates
  }

  private advanceDrawClock(timestamp: number): boolean {
    const elapsedSinceDrawMs = timestamp - this.lastDrawTime
    const elapsedWithToleranceMs = elapsedSinceDrawMs + TIME_TOLERANCE_MS

    const renderIntervalMs = 1000 / Math.max(1, this.maxFps)
    const elapsedRenderIntervals = Math.floor(
      elapsedWithToleranceMs / renderIntervalMs
    )

    const shouldDraw = elapsedRenderIntervals > 0

    if (shouldDraw) {
      // Advance by whole intervals so fractional render time carries forward.
      const nextDrawTime =
        this.lastDrawTime + elapsedRenderIntervals * renderIntervalMs
      this.lastDrawTime = Math.min(timestamp, nextDrawTime)
    }

    return shouldDraw
  }
}
