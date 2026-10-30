import Loop, { FramePlan, FrameScheduler } from "@engine/Loop"

const createScheduler = () => {
  let time = 0
  let nextId = 0
  const callbacks = new Map<number, FrameRequestCallback>()
  const scheduler: FrameScheduler = {
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

describe("Loop", () => {
  it("schedules 60 updates with 120 Hz frames and renders at 30 FPS", () => {
    const frame = createScheduler()
    const plans: FramePlan[] = []
    const loop = new Loop({
      onFrame: (plan) => {
        plans.push(plan)
      },
      maxFps: 30,
      scheduler: frame.scheduler,
    })

    loop.start()
    for (let i = 0; i < 120; i++) frame.advance(1000 / 120)
    const totalUpdates = plans.reduce((total, plan) => total + plan.updates, 0)

    expect(plans).toHaveLength(120)
    expect(plans[0]).toEqual({
      timestamp: 1000 / 120,
      elapsedMs: 1000 / 120,
      updates: 0,
      shouldDraw: false,
    })
    expect(totalUpdates).toBe(60)
    expect(plans.filter((plan) => plan.shouldDraw)).toHaveLength(30)
    expect(frame.pendingCount()).toBe(1)
  })

  it("limits catch-up after a long frame and resets timing on resume", () => {
    const frame = createScheduler()
    const plans: FramePlan[] = []
    const loop = new Loop({
      onFrame: (plan) => {
        plans.push(plan)
      },
      maxFps: 60,
      scheduler: frame.scheduler,
    })

    loop.start()
    frame.advance(5000)
    expect(plans[0].updates).toBe(5)
    expect(plans[0].elapsedMs).toBeCloseTo(1000 / 12)

    frame.advance(1000 / 60)
    expect(plans[1].updates).toBe(1)

    loop.stop()
    expect(frame.pendingCount()).toBe(0)

    frame.elapse(5000)
    loop.start()
    frame.advance(1000 / 60)
    expect(plans[2].updates).toBe(1)
    expect(plans[2].elapsedMs).toBeCloseTo(1000 / 60)
  })

  it("retains unused render time across slightly short frames", () => {
    const frame = createScheduler()
    const plans: FramePlan[] = []
    const loop = new Loop({
      onFrame: (plan) => {
        plans.push(plan)
      },
      maxFps: 60,
      scheduler: frame.scheduler,
    })

    loop.start()
    for (let i = 0; i < 60; i++) frame.advance(16.5)

    expect(plans.filter((plan) => plan.shouldDraw)).toHaveLength(59)
  })

  it("applies render-rate changes without resetting the simulation clock", () => {
    const frame = createScheduler()
    const plans: FramePlan[] = []
    const loop = new Loop({
      onFrame: (plan) => {
        plans.push(plan)
      },
      maxFps: 30,
      scheduler: frame.scheduler,
    })

    loop.start()
    for (let i = 0; i < 60; i++) frame.advance(1000 / 60)
    expect(plans.filter((plan) => plan.shouldDraw)).toHaveLength(30)

    loop.setMaxFps(60)
    for (let i = 0; i < 60; i++) frame.advance(1000 / 60)
    const totalUpdates = plans.reduce((total, plan) => total + plan.updates, 0)

    expect(plans.filter((plan) => plan.shouldDraw)).toHaveLength(90)
    expect(totalUpdates).toBe(120)
  })
})
