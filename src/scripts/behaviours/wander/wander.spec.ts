import { createBoidEntity } from "../../utils/testHelpers"
import { wander } from "./wander"

describe("wander", () => {
  it("aims at a point on the circle ahead of a moving boid", () => {
    const source = createBoidEntity({
      traits: { size: 10 },
      state: { velocity: { x: 3, y: 4 }, wanderAngle: 0 },
    })

    const { force, nextAngle } = wander({ source, randomValue: 0.5 })
    expect(force).toEqual({ x: 112, y: 16 })
    expect(nextAngle).toBe(0)
    expect(source.state.velocity).toEqual({ x: 3, y: 4 })
    expect(source.state.wanderAngle).toBe(0)
  })

  it("uses the current angle to move from rest before changing it", () => {
    const source = createBoidEntity({
      state: { wanderAngle: Math.PI / 2 },
    })

    const { force, nextAngle } = wander({ source, randomValue: 1 })

    expect(force.x).toBeCloseTo(0)
    expect(force.y).toBeCloseTo(100)
    expect(nextAngle).toBeCloseTo(Math.PI / 2 + 0.25)
  })

  it("wraps angle changes within one revolution", () => {
    const source = createBoidEntity({
      state: { wanderAngle: Math.PI * 2 - 0.05 },
    })

    expect(wander({ source, randomValue: 1 }).nextAngle).toBeCloseTo(0.2)

    const nearZero = createBoidEntity({
      state: { wanderAngle: 0.05 },
    })
    expect(wander({ source: nearZero, randomValue: 0 }).nextAngle).toBeCloseTo(
      Math.PI * 2 - 0.2
    )
  })
})
