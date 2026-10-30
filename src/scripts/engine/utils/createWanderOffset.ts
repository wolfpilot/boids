import VectorImpl from "@geometry/Vector"
import type { Vector } from "@ts/geometry"

export const createWanderOffset = (): Vector => {
  const angle = Math.random() * Math.PI * 2
  const radius = Math.sqrt(Math.random())

  return new VectorImpl(Math.cos(angle) * radius, Math.sin(angle) * radius)
}
