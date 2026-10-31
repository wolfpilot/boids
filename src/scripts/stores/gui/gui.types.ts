import type { SteeringTarget } from "@behaviours/types"

export type PointerMode = SteeringTarget["behaviour"]

export interface GlobalBoidMultipliers {
  maxSpeedMultiplier: number
  brakingMultiplier: number
  alignmentMultiplier: number
  cohesionMultiplier: number
  seekingMultiplier: number
  fleeingMultiplier: number
  separationMultiplier: number
  frictionMultiplier: number
}

export interface GuiStoreState {
  globalMultipliers: GlobalBoidMultipliers
  maxFps: number
  logFps: boolean
  pointerMode: PointerMode
  showTargetVector: boolean
  showNormalizedTargetVector: boolean
  showVelocityVector: boolean
  showAlignmentArea: boolean
  showCohesionArea: boolean
  showSeekingArea: boolean
  showFleeingArea: boolean
  showSeparationArea: boolean
  showStoppingArea: boolean
}
