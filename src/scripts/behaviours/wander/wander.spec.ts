import { config } from "../../actors/Boid/config"
import { createBoidEntity } from "../../utils/testHelpers"
import { mag, subtract } from "../../utils/vectorHelper"
import { wander } from "./wander"

describe("wander", () => {
  it("places a unit circle ahead of the velocity direction", () => {
    const source = createBoidEntity({
      state: { velocity: { x: 3, y: 4 }, wanderAngle: 0 },
    })
    const { force, nextAngle } = wander({
      source,
      randomOffset: { x: 0, y: 0 },
    })
    const center = { x: Math.SQRT2 * 0.6, y: Math.SQRT2 * 0.8 }

    expect(force.x).toBeCloseTo(center.x + 1)
    expect(force.y).toBeCloseTo(center.y)
    expect(mag(subtract(force, center))).toBeCloseTo(1)
    expect(nextAngle).toBe(0)
  })

  it("perturbs the stored point before calculating the force", () => {
    const source = createBoidEntity()
    const randomOffset = { x: 0, y: 1 }
    const before = JSON.stringify([source, randomOffset])
    const { force, nextAngle } = wander({ source, randomOffset })

    expect(nextAngle).toBeCloseTo(Math.atan(0.1))
    expect(force.x).toBeCloseTo(1 / Math.hypot(1, 0.1))
    expect(force.y).toBeCloseTo(0.1 / Math.hypot(1, 0.1))
    expect(mag(force)).toBeCloseTo(1)
    expect(JSON.stringify([source, randomOffset])).toBe(before)

    const next = createBoidEntity({ state: { wanderAngle: nextAngle } })
    const continued = wander({ source: next, randomOffset: { x: 0, y: 0 } })
    expect(continued.force.x).toBeCloseTo(force.x)
    expect(continued.force.y).toBeCloseTo(force.y)
  })

  it("starts from rest using its remembered direction", () => {
    const source = createBoidEntity({ state: { wanderAngle: Math.PI / 2 } })
    const { force } = wander({ source, randomOffset: { x: 0, y: 0 } })

    expect(force.x).toBeCloseTo(0)
    expect(force.y).toBeCloseTo(1)
  })

  it("bounds changes in direction and keeps the circle ahead", () => {
    const source = createBoidEntity({ state: { velocity: { x: 1, y: 0 } } })

    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      const randomOffset = { x: Math.cos(angle), y: Math.sin(angle) }
      const { force, nextAngle } = wander({ source, randomOffset })
      const turn = Math.min(nextAngle, Math.PI * 2 - nextAngle)

      expect(turn).toBeLessThanOrEqual(Math.asin(config.wander.rate) + 1e-12)
      expect(force.x).toBeGreaterThanOrEqual(Math.SQRT2 - 1)
    }
  })

  it("wraps angles within one revolution", () => {
    const source = createBoidEntity({
      state: { wanderAngle: Math.PI * 2 - 0.05 },
    })

    expect(
      wander({ source, randomOffset: { x: 0, y: 1 } }).nextAngle
    ).toBeLessThan(0.1)
    expect(
      wander({ source: createBoidEntity(), randomOffset: { x: 0, y: -1 } })
        .nextAngle
    ).toBeGreaterThan(Math.PI * 2 - 0.1)
  })
})
