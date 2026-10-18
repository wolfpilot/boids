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

    expect(align({ boids, source }).x).toBeCloseTo(0.05)
  })

  it("does not steer when there are no neighbours in range", () => {
    expect(align({ boids: [boid(11, 4)], source: boid(0, 1) })).toEqual({
      x: 0,
      y: 0,
    })
  })
})
