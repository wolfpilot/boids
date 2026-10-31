import "jest-canvas-mock"

// Utils
import { generateRandomizedBoids } from "@utils/boidHelper"
import { getTheme } from "@theme/helpers"

// Constants
import { ThemeNames } from "@theme/types"

// Actors
import Boid from "@actors/Boid/Boid"
import { config as boidConfig } from "@actors/Boid/config"
import { mag } from "@utils/vectorHelper"

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
  fleeingMultiplier: 6,
  separationMultiplier: 1.25,
  frictionMultiplier: 0.33,
  colors: getTheme(ThemeNames.default).boids,
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

afterEach(() => {
  jest.restoreAllMocks()
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
        boid.traits.size *
          options.maxSpeedMultiplier *
          boidConfig.individualSpeedMultiplier.min
      )
      expect(boid.traits.maxSpeed).toBeLessThanOrEqual(
        boid.traits.size *
          options.maxSpeedMultiplier *
          boidConfig.individualSpeedMultiplier.max
      )
      expect(boid.traits.maxSteeringForce).toBeGreaterThanOrEqual(
        boidConfig.individualSteeringForce.min
      )
      expect(boid.traits.maxSteeringForce).toBeLessThanOrEqual(
        boidConfig.individualSteeringForce.max
      )
      expect(mag(boid.state.velocity)).toBeCloseTo(
        boid.traits.maxSpeed * boidConfig.initialSpeedFraction
      )
      expect(boid.traits.frictionFactor).toBeCloseTo(
        boid.traits.size ** 3 * options.frictionMultiplier * 1e-5
      )

      expect(boid.state.location.x).toBeGreaterThanOrEqual(0)
      expect(boid.state.location.x).toBeLessThanOrEqual(options.maxX)
      expect(boid.traits.alignmentAreaSize).toBe(boid.traits.size * 8)
      expect(boid.traits.cohesionAreaSize).toBe(boid.traits.size * 6)
      expect(boid.traits.seekingAreaSize).toBe(boid.traits.size * 6)
      expect(boid.traits.fleeingAreaSize).toBe(boid.traits.size * 6)
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
      minimum.traits.size *
        options.maxSpeedMultiplier *
        boidConfig.individualSpeedMultiplier.min
    )
    expect(minimum.traits.maxSteeringForce).toBe(
      boidConfig.individualSteeringForce.min
    )
    expect(minimum.state.velocity.y).toBe(0)

    jest.spyOn(Math, "random").mockReturnValue(0.999999)
    const maximum = generate()
    expect(maximum.traits.maxSpeed).toBeCloseTo(
      maximum.traits.size *
        options.maxSpeedMultiplier *
        boidConfig.individualSpeedMultiplier.max
    )
    expect(maximum.traits.maxSteeringForce).toBeCloseTo(
      boidConfig.individualSteeringForce.max
    )
    expect(mag(maximum.state.velocity)).toBeCloseTo(
      maximum.traits.maxSpeed * boidConfig.initialSpeedFraction
    )
  })
})
