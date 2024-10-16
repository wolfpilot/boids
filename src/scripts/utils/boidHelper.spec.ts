import "jest-canvas-mock"

// Utils
import { generateRandomizedBoids } from "./boidHelper"

// Constants
import { BOID_COLORS } from "../constants/colors"

// Actors
import Boid from "../actors/Boid/Boid"

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
let randomBoids: Boid[] = []

const options = {
  total: 5,
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

beforeEach(() => {
  canvas = document.createElement("canvas")
  ctx = canvas.getContext("2d")

  randomBoids = generateRandomizedBoids({
    ...options,
    ctx,
  })
})

describe("actorHelper", () => {
  it("should generate an array of Boids within the specified constraints", () => {
    expect(randomBoids.length).toBe(options.total)

    /**
     * Use JS forEach loop as test.each() does not work
     * with dynamically-generated mock data.
     *
     * For more info, see:
     * https://github.com/facebook/jest/issues/6888
     */
    randomBoids.forEach((boid) => {
      expect(boid instanceof Boid).toBe(true)

      expect(options.colors).toContain(boid.traits.color)
      expect(boid.traits.size).toBeGreaterThanOrEqual(options.minSize)
      expect(boid.traits.size).toBeLessThanOrEqual(options.maxSize)

      const spyInit = jest.spyOn(Boid.prototype, "init")
      boid.init()
      expect(spyInit).toHaveBeenCalled()
    })
  })
})
