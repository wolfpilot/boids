import { Vector } from "@ts/geometry"

export const behaviours = {
  align: "align",
  cohere: "cohere",
  seek: "seek",
  flee: "flee",
  separate: "separate",
  wander: "wander",
} as const
export type BehaviourTypes = (typeof behaviours)[keyof typeof behaviours]

export interface SteeringForces {
  alignment?: Vector
  cohesion?: Vector
  seek?: Vector
  separation?: Vector
  wander?: Vector
}
export type SteeringForcesTypes = keyof SteeringForces

export interface SteeringWeights {
  alignment: number
  cohesion: number
  separation: number
  wander: number
  seek: number
}
export type SteeringWeightsTypes = keyof SteeringWeights

export interface FlockDynamics {
  alignmentRadiusMultiplier: number
  cohesionRadiusMultiplier: number
  separationRadiusMultiplier: number
  steeringWeights: SteeringWeights
}
