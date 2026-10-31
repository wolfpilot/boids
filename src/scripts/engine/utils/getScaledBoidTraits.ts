import type { BoidTraits } from "@actors/Boid/types"
import { config } from "../../config"
import type { BoidMultipliers } from "@stores/gui/gui.types"

const scale = (original: number, initial: number, current: number): number =>
  original * (current / initial)

export const getScaledBoidTraits = (
  original: BoidTraits,
  multipliers: BoidMultipliers
): BoidTraits => ({
  ...original,
  maxSpeed: scale(
    original.maxSpeed,
    config.boids.maxSpeedMultiplier,
    multipliers.maxSpeedMultiplier
  ),
  brakingDistance: scale(
    original.brakingDistance,
    config.boids.brakingMultiplier,
    multipliers.brakingMultiplier
  ),
  alignmentAreaSize: scale(
    original.alignmentAreaSize,
    config.boids.alignmentMultiplier,
    multipliers.alignmentMultiplier
  ),
  cohesionAreaSize: scale(
    original.cohesionAreaSize,
    config.boids.cohesionMultiplier,
    multipliers.cohesionMultiplier
  ),
  seekingAreaSize: scale(
    original.seekingAreaSize,
    config.boids.seekingMultiplier,
    multipliers.seekingMultiplier
  ),
  fleeingAreaSize: scale(
    original.fleeingAreaSize,
    config.boids.fleeingMultiplier,
    multipliers.fleeingMultiplier
  ),
  separationAreaSize: scale(
    original.separationAreaSize,
    config.boids.separationMultiplier,
    multipliers.separationMultiplier
  ),
  frictionFactor: scale(
    original.frictionFactor,
    config.boids.frictionMultiplier,
    multipliers.frictionMultiplier
  ),
})
