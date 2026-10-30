import { seek } from "@behaviours/seek/seek"
import { getSeekingInfluence } from "@behaviours/seek/helpers"
import { createBoidEntity } from "@utils/testHelpers"

const source = (brakingDistance: number, velocityX = 0) =>
  createBoidEntity({
    traits: { brakingDistance, maxSpeed: 1 },
    state: { velocity: { x: velocityX, y: 0 } },
  })

describe("seek", () => {
  it("eases seeking over the outer tenth of its radius", () => {
    const boid = createBoidEntity({ traits: { seekingAreaSize: 30 } })

    expect(getSeekingInfluence(boid, { x: 27, y: 0 })).toBe(1)
    expect(getSeekingInfluence(boid, { x: 28.5, y: 0 })).toBeCloseTo(0.5)
    expect(getSeekingInfluence(boid, { x: 29.99, y: 0 })).toBeGreaterThan(0)
    expect(getSeekingInfluence(boid, { x: 30, y: 0 })).toBe(0)
    expect(
      getSeekingInfluence(
        createBoidEntity({ traits: { seekingAreaSize: 0 } }),
        { x: 0, y: 0 }
      )
    ).toBe(0)
  })

  it("steers only when the target is inside the seeking area", () => {
    const boid = createBoidEntity({
      traits: { seekingAreaSize: 8, brakingDistance: 20 },
    })

    expect(seek({ target: { x: 7.9, y: 0 }, source: boid }).x).toBeGreaterThan(
      0
    )
    expect(seek({ target: { x: 8, y: 0 }, source: boid })).toEqual({
      x: 0,
      y: 0,
    })
    expect(seek({ target: { x: 9, y: 0 }, source: boid })).toEqual({
      x: 0,
      y: 0,
    })
  })

  it("uses the boid's braking distance to set desired speed", () => {
    const target = { x: 2, y: 0 }

    expect(seek({ target, source: source(20) }).x).toBeCloseTo(0.1)
    expect(seek({ target, source: source(40) }).x).toBeCloseTo(0.05)
  })

  it("brakes towards zero velocity when already at the target", () => {
    expect(seek({ target: { x: 0, y: 0 }, source: source(20, 0.2) })).toEqual({
      x: -0.2,
      y: 0,
    })
  })

  it("returns the full velocity correction without changing the input", () => {
    const boid = createBoidEntity({
      traits: { maxSpeed: 3, brakingDistance: 20, seekingAreaSize: 200 },
      state: { velocity: { x: -1, y: 0 } },
    })
    const target = { x: 100, y: 0 }
    const before = JSON.stringify([boid, target])

    expect(seek({ target, source: boid })).toEqual({ x: 4, y: 0 })
    expect(JSON.stringify([boid, target])).toBe(before)
  })
})
