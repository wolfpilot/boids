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
}

export const config: IBoidConfig = {
  maxSteeringForce: 0.5,
  alignmentFactor: 0.025,
  stopDistanceThreshold: 2.5,
  stopVelocityTreshold: 0.1,
  targetVector: {
    color: "black",
  },
  directionVector: {
    color: "red",
  },
}
