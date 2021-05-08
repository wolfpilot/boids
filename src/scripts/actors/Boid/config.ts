export interface IBoidConfig {
  maxSteeringForce: number
  stopThreshold: number
  alignmentFactor: number
  targetVector: {
    color: string
  }
  directionVector: {
    color: string
  }
}

export const config: IBoidConfig = {
  maxSteeringForce: 0.1,
  stopThreshold: 0.05,
  alignmentFactor: 0.025,
  targetVector: {
    color: "black",
  },
  directionVector: {
    color: "red",
  },
}
