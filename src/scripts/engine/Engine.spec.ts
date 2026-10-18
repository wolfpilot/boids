import type { Boid } from "../actors/Boid/types"
import type { Canvas } from "../actors/Canvas/types"
import { boidsQuery, boidsStore } from "../stores/boids"
import { createBoidEntity } from "../utils/testHelpers"
import Engine from "./Engine"
import type { FrameScheduler } from "./Loop"

describe("Engine", () => {
  afterEach(() => {
    jest.restoreAllMocks()
    boidsStore.set([])
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
})
