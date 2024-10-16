// Types
import { IVector } from "../types/geometry"

interface IIsEntityOutsideOptions {
  v: IVector
  radius: number
  minX: number
  minY: number
  maxX: number
  maxY: number
}

interface IIsEntityOffscreenOptions {
  v: IVector
  radius: number
}

export const isEntityOutside = ({
  v,
  radius,
  minX,
  minY,
  maxX,
  maxY,
}: IIsEntityOutsideOptions): boolean =>
  v.y < minY - radius || // Top
  v.x > maxX + radius || // Right
  v.y > maxY + radius || // Bottom
  v.x < minX - radius // Left

export const isEntityOffscreen = ({
  v,
  radius,
}: IIsEntityOffscreenOptions): boolean =>
  isEntityOutside({
    v,
    radius,
    minX: 0,
    minY: 0,
    maxX: window.innerWidth,
    maxY: window.innerHeight,
  })
