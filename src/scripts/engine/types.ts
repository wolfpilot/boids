// Actors
import { Canvas } from "../actors/Canvas/types"
import { Boid } from "../actors/Boid/types"

// Engine
import { FrameScheduler } from "./Loop"

export interface Options {
  canvas: Canvas
  boids: readonly Boid[]
  maxFps: number
  scheduler?: FrameScheduler
}
