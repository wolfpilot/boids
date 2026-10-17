export interface IFrameScheduler {
  now: () => number
  requestFrame: (callback: FrameRequestCallback) => number
  cancelFrame: (id: number) => void
}

export interface ILoopTick {
  timestamp: number
  elapsedTime: number
  simulationSteps: number
  shouldDraw: boolean
}

interface IOptions {
  onTick: (tick: ILoopTick) => void
  maxFps: number
  scheduler?: IFrameScheduler
}

const STEP_MS = 1000 / 60
const MAX_STEPS_PER_FRAME = 5
const EPSILON = 1e-8

const browserScheduler: IFrameScheduler = {
  now: () => performance.now(),
  requestFrame: (callback) => requestAnimationFrame(callback),
  cancelFrame: (id) => cancelAnimationFrame(id),
}

export default class FixedStepLoop {
  private readonly onTick: (tick: ILoopTick) => void
  private readonly scheduler: IFrameScheduler
  private maxFps: number
  private frameId: number | null = null
  private running = false
  private lastFrameTime = 0
  private lastDrawTime = 0
  private accumulator = 0

  constructor({ onTick, maxFps, scheduler = browserScheduler }: IOptions) {
    this.onTick = onTick
    this.maxFps = maxFps
    this.scheduler = scheduler
  }

  public setMaxFps(maxFps: number): void {
    this.maxFps = maxFps
  }

  public start(): void {
    if (this.running) return

    this.running = true
    this.lastFrameTime = this.scheduler.now()
    this.lastDrawTime = this.lastFrameTime
    this.accumulator = 0
    this.frameId = this.scheduler.requestFrame(this.tick)
  }

  public stop(): void {
    if (!this.running) return

    this.running = false
    if (this.frameId !== null) this.scheduler.cancelFrame(this.frameId)
    this.frameId = null
    this.accumulator = 0
  }

  private tick = (timestamp: number): void => {
    this.frameId = null
    if (!this.running) return

    const elapsedTime = Math.max(
      0,
      Math.min(timestamp - this.lastFrameTime, STEP_MS * MAX_STEPS_PER_FRAME)
    )
    this.lastFrameTime = timestamp
    this.accumulator += elapsedTime

    let simulationSteps = 0
    while (
      this.accumulator + EPSILON >= STEP_MS &&
      simulationSteps < MAX_STEPS_PER_FRAME
    ) {
      this.accumulator -= STEP_MS
      simulationSteps++
    }
    this.accumulator = Math.max(0, this.accumulator)

    const renderInterval = 1000 / Math.max(1, this.maxFps)
    const elapsedSinceDraw = timestamp - this.lastDrawTime
    const elapsedRenderIntervals = Math.floor(
      (elapsedSinceDraw + EPSILON) / renderInterval
    )
    const shouldDraw = elapsedRenderIntervals > 0
    if (shouldDraw) {
      this.lastDrawTime = Math.min(
        timestamp,
        this.lastDrawTime + elapsedRenderIntervals * renderInterval
      )
    }

    this.onTick({ timestamp, elapsedTime, simulationSteps, shouldDraw })

    if (this.running) this.frameId = this.scheduler.requestFrame(this.tick)
  }
}
