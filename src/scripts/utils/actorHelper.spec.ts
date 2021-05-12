import "jest-canvas-mock"

// Utils
import { generateRandomizedBoids } from "./actorHelper"

// Constants
import { BOID_COLORS } from "../constants/colors"

// Actors
import Boid from "../actors/Boid/Boid"

// let windowSpy
let canvas
let ctx

const options = {
  total: 5,
  ctx: ctx,
  maxX: 1920,
  maxY: 1080,
  minSize: 10,
  maxSize: 15,
  maxSpeedMultiplier: 0.2,
  brakingMultiplier: 15,
  awarenessMultiplier: 8,
  separationMultiplier: 1.25,
  frictionMultiplier: 0.00000333,
  colors: BOID_COLORS,
}

const result = generateRandomizedBoids(options)

beforeEach(() => {
  canvas = document.createElement("canvas")
  ctx = canvas.getContext("2d")
})

describe("actorHelper", () => {
  it("should generate an array of Boids within the specified constraints", () => {
    expect(result.length).toBe(options.total)
  })

  test.each(result)("should validate each Boid instance", (boid) => {
    expect(boid instanceof Boid).toBe(true)

    expect(options.colors).toContain(boid.config.color)
    expect(boid.config.size).toBeGreaterThanOrEqual(options.minSize)
    expect(boid.config.size).toBeLessThanOrEqual(options.maxSize)

    const spyInit = jest.spyOn(Boid.prototype, "init")
    boid.init()
    expect(spyInit).toHaveBeenCalled()
  })
})
