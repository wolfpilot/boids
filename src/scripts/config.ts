// Constants
import { BOID_COLORS } from "@constants/colors"

export const config = {
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
