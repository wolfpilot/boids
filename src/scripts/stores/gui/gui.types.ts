export interface GlobalBoidMultipliers {
  maxSpeedMultiplier: number
  brakingMultiplier: number
  alignmentMultiplier: number
  cohesionMultiplier: number
  seekingMultiplier: number
  separationMultiplier: number
  frictionMultiplier: number
}

export interface GuiStoreState {
  globalMultipliers: GlobalBoidMultipliers
  maxFps: number
  logFps: boolean
  showTargetVector: boolean
  showNormalizedTargetVector: boolean
  showVelocityVector: boolean
  showAlignmentArea: boolean
  showCohesionArea: boolean
  showSeekingArea: boolean
  showSeparationArea: boolean
  showStoppingArea: boolean
}
