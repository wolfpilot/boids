import { Vector } from "../../types/geometry"

export interface BoidTraits {
  size: number
  maxSpeed: number
  frictionFactor: number
  brakingDistance: number
  alignmentAreaSize: number
  cohesionAreaSize: number
  seekingAreaSize: number
  separationAreaSize: number
  color: string
}

export interface BoidState {
  location: Vector
  acceleration: Vector
  velocity: Vector
  friction: Vector
  targetVector: Vector
  normTargetVector: Vector
  wanderAngle: number
}

export interface Boid {
  id: number
  traits: BoidTraits
  state: BoidState
  draw: () => void
}

export interface Options {
  id: number
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  size: number
  maxSpeedMultiplier: number
  frictionMultiplier: number
  brakingMultiplier: number
  alignmentMultiplier: number
  seekingMultiplier: number
  separationMultiplier: number
  color: string
}
