import { SteeringWeights } from "@behaviours/types"

export interface BoidConfig {
  maxSteeringForce: number
  individualSpeedMultiplier: { min: number; max: number }
  individualSteeringForce: { min: number; max: number }
  initialSpeedFraction: number
  steeringWeights: SteeringWeights
  fieldOfViewDegrees: number
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
  brakingArea: {
    color: string
  }
  seekingArea: {
    color: string
  }
  fleeingArea: {
    color: string
  }
  cohesionArea: {
    color: string
  }
}

export const config: BoidConfig = {
  maxSteeringForce: 0.5,
  individualSpeedMultiplier: { min: 0.75, max: 3.5 },
  individualSteeringForce: { min: 0.35, max: 0.7 },
  initialSpeedFraction: 0.3,
  fieldOfViewDegrees: 300,
  steeringWeights: {
    alignment: 0.5,
    cohesion: 0.005,
    separation: 32,
    wander: 0.1,
    seek: 1,
  },
  wander: {
    strength: 1,
    rate: 0.15,
  },
  stopDistanceThreshold: 2.5,
  stopVelocityTreshold: 0.1,
  targetVector: {
    color: "#c4c4c4",
  },
  directionVector: {
    color: "#ff0000",
  },
  brakingArea: {
    color: "#ff0000",
  },
  seekingArea: {
    color: "#2ea8ff",
  },
  fleeingArea: {
    color: "#ff8a3d",
  },
  cohesionArea: {
    color: "#8b5cf6",
  },
}
