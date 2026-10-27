import { stepBoids } from "./stepBoids"
import { createBoidEntity } from "../../utils/testHelpers"

const bounds = { width: 1000, height: 1000 }

describe("stepBoids", () => {
  it("uses one snapshot regardless of boid update order", () => {
    const first = createBoidEntity({
      id: 1,
      state: { location: { x: 0, y: 0 }, velocity: { x: 0.2, y: 0 } },
    })
    const second = createBoidEntity({
      id: 2,
      state: { location: { x: 5, y: 0 }, velocity: { x: -0.1, y: 0 } },
    })
    const target = { x: 20, y: 0 }

    const forward = stepBoids({
      snapshot: [first, second],
      target,
      bounds,
    })
    const reverse = stepBoids({
      snapshot: [second, first],
      target,
      bounds,
    })

    expect(forward).toEqual(reverse.reverse())
    expect(first.state.location).toEqual({ x: 0, y: 0 })
    expect(second.state.location).toEqual({ x: 5, y: 0 })
  })

  it("allows a nearby boid to move an agent at its target", () => {
    const source = createBoidEntity({
      id: 1,
      traits: { size: 1, separationAreaSize: 9, cohesionAreaSize: 0 },
    })
    const neighbour = createBoidEntity({
      id: 2,
      traits: { size: 1 },
      state: { location: { x: 5, y: 0 } },
    })

    const target = { x: 0, y: 0 }
    const [updated] = stepBoids({
      snapshot: [source, neighbour],
      target,
      bounds,
    })

    expect(updated.state.location.x).toBeLessThan(0)
    expect(updated.state.velocity.x).toBeLessThan(0)
  })

  it("stops a slow boid near its target without neighbour steering", () => {
    const source = createBoidEntity({
      state: {
        location: { x: 10, y: 20 },
        velocity: { x: 0.05, y: 0 },
        acceleration: { x: 1, y: 2 },
      },
    })

    const [updated] = stepBoids({
      snapshot: [source],
      target: { x: 11, y: 20 },
      bounds,
    })

    expect(updated.state.location).toEqual({ x: 10, y: 20 })
    expect(updated.state.targetVector).toEqual({ x: 1, y: 0 })
    expect(updated.state.normTargetVector).toEqual({ x: 1, y: 0 })
    expect(updated.state.acceleration).toEqual({ x: 0, y: 0 })
    expect(updated.state.velocity).toEqual({ x: 0, y: 0 })
    expect(source.state.velocity).toEqual({ x: 0.05, y: 0 })
  })

  it("integrates steering and friction when advancing a boid", () => {
    const source = createBoidEntity({
      traits: { frictionFactor: 0.2, seekingAreaSize: 200 },
      state: {
        location: { x: 10, y: 20 },
        velocity: { x: 0.2, y: 0 },
        acceleration: { x: 0.1, y: 0 },
      },
    })

    const [updated] = stepBoids({
      snapshot: [source],
      target: { x: 110, y: 20 },
      bounds,
    })

    expect(updated.state.velocity.x).toBeCloseTo(0.66)
    expect(updated.state.location.x).toBeCloseTo(10.66)
    expect(updated.state.location.y).toBe(20)
    expect(updated.state.acceleration).toEqual({ x: 0, y: 0 })
    expect(updated.state.targetVector).toEqual({ x: 100, y: 0 })
    expect(source.state.location).toEqual({ x: 10, y: 20 })
  })

  it("seeks inside its range and wanders outside it", () => {
    const source = createBoidEntity({
      traits: { seekingAreaSize: 30 },
      state: { wanderAngle: Math.PI / 2 },
    })
    const random = jest.spyOn(Math, "random").mockReturnValue(0.5)

    try {
      const [seeking] = stepBoids({
        snapshot: [source],
        target: { x: 20, y: 0 },
        bounds,
      })
      const [wandering] = stepBoids({
        snapshot: [source],
        target: { x: 30, y: 0 },
        bounds,
      })
      const [absent] = stepBoids({
        snapshot: [source],
        bounds,
      })

      expect(seeking.state.location.x).toBeGreaterThan(0)
      expect(seeking.state.location.y).toBe(0)
      expect(seeking.state.targetVector).toEqual({ x: 20, y: 0 })
      expect(seeking.state.wanderAngle).toBe(source.state.wanderAngle)

      expect(wandering.state.location.x).toBeCloseTo(0)
      expect(wandering.state.location.y).toBeGreaterThan(0)
      expect(wandering.state.targetVector).toEqual({ x: 0, y: 0 })
      expect(wandering.state.normTargetVector).toEqual({ x: 0, y: 0 })
      expect(wandering).toEqual(absent)
      expect(source.state.location).toEqual({ x: 0, y: 0 })
    } finally {
      random.mockRestore()
    }
  })

  it("applies the stop rule only while seeking", () => {
    const source = createBoidEntity({
      state: { wanderAngle: Math.PI / 2 },
    })
    const random = jest.spyOn(Math, "random").mockReturnValue(0.5)

    try {
      const [seeking] = stepBoids({
        snapshot: [source],
        target: { x: 0, y: 0 },
        bounds,
      })
      const [wandering] = stepBoids({
        snapshot: [source],
        bounds,
      })

      expect(seeking.state.location).toEqual({ x: 0, y: 0 })
      expect(seeking.state.velocity).toEqual({ x: 0, y: 0 })
      expect(wandering.state.location.y).toBeGreaterThan(0)
    } finally {
      random.mockRestore()
    }
  })

  it("retains neighbour steering while wandering", () => {
    const source = createBoidEntity({
      id: 1,
      traits: { size: 1, separationAreaSize: 9, cohesionAreaSize: 0 },
      state: { wanderAngle: Math.PI / 2 },
    })
    const neighbour = createBoidEntity({
      id: 2,
      traits: { size: 1 },
      state: { location: { x: 5, y: 0 } },
    })
    const random = jest.spyOn(Math, "random").mockReturnValue(0.5)

    try {
      const [updated] = stepBoids({
        snapshot: [source, neighbour],
        bounds,
      })

      expect(updated.state.location.x).toBeLessThan(0)
      expect(updated.state.location.y).toBeGreaterThan(0)
    } finally {
      random.mockRestore()
    }
  })

  it("combines cohesion with wandering and seeking", () => {
    const source = createBoidEntity({
      id: 1,
      traits: {
        alignmentAreaSize: 0,
        separationAreaSize: 0,
        cohesionAreaSize: 100,
      },
      state: { location: { x: 100, y: 100 }, wanderAngle: Math.PI / 2 },
    })
    const neighbour = createBoidEntity({
      id: 2,
      state: { location: { x: 140, y: 100 } },
    })
    const random = jest.spyOn(Math, "random").mockReturnValue(0.5)

    try {
      const [wandering] = stepBoids({ snapshot: [source, neighbour], bounds })
      const [seeking] = stepBoids({
        snapshot: [source, neighbour],
        target: { x: 100, y: 140 },
        bounds,
      })

      expect(wandering.state.location.x).toBeGreaterThan(100)
      expect(wandering.state.location.y).toBeGreaterThan(100)
      expect(seeking.state.location.x).toBeGreaterThan(100)
      expect(seeking.state.location.y).toBeGreaterThan(100)
      expect(seeking.state.velocity.x).toBeCloseTo(0.2)
      expect(source.state.location).toEqual({ x: 100, y: 100 })
    } finally {
      random.mockRestore()
    }
  })

  it("computes cohesion from the same snapshot in either order", () => {
    const first = createBoidEntity({
      id: 1,
      traits: { alignmentAreaSize: 0, separationAreaSize: 0 },
      state: { location: { x: 100, y: 100 } },
    })
    const second = createBoidEntity({
      id: 2,
      traits: { alignmentAreaSize: 0, separationAreaSize: 0 },
      state: { location: { x: 140, y: 100 } },
    })
    const target = { x: 100, y: 140 }

    const forward = stepBoids({ snapshot: [first, second], target, bounds })
    const reverse = stepBoids({ snapshot: [second, first], target, bounds })

    expect(forward).toEqual(reverse.reverse())
    expect(first.state.location).toEqual({ x: 100, y: 100 })
    expect(second.state.location).toEqual({ x: 140, y: 100 })
  })

  it("draws nearby pairs together without attracting distant groups", () => {
    const traits = {
      alignmentAreaSize: 0,
      separationAreaSize: 0,
      cohesionAreaSize: 60,
    }
    const snapshot = [100, 140, 500, 540].map((x, id) =>
      createBoidEntity({
        id,
        traits,
        state: { location: { x, y: 100 }, wanderAngle: Math.PI / 2 },
      })
    )
    const random = jest.spyOn(Math, "random").mockReturnValue(0.5)

    try {
      const updated = stepBoids({ snapshot, bounds })
      const reversed = stepBoids({ snapshot: [...snapshot].reverse(), bounds })

      expect(updated).toEqual(reversed.reverse())
      expect(updated[0].state.velocity.x).toBeGreaterThan(0)
      expect(updated[1].state.velocity.x).toBeLessThan(0)
      expect(updated[2].state.velocity.x).toBeCloseTo(
        updated[0].state.velocity.x
      )
      expect(updated[3].state.velocity.x).toBeCloseTo(
        updated[1].state.velocity.x
      )
      expect(
        updated[1].state.location.x - updated[0].state.location.x
      ).toBeLessThan(40)
      expect(
        updated[3].state.location.x - updated[2].state.location.x
      ).toBeLessThan(40)
      expect(updated[2].state.location.x - updated[0].state.location.x).toBe(
        400
      )
      expect(snapshot[0].state.location.x).toBe(100)
    } finally {
      random.mockRestore()
    }
  })

  it("keeps large boids moving apart when wandering opposes cohesion", () => {
    const traits = {
      size: 60,
      maxSpeed: 6,
      frictionFactor: 0.72,
      alignmentAreaSize: 0,
      separationAreaSize: 0,
      cohesionAreaSize: 360,
    }
    const first = createBoidEntity({
      id: 1,
      traits,
      state: { location: { x: 500, y: 500 }, wanderAngle: Math.PI },
    })
    const second = createBoidEntity({
      id: 2,
      traits,
      state: { location: { x: 700, y: 500 }, wanderAngle: 0 },
    })
    const random = jest.spyOn(Math, "random").mockReturnValue(0.5)

    try {
      let snapshot = [first, second]

      for (let update = 0; update < 120; update++) {
        snapshot = stepBoids({
          snapshot,
          bounds: { width: 5000, height: 2000 },
        })
      }

      expect(
        snapshot[1].state.location.x - snapshot[0].state.location.x
      ).toBeGreaterThan(500)
      expect(snapshot[0].state.velocity.x).toBeLessThan(-1)
      expect(snapshot[1].state.velocity.x).toBeGreaterThan(1)
    } finally {
      random.mockRestore()
    }
  })

  it("wraps a moving boid after it fully exits without changing the snapshot", () => {
    const source = createBoidEntity({
      traits: { size: 10 },
      state: {
        location: { x: 110, y: 40 },
        velocity: { x: 0.2, y: 0 },
        wanderAngle: 0,
      },
    })
    const random = jest.spyOn(Math, "random").mockReturnValue(0.5)

    try {
      const [updated] = stepBoids({
        snapshot: [source],
        bounds: { width: 100, height: 80 },
      })

      expect(updated.state.location).toEqual({ x: -10, y: 40 })
      expect(updated.state.velocity.x).toBeGreaterThan(0)
      expect(source.state.location).toEqual({ x: 110, y: 40 })
      expect(source.state.velocity).toEqual({ x: 0.2, y: 0 })
    } finally {
      random.mockRestore()
    }
  })

  it("wraps a stopped boid that becomes fully outside after resize", () => {
    const source = createBoidEntity({
      state: { location: { x: 75, y: 20 } },
    })
    const [updated] = stepBoids({
      snapshot: [source],
      target: { x: 75, y: 20 },
      bounds: { width: 60, height: 40 },
    })

    expect(updated.state.location).toEqual({ x: -10, y: 20 })
    expect(updated.state.velocity).toEqual({ x: 0, y: 0 })
    expect(source.state.location).toEqual({ x: 75, y: 20 })
  })
})
