import type { BoidEntity } from "../../types/entities"
import type { Vector } from "../../types/geometry"
import { createBoidEntity } from "../../utils/testHelpers"
import { mag } from "../../utils/vectorHelper"
import { stepBoids } from "./stepBoids"

const createRandom = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 2 ** 32
  return seed / 2 ** 32
}

const traitsForSize = (size: number) => ({
  size,
  maxSpeed: size * 0.1,
  frictionFactor: size ** 3 * 0.00000333,
  brakingDistance: size ** 2 * 0.15,
  alignmentAreaSize: size * 8,
  cohesionAreaSize: size * 6,
  seekingAreaSize: size * 6,
  separationAreaSize: size * 1.25,
})

const distance = (a: Vector, b: Vector) => Math.hypot(a.x - b.x, a.y - b.y)

const centerOf = (boids: readonly BoidEntity[]): Vector =>
  boids.reduce(
    (center, boid) => ({
      x: center.x + boid.state.location.x / boids.length,
      y: center.y + boid.state.location.y / boids.length,
    }),
    { x: 0, y: 0 }
  )

describe("flocking over time", () => {
  afterEach(() => jest.restoreAllMocks())

  it.each([1, 2, 3])(
    "forms moving flocks from 100 scattered boids with seed %s",
    (seed) => {
      const bounds = { width: 1277, height: 1229 }
      const spawnRandom = createRandom(seed)
      let snapshot = Array.from({ length: 100 }, (_, id) => {
        const size = 10 + spawnRandom() * 10

        return createBoidEntity({
          id,
          traits: traitsForSize(size),
          state: {
            location: {
              x: spawnRandom() * bounds.width,
              y: spawnRandom() * bounds.height,
            },
            wanderAngle: spawnRandom() * Math.PI * 2,
          },
        })
      })
      jest.spyOn(Math, "random").mockImplementation(createRandom(seed + 1000))

      for (let update = 0; update < 30 * 60; update++) {
        snapshot = stepBoids({ snapshot, bounds })
      }

      let headingAgreement = 0
      let neighbourPairs = 0
      let speedFraction = 0

      for (const source of snapshot) {
        const speed = mag(source.state.velocity)
        speedFraction += speed / source.traits.maxSpeed
        expect(speed).toBeLessThanOrEqual(source.traits.maxSpeed + 1e-12)

        for (const neighbour of snapshot) {
          if (
            neighbour.id === source.id ||
            distance(source.state.location, neighbour.state.location) >=
              source.traits.cohesionAreaSize
          )
            continue

          const neighbourSpeed = mag(neighbour.state.velocity)
          if (speed === 0 || neighbourSpeed === 0) continue

          headingAgreement +=
            (source.state.velocity.x * neighbour.state.velocity.x +
              source.state.velocity.y * neighbour.state.velocity.y) /
            (speed * neighbourSpeed)
          neighbourPairs++
        }
      }

      expect(neighbourPairs).toBeGreaterThan(100)
      expect(headingAgreement / neighbourPairs).toBeGreaterThan(0.9)
      expect(speedFraction / snapshot.length).toBeGreaterThan(0.5)
    },
    30000
  )

  it("keeps two distant mixed-size groups moving together for 20 seconds", () => {
    const offsets = [
      [-25, -15],
      [-25, 15],
      [0, 0],
      [25, -15],
      [25, 15],
    ]
    const sizes = [10, 15, 20, 15, 10]
    let snapshot = [5000, 10000].flatMap((y, group) =>
      offsets.map(([dx, dy], index) =>
        createBoidEntity({
          id: group * 5 + index,
          traits: traitsForSize(sizes[index]),
          state: {
            location: { x: 5000 + dx, y: y + dy },
            wanderAngle: (index - 2) * 0.15,
          },
        })
      )
    )
    const initialCenters = [
      centerOf(snapshot.slice(0, 5)),
      centerOf(snapshot.slice(5)),
    ]
    let previousCenters = initialCenters
    let maximumRadius = 0
    const windowDistances: number[] = []
    jest.spyOn(Math, "random").mockReturnValue(0)

    for (let update = 1; update <= 20 * 60; update++) {
      snapshot = stepBoids({
        snapshot,
        bounds: { width: 20000, height: 20000 },
      })
      const groups = [snapshot.slice(0, 5), snapshot.slice(5)]
      const centers = groups.map(centerOf)

      groups.forEach((group, index) => {
        maximumRadius = Math.max(
          maximumRadius,
          ...group.map((boid) => distance(boid.state.location, centers[index]))
        )
      })

      if (update % 120 === 0) {
        if (update > 120)
          centers.forEach((center, index) =>
            windowDistances.push(distance(center, previousCenters[index]))
          )
        previousCenters = centers
      }
    }

    expect(maximumRadius).toBeLessThan(80)
    expect(Math.min(...windowDistances)).toBeGreaterThan(50)
    previousCenters.forEach((center, index) => {
      expect(distance(center, initialCenters[index])).toBeGreaterThan(500)
    })
    expect(distance(previousCenters[0], previousCenters[1])).toBeGreaterThan(
      2000
    )
  })

  it.each([10, 20])("wanders broadly from rest at size %s", (size) => {
    let snapshot = [
      createBoidEntity({
        traits: traitsForSize(size),
        state: { location: { x: 5000, y: 5000 } },
      }),
    ]
    let previous = snapshot[0].state.location
    const windowDistances: number[] = []
    jest.spyOn(Math, "random").mockImplementation(createRandom(42))

    for (let update = 1; update <= 10 * 60; update++) {
      snapshot = stepBoids({
        snapshot,
        bounds: { width: 20000, height: 20000 },
      })

      if (update % 120 === 0) {
        const location = snapshot[0].state.location
        windowDistances.push(distance(location, previous))
        previous = location
      }
    }

    expect(Math.min(...windowDistances)).toBeGreaterThan(size * 5)
    expect(mag(snapshot[0].state.velocity)).toBeLessThanOrEqual(size * 0.1)
  })

  it("turns a nearby flock toward the pointer while retaining neighbour forces", () => {
    const target = { x: 5050, y: 5000 }
    let snapshot = [10, 15, 20].map((size, id) =>
      createBoidEntity({
        id,
        traits: traitsForSize(size),
        state: {
          location: { x: 5000, y: 4980 + id * 20 },
          velocity: { x: -size * 0.1, y: 0 },
        },
      })
    )
    const averageDistance = (boids: BoidEntity[]) =>
      boids.reduce(
        (total, boid) =>
          total + distance(boid.state.location, target) / boids.length,
        0
      )
    const initialDistance = averageDistance(snapshot)
    jest.spyOn(Math, "random").mockReturnValue(0)

    for (let update = 0; update < 120; update++) {
      snapshot = stepBoids({
        snapshot,
        target,
        bounds: { width: 20000, height: 20000 },
      })
    }

    expect(averageDistance(snapshot)).toBeLessThan(initialDistance * 0.75)
    expect(
      distance(snapshot[0].state.location, snapshot[1].state.location)
    ).toBeGreaterThan(10)
  })
})
