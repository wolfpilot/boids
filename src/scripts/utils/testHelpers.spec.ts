import { createBoidEntity } from "./testHelpers"

describe("createBoidEntity", () => {
  it("creates a complete entity with independent state vectors", () => {
    const first = createBoidEntity()
    const second = createBoidEntity()

    expect(first).toEqual({
      id: 0,
      traits: {
        size: 10,
        maxSpeed: 1,
        frictionFactor: 0,
        brakingDistance: 100,
        alignmentAreaSize: 100,
        separationAreaSize: 10,
        color: "#000000",
      },
      state: {
        location: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        friction: { x: 0, y: 0 },
        targetVector: { x: 0, y: 0 },
        normTargetVector: { x: 0, y: 0 },
        wanderAngle: 0,
      },
    })
    expect(first.state.location).not.toBe(second.state.location)
  })

  it("accepts top-level and nested overrides without dropping defaults", () => {
    const boid = createBoidEntity({
      id: 7,
      traits: { maxSpeed: 3 },
      state: { location: { x: 4, y: 5 } },
    })

    expect(boid.id).toBe(7)
    expect(boid.traits.maxSpeed).toBe(3)
    expect(boid.traits.brakingDistance).toBe(100)
    expect(boid.state.location).toEqual({ x: 4, y: 5 })
    expect(boid.state.velocity).toEqual({ x: 0, y: 0 })
  })
})
