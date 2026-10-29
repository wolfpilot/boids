// Types
import { Vector } from "../../types/geometry"

// Utils
import { add, subtract, divide, multiply } from "../../utils/vectorHelper"
import { getInfluence } from "./helpers"

// Geometry
import VectorImpl from "../../geometry/Vector"
import { Options } from "./types"

// Find the average steering vector that will align with the rest of the "pack"
export const align = ({ boids, source }: Options): Vector => {
  let total = new VectorImpl(0, 0)
  let totalWeight = 0

  boids.forEach((boid) => {
    const influence = getInfluence(boid, source)
    if (influence === 0) return

    const difference = subtract(boid.state.velocity, source.state.velocity)
    total = add(total, multiply(difference, influence))
    totalWeight += influence
  })

  return divide(total, Math.max(1, totalWeight))
}
