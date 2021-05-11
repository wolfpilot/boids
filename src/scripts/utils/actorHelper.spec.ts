import "jest-canvas-mock"

// Utils
import { generateBoid } from "./actorHelper"

// Actors
import Boid from "../actors/Boid/Boid"

import Vector from "../geometry/Vector"

let windowSpy
let canvas
let ctx

beforeEach(() => {
  windowSpy = jest.spyOn(window, "window", "get")
  canvas = document.createElement("canvas")
  ctx = canvas.getContext("2d")
})

afterEach(() => {
  windowSpy.mockRestore()
})

describe("actorHelper", () => {
  it("should generate a pre-configured Boid instance", () => {
    const options = {
      id: 5,
      ctx,
      x: 100,
      y: 500,
      size: 20,
      brakingFactor: 20,
      awarenessFactor: 10,
      color: "#d23444",
    }

    const result = generateBoid(options)
    expect(result instanceof Boid).toBe(true)
    expect(result.config.color).toBe(options.color)
    expect(result.state.location).toStrictEqual(
      new Vector(options.x, options.y)
    )

    const spyInit = jest.spyOn(Boid.prototype, "init")
    result.init()
    expect(spyInit).toHaveBeenCalled()
  })
})
