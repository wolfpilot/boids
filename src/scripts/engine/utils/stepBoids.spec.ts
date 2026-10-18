import { stepBoids } from "./stepBoids"
import { createBoidEntity } from "../../utils/testHelpers"

describe("stepBoids", () => {
  it("uses one snapshot regardless of boid update order", () => {
    const first = createBoidEntity({
      id: 1,
      state: { location: { x: 0, y: 0 }, velocity: { x: 0.2, y: 0 } },
    })
    const second = createBoidEntity({
      id: 2,
      state: { location: { x: 5, y: 0 }, velocity: { x: -0.1, y: 0 } },
    })
    const target = { x: 20, y: 0 }

    const forward = stepBoids([first, second], target)
    const reverse = stepBoids([second, first], target)

    expect(forward).toEqual(reverse.reverse())
    expect(first.state.location).toEqual({ x: 0, y: 0 })
    expect(second.state.location).toEqual({ x: 5, y: 0 })
  })

  it("allows a nearby boid to move an agent at its target", () => {
    const source = createBoidEntity({
      id: 1,
      traits: { size: 1, separationAreaSize: 9 },
    })
    const neighbour = createBoidEntity({
      id: 2,
      traits: { size: 1 },
      state: { location: { x: 5, y: 0 } },
    })

    const target = { x: 0, y: 0 }
    const [updated] = stepBoids([source, neighbour], target)

    expect(updated.state.location.x).toBeLessThan(0)
    expect(updated.state.velocity.x).toBeLessThan(0)
  })

  it("stops a slow boid near its target without neighbour steering", () => {
    const source = createBoidEntity({
      state: {
        location: { x: 10, y: 20 },
        velocity: { x: 0.05, y: 0 },
        acceleration: { x: 1, y: 2 },
      },
    })

    const [updated] = stepBoids([source], { x: 11, y: 20 })

    expect(updated.state.location).toEqual({ x: 10, y: 20 })
    expect(updated.state.targetVector).toEqual({ x: 1, y: 0 })
    expect(updated.state.normTargetVector).toEqual({ x: 1, y: 0 })
    expect(updated.state.acceleration).toEqual({ x: 0, y: 0 })
    expect(updated.state.velocity).toEqual({ x: 0, y: 0 })
    expect(source.state.velocity).toEqual({ x: 0.05, y: 0 })
  })

  it("integrates steering and friction when advancing a boid", () => {
    const source = createBoidEntity({
      traits: { frictionFactor: 0.2 },
      state: {
        location: { x: 10, y: 20 },
        velocity: { x: 0.2, y: 0 },
        acceleration: { x: 0.1, y: 0 },
      },
    })

    const [updated] = stepBoids([source], { x: 110, y: 20 })

    expect(updated.state.velocity.x).toBeCloseTo(0.6)
    expect(updated.state.location.x).toBeCloseTo(10.6)
    expect(updated.state.location.y).toBe(20)
    expect(updated.state.acceleration).toEqual({ x: 0, y: 0 })
    expect(updated.state.targetVector).toEqual({ x: 100, y: 0 })
    expect(source.state.location).toEqual({ x: 10, y: 20 })
  })
})
