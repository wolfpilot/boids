import "jest-canvas-mock"

// Utils
import { generateRandomizedBoids } from "./boidHelper"

// Constants
import { BOID_COLORS } from "../constants/colors"

// Actors
import Boid from "../actors/Boid/Boid"
import { mag } from "./vectorHelper"

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D | null
let randomBoids: Boid[] = []

const options = {
  total: 5,
  maxX: 1920,
  maxY: 1080,
  minSize: 10,
  maxSize: 15,
  maxSpeedMultiplier: 0.2,
  brakingMultiplier: 15,
  alignmentMultiplier: 8,
  cohesionMultiplier: 6,
  seekingMultiplier: 6,
  separationMultiplier: 1.25,
  frictionMultiplier: 0.00000333,
  colors: BOID_COLORS,
}

beforeEach(() => {
  canvas = document.createElement("canvas")
  ctx = canvas.getContext("2d")

  if (!ctx) return

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
      expect(boid.traits.maxSpeed).toBeGreaterThanOrEqual(
        boid.traits.size * options.maxSpeedMultiplier * 0.8
      )
      expect(boid.traits.maxSpeed).toBeLessThanOrEqual(
        boid.traits.size * options.maxSpeedMultiplier * 1.2
      )
      expect(boid.traits.maxSteeringForce).toBeGreaterThanOrEqual(0.4)
      expect(boid.traits.maxSteeringForce).toBeLessThanOrEqual(0.6)
      expect(mag(boid.state.velocity)).toBeCloseTo(boid.traits.maxSpeed * 0.3)

      expect(boid.state.location.x).toBeGreaterThanOrEqual(0)
      expect(boid.state.location.x).toBeLessThanOrEqual(options.maxX)
      expect(boid.traits.alignmentAreaSize).toBe(boid.traits.size * 8)
      expect(boid.traits.cohesionAreaSize).toBe(boid.traits.size * 6)
      expect(boid.traits.seekingAreaSize).toBe(boid.traits.size * 6)
    })
  })

  it("samples both ends of the individual speed and force ranges", () => {
    if (!ctx) throw new Error("No canvas context")
    const context = ctx
    const generate = () =>
      generateRandomizedBoids({ ...options, total: 1, ctx: context })[0]

    jest.spyOn(Math, "random").mockReturnValue(0)
    const minimum = generate()
    expect(minimum.traits.maxSpeed).toBeCloseTo(
      minimum.traits.size * options.maxSpeedMultiplier * 0.8
    )
    expect(minimum.traits.maxSteeringForce).toBe(0.4)
    expect(minimum.state.velocity.y).toBe(0)

    jest.spyOn(Math, "random").mockReturnValue(0.999999)
    const maximum = generate()
    expect(maximum.traits.maxSpeed).toBeCloseTo(
      maximum.traits.size * options.maxSpeedMultiplier * 1.2
    )
    expect(maximum.traits.maxSteeringForce).toBeCloseTo(0.6)
    expect(mag(maximum.state.velocity)).toBeCloseTo(
      maximum.traits.maxSpeed * 0.3
    )
    jest.restoreAllMocks()
  })
})
