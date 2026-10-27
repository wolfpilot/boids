// Types
import { Vector } from "../../types/geometry"

// Utils
import {
  add,
  subtract,
  multiply,
  normalize,
  mag,
} from "../../utils/vectorHelper"
import { isInRange } from "./helpers"

// Geometry
import VectorImpl from "../../geometry/Vector"
import { Options } from "./types"

// Keep a distance from neighbouring boids
export const separate = ({ boids, source }: Options): Vector => {
  let separate = new VectorImpl(0, 0)

  const neighbours = boids.filter((boid) => isInRange(boid, source))

  neighbours.forEach((boid) => {
    const offset = subtract(source.state.location, boid.state.location)
    const distance = mag(offset)
    const desired = multiply(normalize(offset), 1 / distance)

    separate = add(separate, desired)
  })

  return separate
}
