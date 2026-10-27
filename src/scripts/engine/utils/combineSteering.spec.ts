import { combineSteering } from "./combineSteering"
import { mag } from "../../utils/vectorHelper"

describe("combineSteering", () => {
  it("applies each behaviour's weight without changing its inputs", () => {
    const forces = {
      alignment: Object.freeze({ x: 0.2, y: 0.4 }),
      cohesion: Object.freeze({ x: 10, y: -10 }),
      separation: Object.freeze({ x: 0.01, y: 0 }),
      wander: Object.freeze({ x: 0.2, y: 0.4 }),
      seek: Object.freeze({ x: 0.1, y: -0.1 }),
    }

    const acceleration = Object.freeze({ x: 0.01, y: 0.02 })
    const result = combineSteering(forces, acceleration)

    expect(result.x).toBeCloseTo(0.35)
    expect(result.y).toBeCloseTo(0.09)
  })

  it("combines weighted forces before applying the limit", () => {
    expect(
      combineSteering({ alignment: { x: 4, y: 0 }, seek: { x: -1, y: 0 } })
    ).toEqual({ x: 0.5, y: 0 })

    expect(combineSteering({ seek: { x: 3, y: 4 } })).toEqual({
      x: 0.3,
      y: 0.4,
    })
  })

  it("includes existing acceleration in the force budget", () => {
    expect(combineSteering({}, { x: 3, y: 4 })).toEqual({ x: 0.3, y: 0.4 })
  })

  it("returns zero without forces or when they cancel", () => {
    expect(combineSteering({})).toEqual({ x: 0, y: 0 })

    expect(
      combineSteering({ alignment: { x: 2, y: 0 }, seek: { x: -1, y: 0 } })
    ).toEqual({ x: 0, y: 0 })
  })

  it("keeps very large separation requests finite and bounded", () => {
    const force = combineSteering({ separation: { x: -1e8, y: 1e8 } })

    expect(Number.isFinite(force.x)).toBe(true)
    expect(Number.isFinite(force.y)).toBe(true)

    expect(mag(force)).toBeCloseTo(0.5)
  })
})
