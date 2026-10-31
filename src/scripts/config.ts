// Constants
import { behaviours } from "@behaviours/types"
import { BOID_COLORS } from "@constants/colors"

export const config = {
  engine: {
    maxFps: 144,
    logFps: true,
  },
  pointer: {
    mode: behaviours.flee,
  },
  vector: {
    showTargetVector: false,
    showNormalizedTargetVector: false,
    showVelocityVector: true,
    showAlignmentArea: false,
    showCohesionArea: false,
    showSeekingArea: false,
    showFleeingArea: false,
    showSeparationArea: false,
    showStoppingArea: false,
  },
  boids: {
    total: 50,
    minSize: 15,
    maxSize: 40,
    maxSpeedMultiplier: 0.2,
    brakingMultiplier: 0.05,
    alignmentMultiplier: 8,
    cohesionMultiplier: 3,
    seekingMultiplier: 6,
    fleeingMultiplier: 10,
    separationMultiplier: 1.25,
    frictionMultiplier: 0.33,
    colors: BOID_COLORS,
  },
}
