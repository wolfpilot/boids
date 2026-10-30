import {
  getFieldOfViewWeight,
  isInFieldOfView,
} from "@behaviours/utils/isInFieldOfView"
import { createBoidEntity } from "@utils/testHelpers"

describe("isInFieldOfView", () => {
  const source = createBoidEntity({ state: { velocity: { x: 1, y: 0 } } })
  const targetAt = (degrees: number) =>
    createBoidEntity({
      state: {
        location: {
          x: Math.cos((degrees * Math.PI) / 180) * 10,
          y: Math.sin((degrees * Math.PI) / 180) * 10,
        },
      },
    })

  it("sees forward and sideways but excludes the rear blind cone", () => {
    expect(isInFieldOfView(targetAt(0), source)).toBe(true)
    expect(isInFieldOfView(targetAt(90), source)).toBe(true)
    expect(isInFieldOfView(targetAt(180), source)).toBe(false)
  })

  it("uses both edges of the 300-degree field", () => {
    expect(isInFieldOfView(targetAt(149.999), source)).toBe(true)
    expect(isInFieldOfView(targetAt(-149.999), source)).toBe(true)
    expect(isInFieldOfView(targetAt(150.001), source)).toBe(false)
    expect(isInFieldOfView(targetAt(-150.001), source)).toBe(false)
  })

  it("follows the velocity direction without changing either entity", () => {
    const movingDown = createBoidEntity({ state: { velocity: { x: 0, y: 2 } } })
    const target = targetAt(-90)
    const before = JSON.stringify([movingDown, target])

    expect(isInFieldOfView(target, movingDown)).toBe(false)
    expect(isInFieldOfView(targetAt(90), movingDown)).toBe(true)
    expect(JSON.stringify([movingDown, target])).toBe(before)
  })

  it("sees every direction at rest and ignores coincident positions", () => {
    expect(isInFieldOfView(targetAt(180), createBoidEntity())).toBe(true)
    expect(isInFieldOfView(createBoidEntity(), source)).toBe(false)
  })

  it("eases influence over the last twenty degrees of the field", () => {
    expect(getFieldOfViewWeight(targetAt(130), source)).toBeCloseTo(1)
    expect(getFieldOfViewWeight(targetAt(140), source)).toBeGreaterThan(0)
    expect(getFieldOfViewWeight(targetAt(140), source)).toBeLessThan(1)
    expect(getFieldOfViewWeight(targetAt(149.9), source)).toBeLessThan(0.001)
    expect(getFieldOfViewWeight(targetAt(150.1), source)).toBe(0)
  })

  it("eases into directional perception as a boid starts moving", () => {
    const behind = targetAt(180)
    const slow = createBoidEntity({
      state: { velocity: { x: 0.05, y: 0 } },
    })

    expect(getFieldOfViewWeight(behind, createBoidEntity())).toBe(1)
    expect(getFieldOfViewWeight(behind, slow)).toBeCloseTo(0.5)
    expect(getFieldOfViewWeight(behind, source)).toBe(0)
  })
})
