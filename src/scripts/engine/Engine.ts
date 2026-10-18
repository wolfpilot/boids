// Actors
import { Canvas } from "../actors/Canvas/Canvas"
import { Boid } from "../actors/Boid/Boid"

// Stores
import { appService } from "../stores/app"
import { boidsStore, boidsQuery } from "../stores/boids"
import { uiQuery } from "../stores/ui"

// Engine
import Loop, { FramePlan, FrameScheduler } from "./Loop"
import { stepBoids } from "./utils/stepBoids"

interface Options {
  canvas: Canvas
  boids: readonly Boid[]
  maxFps: number
  scheduler?: FrameScheduler
}

/**
 * Engine runs two loops in sequence:
 *
 * 1. Updates the physics from a shared snapshot, then publishes the completed actors state.
 * 2. Draws the latest published state after all updates for the frame have finished.
 */
export default class Engine {
  private readonly canvas: Canvas
  private readonly boids: readonly Boid[]
  private readonly loop: Loop

  constructor({ canvas, boids, maxFps, scheduler }: Options) {
    this.canvas = canvas
    this.boids = boids
    this.loop = new Loop({
      onFrame: this.onFrame,
      maxFps,
      scheduler,
    })
  }

  public init() {
    boidsStore.set(
      this.boids.map((boid) => ({
        id: boid.id,
        traits: boid.traits,
        state: boid.state,
      }))
    )
  }

  public start() {
    this.loop.start()
  }

  public stop() {
    this.loop.stop()
  }

  public setMaxFps(maxFps: number) {
    this.loop.setMaxFps(maxFps)
  }

  private onFrame = ({
    elapsedMs,
    timestamp,
    updates,
    shouldDraw,
  }: FramePlan) => {
    appService.updateElapsedTime(elapsedMs)

    for (let i = 0; i < updates; i++) {
      this.update()
    }

    if (shouldDraw) {
      appService.updateLastDrawTime(timestamp)
      this.draw()
    }
  }

  private update() {
    const { isPointerPresent, pointerVector } = uiQuery.allValues

    const target = isPointerPresent ? pointerVector : undefined

    boidsStore.set(stepBoids(boidsQuery.all, target))
  }

  private draw() {
    if (this.canvas.state.isEnabled) {
      this.canvas.draw()
    }

    this.boids.forEach((boid) => boid.draw())
  }
}
