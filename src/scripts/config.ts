// Constants
import { BOID_COLORS } from "./constants/colors"

export const config = {
  boids: {
    total: 50,
    minSize: 15,
    maxSize: 40,
    maxSpeedMultiplier: 0.125,
    brakingMultiplier: 0.15,
    alignmentMultiplier: 8,
    cohesionMultiplier: 3,
    seekingMultiplier: 6,
    separationMultiplier: 1.25,
    frictionMultiplier: 0.00000333,
    colors: BOID_COLORS,
  },
}
