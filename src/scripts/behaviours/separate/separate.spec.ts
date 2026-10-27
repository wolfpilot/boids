import { separate } from "./separate"
import { createBoidEntity } from "../../utils/testHelpers"

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

  it("sums inverse-distance pushes without limiting individual behaviours", () => {
    const force = separate({ boids: [boid(1), boid(2)], source: boid(0) })

    expect(force.x).toBeCloseTo(-1.5)
    expect(force.y).toBe(0)
  })

  it("does not steer when neighbours are outside the separation area", () => {
    expect(separate({ boids: [boid(10)], source: boid(0) })).toEqual({
      x: 0,
      y: 0,
    })
  })

  it("ignores coincident neighbours and leaves inputs unchanged", () => {
    const source = boid(0)
    const boids = [boid(0), boid(2), boid(-2)]
    const before = JSON.stringify([source, ...boids])

    expect(separate({ boids: [], source })).toEqual({ x: 0, y: 0 })
    expect(separate({ boids, source })).toEqual({ x: 0, y: 0 })
    expect(JSON.stringify([source, ...boids])).toBe(before)
  })
})
