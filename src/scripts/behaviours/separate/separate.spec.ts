import { separate } from "@behaviours/separate/separate"
import { createBoidEntity } from "@utils/testHelpers"

const boid = (x: number) =>
  createBoidEntity({
    traits: { separationAreaSize: 9, size: 1, maxSpeed: 1 },
    state: { location: { x, y: 0 } },
  })

describe("separate", () => {
  it("pushes harder against a closer neighbour", () => {
    const source = boid(0)

    expect(separate({ boids: [boid(5)], source }).x).toBeCloseTo(-1 / 5)
    expect(separate({ boids: [boid(9)], source }).x).toBeCloseTo(-1 / 9)
  })

  it("sums softened inverse-distance pushes without limiting them", () => {
    const force = separate({ boids: [boid(1), boid(2)], source: boid(0) })

    expect(force.x).toBeCloseTo(-(1 / 1.25 + 2 / 4.25))
    expect(force.y).toBe(0)
  })

  it("does not steer when neighbours are outside the separation area", () => {
    expect(separate({ boids: [boid(10)], source: boid(0) })).toEqual({
      x: 0,
      y: 0,
    })
  })

  it("tapers the push to zero at the edge and stays finite at close range", () => {
    const source = boid(0)
    const edgeForce = separate({ boids: [boid(9.99)], source }).x

    expect(edgeForce).toBeLessThan(0)
    expect(Math.abs(edgeForce)).toBeLessThan(0.001)
    expect(separate({ boids: [boid(10)], source }).x).toBe(0)
    expect(Number.isFinite(separate({ boids: [boid(0.001)], source }).x)).toBe(
      true
    )
  })

  it("ignores coincident neighbours and leaves inputs unchanged", () => {
    const source = boid(0)
    const boids = [boid(0), boid(2), boid(-2)]
    const before = JSON.stringify([source, ...boids])

    expect(separate({ boids: [], source })).toEqual({ x: 0, y: 0 })
    expect(separate({ boids, source })).toEqual({ x: 0, y: 0 })
    expect(JSON.stringify([source, ...boids])).toBe(before)
  })

  it("still avoids crowding from directly behind", () => {
    const source = createBoidEntity({
      ...boid(0),
      state: { velocity: { x: 1, y: 0 } },
    })

    expect(separate({ source, boids: [boid(-5)] }).x).toBeCloseTo(1 / 5)
  })
})
