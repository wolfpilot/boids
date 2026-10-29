import { smoothstep } from "../../utils/mathHelper"

export const getRangeWeight = (distance: number, radius: number): number => {
  if (distance <= 0 || radius <= 0 || distance >= radius) return 0

  return 1 - smoothstep(radius * 0.9, radius, distance)
}
