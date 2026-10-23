import { cohere } from "./cohere"
import { createBoidEntity } from "../../utils/testHelpers"
import { mag } from "../../utils/vectorHelper"

describe("cohere", () => {
  it("steers toward the average neighbour position", () => {
    const source = createBoidEntity({
      traits: { maxSpeed: 0.1, cohesionAreaSize: 10 },
      state: { location: { x: 10, y: 10 } },
    })
    const boids = [
      createBoidEntity({ state: { location: { x: 12, y: 10 } } }),
      createBoidEntity({ state: { location: { x: 10, y: 14 } } }),
    ]

    const force = cohere({ boids, source })

    expect(force.x).toBeCloseTo(0.1 / Math.sqrt(5))
    expect(force.y).toBeCloseTo(0.2 / Math.sqrt(5))
  })

  it("uses neighbours strictly inside the cohesion radius", () => {
    const source = createBoidEntity({
      traits: { cohesionAreaSize: 10, maxSpeed: 0.2 },
    })
    const inside = createBoidEntity({
      state: { location: { x: 9, y: 0 } },
    })
    const boundary = createBoidEntity({
      state: { location: { x: 0, y: 10 } },
    })

    expect(cohere({ boids: [inside, boundary], source })).toEqual({
      x: 0.2,
      y: 0,
    })
    expect(cohere({ boids: [boundary], source })).toEqual({ x: 0, y: 0 })
  })

  it("returns zero without neighbours or a direction to the centroid", () => {
    const source = createBoidEntity({
      state: { location: { x: 10, y: 10 }, velocity: { x: 0.3, y: 0 } },
    })
    const coincident = createBoidEntity({
      state: { location: { x: 10, y: 10 } },
    })
    const opposite = [
      createBoidEntity({ state: { location: { x: 5, y: 10 } } }),
      createBoidEntity({ state: { location: { x: 15, y: 10 } } }),
    ]

    expect(cohere({ boids: [], source })).toEqual({ x: 0, y: 0 })
    expect(cohere({ boids: [coincident], source })).toEqual({ x: 0, y: 0 })
    expect(cohere({ boids: opposite, source })).toEqual({ x: 0, y: 0 })
  })

  it("subtracts velocity, caps force, and leaves input state unchanged", () => {
    const source = createBoidEntity({
      traits: { maxSpeed: 0.8 },
      state: { velocity: { x: 0.3, y: 0 } },
    })
    const neighbour = createBoidEntity({
      state: { location: { x: 0, y: 5 } },
    })
    const before = JSON.stringify([source, neighbour])

    const force = cohere({ boids: [neighbour], source })

    expect(force.x).toBeCloseTo((-0.3 / Math.sqrt(0.73)) * 0.5)
    expect(force.y).toBeCloseTo((0.8 / Math.sqrt(0.73)) * 0.5)
    expect(mag(force)).toBeCloseTo(0.5)
    expect(JSON.stringify([source, neighbour])).toBe(before)
  })
})
