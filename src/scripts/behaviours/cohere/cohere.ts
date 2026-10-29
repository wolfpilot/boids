import VectorImpl from "../../geometry/Vector"
import { Vector } from "../../types/geometry"
import { add, divide, multiply, subtract } from "../../utils/vectorHelper"
import { getInfluence } from "./helpers"
import { Options } from "./types"

export const cohere = ({ boids, source }: Options): Vector => {
  let total = new VectorImpl(0, 0)
  let totalWeight = 0

  boids.forEach((boid) => {
    const influence = getInfluence(boid, source)
    if (influence === 0) return

    const offset = subtract(boid.state.location, source.state.location)
    total = add(total, multiply(offset, influence))
    totalWeight += influence
  })

  return divide(total, Math.max(1, totalWeight))
}
