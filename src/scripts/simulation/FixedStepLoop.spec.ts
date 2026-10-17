import FixedStepLoop, { IFrameScheduler } from "./FixedStepLoop"

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
    const step = jest.fn()
    const draw = jest.fn()
    const loop = new FixedStepLoop({
      step,
      draw,
      getMaxFps: () => 30,
      scheduler: frame.scheduler,
    })

    loop.start()
    for (let i = 0; i < 120; i++) frame.advance(1000 / 120)

    expect(step).toHaveBeenCalledTimes(60)
    expect(draw).toHaveBeenCalledTimes(30)
    expect(frame.pendingCount()).toBe(1)
  })

  it("limits catch-up after a long frame and resets timing on resume", () => {
    const frame = createScheduler()
    const step = jest.fn()
    const loop = new FixedStepLoop({
      step,
      draw: jest.fn(),
      getMaxFps: () => 60,
      scheduler: frame.scheduler,
    })

    loop.start()
    frame.advance(5000)
    expect(step).toHaveBeenCalledTimes(5)

    frame.advance(1000 / 60)
    expect(step).toHaveBeenCalledTimes(6)

    loop.stop()
    expect(frame.pendingCount()).toBe(0)

    frame.elapse(5000)
    loop.start()
    frame.advance(1000 / 60)
    expect(step).toHaveBeenCalledTimes(7)
  })

  it("retains unused render time across slightly short frames", () => {
    const frame = createScheduler()
    const draw = jest.fn()
    const loop = new FixedStepLoop({
      step: jest.fn(),
      draw,
      getMaxFps: () => 60,
      scheduler: frame.scheduler,
    })

    loop.start()
    for (let i = 0; i < 60; i++) frame.advance(16.5)

    expect(draw).toHaveBeenCalledTimes(59)
  })
})
