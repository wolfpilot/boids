import { config } from "../../actors/Boid/config"
import type { FlockDynamics } from "../../behaviours/types"
import { PHYSICS_UPDATES_PER_SECOND } from "../Loop"

const cycle = (updateIndex: number, periodSeconds: number, amplitude: number) =>
  1 +
  amplitude *
    Math.sin(
      (2 * Math.PI * updateIndex) / (periodSeconds * PHYSICS_UPDATES_PER_SECOND)
    )

export const getFlockDynamics = (updateIndex: number): FlockDynamics => ({
  alignmentRadiusMultiplier: cycle(updateIndex, 12, 0.2),
  cohesionRadiusMultiplier: cycle(updateIndex, 24, 0.25),
  separationRadiusMultiplier: cycle(updateIndex, 10, 0.15),
  steeringWeights: {
    ...config.steeringWeights,
    alignment: config.steeringWeights.alignment * cycle(updateIndex, 20, 0.25),
    cohesion: config.steeringWeights.cohesion * cycle(updateIndex, 48, 0.25),
    separation: config.steeringWeights.separation * cycle(updateIndex, 16, 0.2),
  },
})
