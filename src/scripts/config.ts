// Constants
import { BOID_COLORS } from "./constants/colors"

export const config = {
  boids: {
    total: 20,
    minSize: 30,
    maxSize: 60,
    maxSpeedMultiplier: 0.2,
    brakingMultiplier: 0.15,
    awarenessMultiplier: 8,
    separationMultiplier: 1.25,
    frictionMultiplier: 0.00000333,
    colors: BOID_COLORS,
  },
}
