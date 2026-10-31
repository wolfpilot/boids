import { Store, StoreConfig } from "@datorama/akita"
import { GuiStoreState } from "@stores/gui/gui.types"
import { config } from "../../config"

const initialState: GuiStoreState = {
  globalMultipliers: {
    maxSpeedMultiplier: config.boids.maxSpeedMultiplier,
    brakingMultiplier: config.boids.brakingMultiplier,
    alignmentMultiplier: config.boids.alignmentMultiplier,
    cohesionMultiplier: config.boids.cohesionMultiplier,
    seekingMultiplier: config.boids.seekingMultiplier,
    fleeingMultiplier: config.boids.fleeingMultiplier,
    separationMultiplier: config.boids.separationMultiplier,
    frictionMultiplier: config.boids.frictionMultiplier,
  },
  maxFps: 144,
  logFps: true,
  pointerMode: "flee",
  showTargetVector: false,
  showNormalizedTargetVector: false,
  showVelocityVector: true,
  showAlignmentArea: false,
  showCohesionArea: false,
  showSeekingArea: false,
  showFleeingArea: false,
  showSeparationArea: false,
  showStoppingArea: false,
}

@StoreConfig({ name: "gui" })
export class GuiStore extends Store<GuiStoreState> {
  constructor() {
    super(initialState)
  }
}
