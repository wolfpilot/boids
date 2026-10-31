import type { Boid } from "@actors/Boid/types"
import type { Canvas } from "@actors/Canvas/types"
import { boidsQuery, boidsStore } from "@stores/boids"
import { guiQuery, guiService } from "@stores/gui"
import { uiService } from "@stores/ui"
import { createBoidEntity } from "@utils/testHelpers"
import Engine from "@engine/Engine"
import type { FrameScheduler } from "@engine/Loop"
import { getFlockDynamics } from "@engine/utils/getFlockDynamics"

describe("Engine", () => {
  afterEach(() => {
    jest.restoreAllMocks()
    boidsStore.set([])
    uiService.clearPointerPresence()
    guiService.updatePointerMode("seek")
  })

  it("publishes initial boids and finishes updates before drawing", () => {
    let frameCallback: FrameRequestCallback | undefined
    const scheduler: FrameScheduler = {
      now: () => 0,
      requestFrame: (callback) => {
        frameCallback = callback
        return 1
      },
      cancelFrame: jest.fn(),
    }

    const publishedDuringDraw: number[] = []
    const setBoids = jest.spyOn(boidsStore, "set")
    const canvas: Canvas = {
      state: { isEnabled: true, fill: "#fff" },
      init: jest.fn(),
      draw: jest.fn(() => publishedDuringDraw.push(setBoids.mock.calls.length)),
      getBounds: () => ({ width: 100, height: 80 }),
    }
    const boid: Boid = {
      ...createBoidEntity({ id: 1 }),
      draw: jest.fn(() => publishedDuringDraw.push(setBoids.mock.calls.length)),
    }
    const engine = new Engine({ canvas, boids: [boid], maxFps: 30, scheduler })

    engine.init()
    expect(boidsQuery.all).toEqual([
      { id: boid.id, traits: boid.traits, state: boid.state },
    ])
    expect(setBoids).toHaveBeenCalledTimes(1)

    engine.start()
    if (!frameCallback) throw new Error("No frame was scheduled")
    frameCallback(1000 / 30)

    expect(setBoids).toHaveBeenCalledTimes(3)
    expect(publishedDuringDraw).toEqual([3, 3])
    expect(canvas.draw).toHaveBeenCalledTimes(1)
    expect(boid.draw).toHaveBeenCalledTimes(1)
    expect(boidsQuery.all).toEqual(setBoids.mock.calls[2][0])

    engine.stop()
    expect(scheduler.cancelFrame).toHaveBeenCalledWith(1)
  })

  it("keeps flock cycles on physics time across a pause", () => {
    let now = 0
    let frameCallback: FrameRequestCallback | undefined
    const scheduler: FrameScheduler = {
      now: () => now,
      requestFrame: (callback) => {
        frameCallback = callback
        return 1
      },
      cancelFrame: jest.fn(),
    }
    const canvas: Canvas = {
      state: { isEnabled: true, fill: "#fff" },
      init: jest.fn(),
      draw: jest.fn(),
      getBounds: () => ({ width: 100, height: 80 }),
    }
    const boid: Boid = { ...createBoidEntity(), draw: jest.fn() }
    const engine = new Engine({ canvas, boids: [boid], maxFps: 60, scheduler })
    const advanceFrame = () => {
      now += 1000 / 60
      if (!frameCallback) throw new Error("No frame was scheduled")
      frameCallback(now)
    }

    engine.init()
    engine.start()
    advanceFrame()
    advanceFrame()
    engine.stop()
    now += 10000
    engine.start()
    advanceFrame()

    expect(boid.draw).toHaveBeenNthCalledWith(1, getFlockDynamics(0))
    expect(boid.draw).toHaveBeenNthCalledWith(2, getFlockDynamics(1))
    expect(boid.draw).toHaveBeenNthCalledWith(3, getFlockDynamics(2))
    engine.stop()
  })

  it("updates existing traits without changing motion state or individual speed variation", () => {
    const canvas: Canvas = {
      state: { isEnabled: true, fill: "#fff" },
      init: jest.fn(),
      draw: jest.fn(),
      getBounds: () => ({ width: 100, height: 80 }),
    }
    const boids: Boid[] = [
      {
        ...createBoidEntity({ id: 1, traits: { maxSpeed: 2 } }),
        draw: jest.fn(),
      },
      {
        ...createBoidEntity({ id: 2, traits: { maxSpeed: 4 } }),
        draw: jest.fn(),
      },
    ]
    const engine = new Engine({ canvas, boids, maxFps: 60 })
    const initial = guiQuery.globalMultipliers

    engine.init()
    const initialStates = boidsQuery.all.map((boid) => boid.state)
    engine.setGlobalMultipliers({
      ...initial,
      maxSpeedMultiplier: initial.maxSpeedMultiplier * 2,
      cohesionMultiplier: initial.cohesionMultiplier * 3,
      fleeingMultiplier: initial.fleeingMultiplier * 2,
    })

    expect(boidsQuery.all.map((boid) => boid.traits.maxSpeed)).toEqual([4, 8])
    expect(boidsQuery.all.map((boid) => boid.traits.cohesionAreaSize)).toEqual([
      180, 180,
    ])
    expect(boidsQuery.all.map((boid) => boid.traits.fleeingAreaSize)).toEqual([
      120, 120,
    ])
    boidsQuery.all.forEach((boid, index) => {
      expect(boid.state).toBe(initialStates[index])
    })
    expect(boids[0].traits.maxSpeed).toBe(2)

    engine.setGlobalMultipliers({ ...initial, maxSpeedMultiplier: 0 })
    expect(boidsQuery.all.map((boid) => boid.traits.maxSpeed)).toEqual([0, 0])

    engine.setGlobalMultipliers(initial)
    expect(boidsQuery.all.map((boid) => boid.traits.maxSpeed)).toEqual([2, 4])
    boidsQuery.all.forEach((boid, index) => {
      expect(boid.state).toBe(initialStates[index])
    })
  })

  it("uses the current pointer mode on each physics update", () => {
    let now = 0
    let frameCallback: FrameRequestCallback | undefined
    const scheduler: FrameScheduler = {
      now: () => now,
      requestFrame: (callback) => {
        frameCallback = callback
        return 1
      },
      cancelFrame: jest.fn(),
    }
    const canvas: Canvas = {
      state: { isEnabled: true, fill: "#fff" },
      init: jest.fn(),
      draw: jest.fn(),
      getBounds: () => ({ width: 1000, height: 1000 }),
    }
    const boid: Boid = {
      ...createBoidEntity({
        state: {
          location: { x: 100, y: 100 },
          wanderAngle: Math.PI / 2,
        },
      }),
      draw: jest.fn(),
    }
    const engine = new Engine({ canvas, boids: [boid], maxFps: 60, scheduler })
    const advanceFrame = () => {
      now += 1000 / 60
      if (!frameCallback) throw new Error("No frame was scheduled")
      frameCallback(now)
    }

    engine.init()
    const initial = boidsQuery.all[0]
    uiService.updatePointerVector({ x: 120, y: 100 })
    engine.start()
    advanceFrame()
    expect(boidsQuery.all[0].state.velocity.x).toBeGreaterThan(0)

    boidsStore.set([initial])
    guiService.updatePointerMode("flee")
    advanceFrame()
    expect(boidsQuery.all[0].state.velocity.x).toBeLessThan(0)

    boidsStore.set([initial])
    uiService.clearPointerPresence()
    const random = jest.spyOn(Math, "random").mockReturnValue(0)
    advanceFrame()
    expect(boidsQuery.all[0].state.velocity.y).toBeGreaterThan(0)
    expect(random).toHaveBeenCalled()
    engine.stop()
  })
})
