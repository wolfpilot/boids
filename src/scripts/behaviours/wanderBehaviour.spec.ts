import { config } from "../actors/Boid/config"
import { createBoidEntity } from "../utils/testHelpers"
import { mag } from "../utils/vectorHelper"
import { wander } from "./wanderBehaviour"

describe("wander", () => {
  it("aims at a point on the circle ahead of a moving boid", () => {
    const source = createBoidEntity({
      traits: { size: 10 },
      state: { velocity: { x: 3, y: 4 }, wanderAngle: 0 },
    })

    const { force, nextAngle } = wander({ source, randomValue: 0.5 })
    const distance = Math.hypot(112, 16)

    expect(force.x).toBeCloseTo((112 / distance) * config.maxSteeringForce)
    expect(force.y).toBeCloseTo((16 / distance) * config.maxSteeringForce)
    expect(mag(force)).toBeCloseTo(config.maxSteeringForce)
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
    expect(force.y).toBeCloseTo(config.maxSteeringForce)
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
