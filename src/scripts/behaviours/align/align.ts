// Types
import { Vector } from "../../types/geometry"

// Utils
import { add, subtract, divide } from "../../utils/vectorHelper"
import { isInRange } from "./helpers"

// Geometry
import VectorImpl from "../../geometry/Vector"
import { Options } from "./types"

// Find the average steering vector that will align with the rest of the "pack"
export const align = ({ boids, source }: Options): Vector => {
  const neighbours = boids.filter((boid) => isInRange(boid, source))

  if (neighbours.length === 0) return new VectorImpl(0, 0)

  // Calculate the overall group direction
  const groupVelocity = neighbours
    .map((boid) => boid.state.velocity)
    .reduce((acc, val) => add(acc, val))

  const averageVelocity = divide(groupVelocity, neighbours.length)

  return subtract(averageVelocity, source.state.velocity)
}
