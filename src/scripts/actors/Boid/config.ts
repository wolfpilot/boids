export interface BoidConfig {
  maxSteeringForce: number
  alignmentFactor: number
  cohesionFactor: number
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
  alignmentFactor: 0.025,
  cohesionFactor: 0.6,
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
