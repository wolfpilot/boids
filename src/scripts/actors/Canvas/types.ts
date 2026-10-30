import type { Bounds } from "@ts/geometry"

export interface CanvasState {
  isEnabled: boolean
  fill: string
}

export interface Canvas {
  state: CanvasState
  init: () => void
  draw: () => void
  getBounds: () => Bounds
}
