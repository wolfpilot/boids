export interface IBoidConfig {
  maxSteeringForce: number
  alignmentFactor: number
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
}

export const config: IBoidConfig = {
  maxSteeringForce: 0.5,
  alignmentFactor: 0.025,
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
}
