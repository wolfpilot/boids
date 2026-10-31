import { Store, StoreConfig } from "@datorama/akita"
import { GuiStoreState } from "@stores/gui/gui.types"
import { config } from "../../config"

const initialState: GuiStoreState = {
  // engine
  maxFps: config.engine.maxFps,
  logFps: config.engine.logFps,
  // pointer
  pointerMode: config.pointer.mode,
  // vector
  showTargetVector: config.vector.showTargetVector,
  showNormalizedTargetVector: config.vector.showNormalizedTargetVector,
  showVelocityVector: config.vector.showVelocityVector,
  showAlignmentArea: config.vector.showAlignmentArea,
  showCohesionArea: config.vector.showCohesionArea,
  showSeekingArea: config.vector.showSeekingArea,
  showFleeingArea: config.vector.showFleeingArea,
  showSeparationArea: config.vector.showSeparationArea,
  showStoppingArea: config.vector.showStoppingArea,
  // boids
  maxSpeedMultiplier: config.boids.maxSpeedMultiplier,
  brakingMultiplier: config.boids.brakingMultiplier,
  alignmentMultiplier: config.boids.alignmentMultiplier,
  cohesionMultiplier: config.boids.cohesionMultiplier,
  seekingMultiplier: config.boids.seekingMultiplier,
  fleeingMultiplier: config.boids.fleeingMultiplier,
  separationMultiplier: config.boids.separationMultiplier,
  frictionMultiplier: config.boids.frictionMultiplier,
}

@StoreConfig({ name: "gui" })
export class GuiStore extends Store<GuiStoreState> {
  constructor() {
    super(initialState)
  }
}
