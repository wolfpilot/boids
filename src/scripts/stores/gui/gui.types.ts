import type { SteeringTarget } from "@behaviours/types"
import { ThemeNameTypes } from "@theme/types"

export type PointerMode = SteeringTarget["behaviour"]

export interface BoidMultipliers {
  maxSpeedMultiplier: number
  brakingMultiplier: number
  alignmentMultiplier: number
  cohesionMultiplier: number
  seekingMultiplier: number
  fleeingMultiplier: number
  separationMultiplier: number
  frictionMultiplier: number
}

export interface GuiStoreEngineState {
  maxFps: number
  logFps: boolean
}

export interface GuiStorePointerState {
  pointerMode: PointerMode
}

export interface GuiStoreThemeState {
  theme: ThemeNameTypes
}

export interface GuiStoreVectorState {
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

export type GuiStoreBoidsState = BoidMultipliers

export type GuiStoreState = GuiStoreEngineState &
  GuiStorePointerState &
  GuiStoreThemeState &
  GuiStoreVectorState &
  GuiStoreBoidsState
