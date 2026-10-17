import { seek } from "./seekBehaviour"
import { IBoidEntity } from "../types/entities"

const source = (brakingDistance: number, velocityX = 0): IBoidEntity =>
  ({
    traits: { brakingDistance, maxSpeed: 1 },
    state: {
      location: { x: 0, y: 0 },
      velocity: { x: velocityX, y: 0 },
    },
  }) as IBoidEntity

describe("seek", () => {
  it("uses the boid's braking distance to set desired speed", () => {
    const target = { x: 2, y: 0 }

    expect(seek({ target, source: source(20) }).x).toBeCloseTo(0.1)
    expect(seek({ target, source: source(40) }).x).toBeCloseTo(0.05)
  })

  it("brakes towards zero velocity when already at the target", () => {
    expect(seek({ target: { x: 0, y: 0 }, source: source(20, 0.2) })).toEqual({
      x: -0.2,
      y: 0,
    })
  })
})
