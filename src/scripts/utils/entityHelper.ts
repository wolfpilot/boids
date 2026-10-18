// Types
import { Vector } from "../types/geometry"

interface IsEntityOutsideOptions {
  v: Vector
  radius: number
  minX: number
  minY: number
  maxX: number
  maxY: number
}

interface IsEntityOffscreenOptions {
  v: Vector
  radius: number
}

export const isEntityOutside = ({
  v,
  radius,
  minX,
  minY,
  maxX,
  maxY,
}: IsEntityOutsideOptions): boolean =>
  v.y < minY - radius || // Top
  v.x > maxX + radius || // Right
  v.y > maxY + radius || // Bottom
  v.x < minX - radius // Left

export const isEntityOffscreen = ({
  v,
  radius,
}: IsEntityOffscreenOptions): boolean =>
  isEntityOutside({
    v,
    radius,
    minX: 0,
    minY: 0,
    maxX: window.innerWidth,
    maxY: window.innerHeight,
  })
