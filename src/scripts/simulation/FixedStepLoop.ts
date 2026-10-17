export interface IFrameScheduler {
  now: () => number
  requestFrame: (callback: FrameRequestCallback) => number
  cancelFrame: (id: number) => void
}

interface IOptions {
  step: () => void
  draw: (timestamp: number) => void
  getMaxFps: () => number
  onFrame?: (elapsedTime: number) => void
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
  private readonly step: () => void
  private readonly draw: (timestamp: number) => void
  private readonly getMaxFps: () => number
  private readonly onFrame?: (elapsedTime: number) => void
  private readonly scheduler: IFrameScheduler
  private frameId: number | null = null
  private running = false
  private lastFrameTime = 0
  private lastDrawTime = 0
  private accumulator = 0

  constructor({
    step,
    draw,
    getMaxFps,
    onFrame,
    scheduler = browserScheduler,
  }: IOptions) {
    this.step = step
    this.draw = draw
    this.getMaxFps = getMaxFps
    this.onFrame = onFrame
    this.scheduler = scheduler
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
    this.onFrame?.(elapsedTime)

    let steps = 0
    while (
      this.accumulator + EPSILON >= STEP_MS &&
      steps < MAX_STEPS_PER_FRAME
    ) {
      this.step()
      this.accumulator -= STEP_MS
      steps++
    }
    this.accumulator = Math.max(0, this.accumulator)

    const renderInterval = 1000 / Math.max(1, this.getMaxFps())
    const elapsedSinceDraw = timestamp - this.lastDrawTime
    const elapsedRenderIntervals = Math.floor(
      (elapsedSinceDraw + EPSILON) / renderInterval
    )
    if (elapsedRenderIntervals > 0) {
      this.lastDrawTime = Math.min(
        timestamp,
        this.lastDrawTime + elapsedRenderIntervals * renderInterval
      )
      this.draw(timestamp)
    }

    if (this.running) this.frameId = this.scheduler.requestFrame(this.tick)
  }
}
