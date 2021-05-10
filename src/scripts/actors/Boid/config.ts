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
  maxSteeringForce: 0.5,
  stopThreshold: 2.5,
  alignmentFactor: 0.025,
  targetVector: {
    color: "black",
  },
  directionVector: {
    color: "red",
  },
}
