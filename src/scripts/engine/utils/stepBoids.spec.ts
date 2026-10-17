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

  it("stops a stationary agent at its target without neighbour steering", () => {
    const source = createBoidEntity()

    const [updated] = stepBoids([source], { x: 0, y: 0 })

    expect(updated.state.location).toEqual({ x: 0, y: 0 })
    expect(updated.state.velocity).toEqual({ x: 0, y: 0 })
  })
})
