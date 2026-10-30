import { config } from "../../actors/Boid/config"
import type { FlockDynamics, SteeringWeights } from "../../behaviours/types"
import { PHYSICS_UPDATES_PER_SECOND } from "../Loop"
import { getFlockDynamics } from "./getFlockDynamics"

const quarterCycle = (seconds: number) =>
  (seconds * PHYSICS_UPDATES_PER_SECOND) / 4

describe("getFlockDynamics", () => {
  it("starts with the configured radii and weights", () => {
    expect(getFlockDynamics(0)).toEqual({
      alignmentRadiusMultiplier: 1,
      cohesionRadiusMultiplier: 1,
      separationRadiusMultiplier: 1,
      steeringWeights: config.steeringWeights,
    })
  })

  it("cycles each radius above and below its base value", () => {
    const cycles: Array<{
      key: keyof Pick<
        FlockDynamics,
        | "alignmentRadiusMultiplier"
        | "cohesionRadiusMultiplier"
        | "separationRadiusMultiplier"
      >
      periodSeconds: number
      amplitude: number
    }> = [
      { key: "alignmentRadiusMultiplier", periodSeconds: 12, amplitude: 0.2 },
      { key: "cohesionRadiusMultiplier", periodSeconds: 24, amplitude: 0.25 },
      { key: "separationRadiusMultiplier", periodSeconds: 10, amplitude: 0.15 },
    ]

    for (const { key, periodSeconds, amplitude } of cycles) {
      expect(getFlockDynamics(quarterCycle(periodSeconds))[key]).toBeCloseTo(
        1 + amplitude
      )
      expect(
        getFlockDynamics(quarterCycle(periodSeconds) * 3)[key]
      ).toBeCloseTo(1 - amplitude)
    }
  })

  it("cycles only the three flocking weights", () => {
    const cycles: Array<{
      key: keyof Pick<SteeringWeights, "alignment" | "cohesion" | "separation">
      periodSeconds: number
      amplitude: number
    }> = [
      { key: "alignment", periodSeconds: 20, amplitude: 0.25 },
      { key: "cohesion", periodSeconds: 48, amplitude: 0.25 },
      { key: "separation", periodSeconds: 16, amplitude: 0.2 },
    ]

    for (const { key, periodSeconds, amplitude } of cycles) {
      const baseWeight = config.steeringWeights[key]
      expect(
        getFlockDynamics(quarterCycle(periodSeconds)).steeringWeights[key]
      ).toBeCloseTo(baseWeight * (1 + amplitude))
      expect(
        getFlockDynamics(quarterCycle(periodSeconds) * 3).steeringWeights[key]
      ).toBeCloseTo(baseWeight * (1 - amplitude))
    }

    expect(getFlockDynamics(quarterCycle(20)).steeringWeights.wander).toBe(
      config.steeringWeights.wander
    )
    expect(getFlockDynamics(quarterCycle(20)).steeringWeights.seek).toBe(
      config.steeringWeights.seek
    )
    expect(config.steeringWeights.alignment).toBe(0.5)
  })
})
