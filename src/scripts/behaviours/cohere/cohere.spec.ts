import { cohere } from "@behaviours/cohere/cohere"
import { createBoidEntity } from "@utils/testHelpers"

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

    expect(force.x).toBeCloseTo(1)
    expect(force.y).toBeCloseTo(2)
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

    const force = cohere({ boids: [inside, boundary], source })
    expect(force.x).toBeCloseTo(9)
    expect(force.y).toBe(0)
    expect(cohere({ boids: [boundary], source })).toEqual({ x: 0, y: 0 })
  })

  it("pulls less strongly near the centroid", () => {
    const source = createBoidEntity({
      traits: { cohesionAreaSize: 10 },
    })
    const near = createBoidEntity({ state: { location: { x: 2, y: 0 } } })
    const far = createBoidEntity({ state: { location: { x: 9, y: 0 } } })

    expect(cohere({ boids: [near], source }).x).toBeCloseTo(2)
    expect(cohere({ boids: [far], source }).x).toBeCloseTo(9)
  })

  it("reduces a neighbour's pull smoothly near the radius", () => {
    const source = createBoidEntity({ traits: { cohesionAreaSize: 10 } })
    const nearEdge = createBoidEntity({
      state: { location: { x: 9.99, y: 0 } },
    })
    const boundary = createBoidEntity({
      state: { location: { x: 10, y: 0 } },
    })

    expect(cohere({ boids: [nearEdge], source }).x).toBeGreaterThan(0)
    expect(cohere({ boids: [nearEdge], source }).x).toBeLessThan(0.01)
    expect(cohere({ boids: [boundary], source }).x).toBe(0)
  })

  it("returns zero without neighbours or a direction to the centroid", () => {
    const source = createBoidEntity({
      state: { location: { x: 10, y: 10 }, velocity: { x: 0.3, y: 0 } },
    })
    const coincident = createBoidEntity({
      state: { location: { x: 10, y: 10 } },
    })
    const opposite = [
      createBoidEntity({ state: { location: { x: 10, y: 5 } } }),
      createBoidEntity({ state: { location: { x: 10, y: 15 } } }),
    ]

    expect(cohere({ boids: [], source })).toEqual({ x: 0, y: 0 })
    expect(cohere({ boids: [coincident], source })).toEqual({ x: 0, y: 0 })
    expect(cohere({ boids: opposite, source })).toEqual({ x: 0, y: 0 })
  })

  it("returns the centroid offset independently of velocity and leaves inputs unchanged", () => {
    const source = createBoidEntity({
      traits: { maxSpeed: 0.8, cohesionAreaSize: 6 },
      state: { velocity: { x: 0.3, y: 0 } },
    })
    const neighbour = createBoidEntity({
      state: { location: { x: 0, y: 5 } },
    })
    const before = JSON.stringify([source, neighbour])

    const force = cohere({ boids: [neighbour], source })

    expect(force).toEqual({ x: 0, y: 5 })
    expect(
      cohere({
        boids: [neighbour],
        source: {
          ...source,
          state: { ...source.state, velocity: { x: 0, y: 0 } },
        },
      })
    ).toEqual(force)
    expect(JSON.stringify([source, neighbour])).toBe(before)
  })

  it("ignores neighbours directly behind a moving boid", () => {
    const source = createBoidEntity({ state: { velocity: { x: 1, y: 0 } } })
    const behind = createBoidEntity({ state: { location: { x: -5, y: 0 } } })

    expect(cohere({ source, boids: [behind] })).toEqual({ x: 0, y: 0 })
  })
})
