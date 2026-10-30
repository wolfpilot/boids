import { wrapLocation } from "@engine/utils/wrapLocation"

const bounds = { width: 100, height: 80 }

describe("wrapLocation", () => {
  it("wraps only after the whole boid exits each edge", () => {
    expect(wrapLocation({ x: -11, y: 40 }, 10, bounds)).toEqual({
      x: 110,
      y: 40,
    })
    expect(wrapLocation({ x: 111, y: 40 }, 10, bounds)).toEqual({
      x: -10,
      y: 40,
    })
    expect(wrapLocation({ x: 50, y: -11 }, 10, bounds)).toEqual({
      x: 50,
      y: 90,
    })
    expect(wrapLocation({ x: 50, y: 91 }, 10, bounds)).toEqual({
      x: 50,
      y: -10,
    })
  })

  it("keeps boids at and inside the exit thresholds", () => {
    expect(wrapLocation({ x: -10, y: 90 }, 10, bounds)).toEqual({
      x: -10,
      y: 90,
    })
    expect(wrapLocation({ x: 110, y: -10 }, 10, bounds)).toEqual({
      x: 110,
      y: -10,
    })
  })

  it("wraps both axes independently without changing the input", () => {
    const location = { x: -11, y: 91 }

    expect(wrapLocation(location, 10, bounds)).toEqual({ x: 110, y: -10 })
    expect(location).toEqual({ x: -11, y: 91 })
  })

  it("uses the latest bounds and ignores dimensions that are not ready", () => {
    const location = { x: 75, y: 51 }

    expect(wrapLocation(location, 10, bounds)).toEqual(location)
    expect(wrapLocation(location, 10, { width: 60, height: 40 })).toEqual({
      x: -10,
      y: -10,
    })
    expect(wrapLocation(location, 10, { width: 0, height: 0 })).toEqual(
      location
    )
  })
})
