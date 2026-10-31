import VectorImpl from "@geometry/Vector"
import type { Vector } from "@ts/geometry"
import { mag, multiply, normalize, subtract } from "@utils/vectorHelper"
import type { Options } from "@behaviours/flee/types"

export const flee = ({ source, target }: Options): Vector => {
  const away = subtract(source.state.location, target)
  const velocity = source.state.velocity
  const direction =
    mag(away) > 0
      ? normalize(away)
      : mag(velocity) > 0
        ? normalize(velocity)
        : new VectorImpl(
            Math.cos(source.state.wanderAngle),
            Math.sin(source.state.wanderAngle)
          )

  return subtract(multiply(direction, source.traits.maxSpeed), velocity)
}
