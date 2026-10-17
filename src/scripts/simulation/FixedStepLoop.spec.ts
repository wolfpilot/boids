import FixedStepLoop, { IFrameScheduler, ILoopTick } from "./FixedStepLoop"

const createScheduler = () => {
  let time = 0
  let nextId = 0
  const callbacks = new Map<number, FrameRequestCallback>()
  const scheduler: IFrameScheduler = {
    now: () => time,
    requestFrame: (callback) => {
      const id = ++nextId
      callbacks.set(id, callback)
      return id
    },
    cancelFrame: (id) => {
      callbacks.delete(id)
    },
  }

  const advance = (milliseconds: number) => {
    time += milliseconds
    const pending = callbacks.entries().next().value
    if (!pending) throw new Error("No frame is scheduled")
    const [id, callback] = pending
    callbacks.delete(id)
    callback(time)
  }

  return {
    scheduler,
    advance,
    elapse: (milliseconds: number) => {
      time += milliseconds
    },
    pendingCount: () => callbacks.size,
  }
}

describe("FixedStepLoop", () => {
  it("runs 60 simulation steps with 120 Hz frames and renders at 30 FPS", () => {
    const frame = createScheduler()
    const ticks: ILoopTick[] = []
    const loop = new FixedStepLoop({
      onTick: (tick) => {
        ticks.push(tick)
      },
      maxFps: 30,
      scheduler: frame.scheduler,
    })

    loop.start()
    for (let i = 0; i < 120; i++) frame.advance(1000 / 120)
    const totalSteps = ticks.reduce(
      (total, tick) => total + tick.simulationSteps,
      0
    )

    expect(ticks).toHaveLength(120)
    expect(ticks[0]).toEqual({
      timestamp: 1000 / 120,
      elapsedTime: 1000 / 120,
      simulationSteps: 0,
      shouldDraw: false,
    })
    expect(totalSteps).toBe(60)
    expect(ticks.filter((tick) => tick.shouldDraw)).toHaveLength(30)
    expect(frame.pendingCount()).toBe(1)
  })

  it("limits catch-up after a long frame and resets timing on resume", () => {
    const frame = createScheduler()
    const ticks: ILoopTick[] = []
    const loop = new FixedStepLoop({
      onTick: (tick) => {
        ticks.push(tick)
      },
      maxFps: 60,
      scheduler: frame.scheduler,
    })

    loop.start()
    frame.advance(5000)
    expect(ticks[0].simulationSteps).toBe(5)
    expect(ticks[0].elapsedTime).toBeCloseTo(1000 / 12)

    frame.advance(1000 / 60)
    expect(ticks[1].simulationSteps).toBe(1)

    loop.stop()
    expect(frame.pendingCount()).toBe(0)

    frame.elapse(5000)
    loop.start()
    frame.advance(1000 / 60)
    expect(ticks[2].simulationSteps).toBe(1)
    expect(ticks[2].elapsedTime).toBeCloseTo(1000 / 60)
  })

  it("retains unused render time across slightly short frames", () => {
    const frame = createScheduler()
    const ticks: ILoopTick[] = []
    const loop = new FixedStepLoop({
      onTick: (tick) => {
        ticks.push(tick)
      },
      maxFps: 60,
      scheduler: frame.scheduler,
    })

    loop.start()
    for (let i = 0; i < 60; i++) frame.advance(16.5)

    expect(ticks.filter((tick) => tick.shouldDraw)).toHaveLength(59)
  })

  it("applies render-rate changes without resetting the simulation clock", () => {
    const frame = createScheduler()
    const ticks: ILoopTick[] = []
    const loop = new FixedStepLoop({
      onTick: (tick) => {
        ticks.push(tick)
      },
      maxFps: 30,
      scheduler: frame.scheduler,
    })

    loop.start()
    for (let i = 0; i < 60; i++) frame.advance(1000 / 60)
    expect(ticks.filter((tick) => tick.shouldDraw)).toHaveLength(30)

    loop.setMaxFps(60)
    for (let i = 0; i < 60; i++) frame.advance(1000 / 60)
    const totalSteps = ticks.reduce(
      (total, tick) => total + tick.simulationSteps,
      0
    )

    expect(ticks.filter((tick) => tick.shouldDraw)).toHaveLength(90)
    expect(totalSteps).toBe(120)
  })
})
