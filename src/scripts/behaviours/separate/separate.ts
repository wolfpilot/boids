// Types
import { Vector } from "@ts/geometry"

// Utils
import { add, subtract, multiply, mag } from "@utils/vectorHelper"
import { getInfluence } from "@behaviours/separate/helpers"

// Geometry
import VectorImpl from "@geometry/Vector"
import { Options } from "@behaviours/separate/types"

// Keep a distance from neighbouring boids
export const separate = ({ boids, source }: Options): Vector => {
  let separate = new VectorImpl(0, 0)

  boids.forEach((boid) => {
    const influence = getInfluence(boid, source)
    if (influence === 0) return

    const offset = subtract(source.state.location, boid.state.location)
    const distance = mag(offset)
    const softening = (source.traits.size + boid.traits.size) / 4
    const desired = multiply(
      offset,
      influence / (distance * distance + softening * softening)
    )

    separate = add(separate, desired)
  })

  return separate
}
