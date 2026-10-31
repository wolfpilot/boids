import { flee } from "@behaviours/flee/flee"
import { getFleeingInfluence } from "@behaviours/flee/helpers"
import { createBoidEntity } from "@utils/testHelpers"

describe("flee", () => {
  it("steers away from a target by correcting current velocity", () => {
    const source = createBoidEntity({
      traits: { maxSpeed: 3 },
      state: {
        location: { x: 10, y: 20 },
        velocity: { x: -1, y: 0 },
      },
    })
    const target = { x: 15, y: 20 }
    const before = JSON.stringify([source, target])

    expect(flee({ source, target })).toEqual({ x: -2, y: 0 })
    expect(JSON.stringify([source, target])).toBe(before)
  })

  it("uses its heading at coincidence, then its wander angle at rest", () => {
    const moving = createBoidEntity({
      traits: { maxSpeed: 3 },
      state: { velocity: { x: 0, y: 1 } },
    })
    const resting = createBoidEntity({
      traits: { maxSpeed: 3 },
      state: { wanderAngle: Math.PI / 2 },
    })
    const target = { x: 0, y: 0 }

    expect(flee({ source: moving, target })).toEqual({ x: 0, y: 2 })
    expect(flee({ source: resting, target }).x).toBeCloseTo(0)
    expect(flee({ source: resting, target }).y).toBeCloseTo(3)
    expect(
      flee({
        source: createBoidEntity({ traits: { maxSpeed: 0 } }),
        target,
      })
    ).toEqual({ x: 0, y: 0 })
  })

  it("fades over the outer tenth of its fleeing radius", () => {
    const source = createBoidEntity({ traits: { fleeingAreaSize: 30 } })
    const zeroRadiusSource = createBoidEntity({
      traits: { fleeingAreaSize: 0 },
    })

    expect(getFleeingInfluence(source, { x: 0, y: 0 })).toBe(1)
    expect(getFleeingInfluence(source, { x: 27, y: 0 })).toBe(1)
    expect(getFleeingInfluence(source, { x: 28.5, y: 0 })).toBeCloseTo(0.5)
    expect(getFleeingInfluence(source, { x: 30, y: 0 })).toBe(0)
    expect(getFleeingInfluence(zeroRadiusSource, { x: 0, y: 0 })).toBe(0)
  })
})
