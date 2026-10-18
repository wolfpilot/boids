import VectorImpl from "../../geometry/Vector"
import type { Bounds, Vector } from "../../types/geometry"

export const wrapLocation = (
  location: Vector,
  radius: number,
  bounds: Bounds
): Vector => {
  let { x, y } = location

  if (bounds.width > 0) {
    if (x < -radius) {
      x = bounds.width + radius
    } else if (x > bounds.width + radius) {
      x = -radius
    }
  }

  if (bounds.height > 0) {
    if (y < -radius) {
      y = bounds.height + radius
    } else if (y > bounds.height + radius) {
      y = -radius
    }
  }

  return new VectorImpl(x, y)
}
