import { align } from "./align"
import { createBoidEntity } from "../../utils/testHelpers"

const boid = (x: number, velocityX: number) =>
  createBoidEntity({
    traits: { alignmentAreaSize: 10 },
    state: {
      location: { x, y: 0 },
      velocity: { x: velocityX, y: 0 },
    },
  })

describe("align", () => {
  it("steers towards the average neighbour velocity", () => {
    const source = boid(0, 1)
    const boids = [boid(1, 2), boid(2, 4)]

    expect(align({ boids, source }).x).toBeCloseTo(2)
  })

  it("does not steer when there are no neighbours in range", () => {
    expect(align({ boids: [boid(11, 4)], source: boid(0, 1) })).toEqual({
      x: 0,
      y: 0,
    })
  })

  it("ignores neighbours directly behind a moving boid", () => {
    expect(align({ source: boid(0, 1), boids: [boid(-5, 4)] })).toEqual({
      x: 0,
      y: 0,
    })
  })

  it("excludes the boundary and coincident positions", () => {
    expect(
      align({ boids: [boid(10, 4), boid(0, 3)], source: boid(0, 1) })
    ).toEqual({ x: 0, y: 0 })
  })

  it("matches stationary or cancelling velocities without changing its inputs", () => {
    const source = boid(0, 0.4)
    const boids = [boid(1, 2), boid(2, -2)]
    const before = JSON.stringify([source, ...boids])

    expect(align({ boids, source })).toEqual({ x: -0.4, y: 0 })
    expect(align({ boids: [boid(1, 0)], source })).toEqual({ x: -0.4, y: 0 })
    expect(JSON.stringify([source, ...boids])).toBe(before)
  })
})
