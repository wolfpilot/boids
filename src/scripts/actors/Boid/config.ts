import { SteeringWeights } from "../../behaviours/types"

export interface BoidConfig {
  maxSteeringForce: number
  steeringWeights: SteeringWeights
  wander: {
    strength: number
    rate: number
  }
  stopDistanceThreshold: number
  stopVelocityTreshold: number
  targetVector: {
    color: string
  }
  directionVector: {
    color: string
  }
  velocityVector: {
    color: string
  }
  brakingArea: {
    color: string
  }
  seekingArea: {
    color: string
  }
  cohesionArea: {
    color: string
  }
}

export const config: BoidConfig = {
  maxSteeringForce: 0.5,
  steeringWeights: {
    alignment: 0.5,
    cohesion: 0.005,
    separation: 8,
    wander: 0.05,
    seek: 1,
  },
  wander: {
    strength: 1,
    rate: 0.1,
  },
  stopDistanceThreshold: 2.5,
  stopVelocityTreshold: 0.1,
  targetVector: {
    color: "#c4c4c4",
  },
  directionVector: {
    color: "#ff0000",
  },
  velocityVector: {
    color: "#151515",
  },
  brakingArea: {
    color: "#ff0000",
  },
  seekingArea: {
    color: "#2ea8ff",
  },
  cohesionArea: {
    color: "#8b5cf6",
  },
}
