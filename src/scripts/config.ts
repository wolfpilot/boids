// Constants
import { BOID_COLORS } from "./constants/colors"

export const config = {
  boids: {
    total: 20,
    minSize: 30,
    maxSize: 60,
    brakingFactor: 15,
    awarenessFactor: 10,
    colors: BOID_COLORS,
  },
}
