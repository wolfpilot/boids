// Actors
import { ICanvas } from "../actors/Canvas/Canvas"
import { IBoid } from "../actors/Boid/Boid"

// Stores
import { appService } from "../stores/app"
import { boidsStore, boidsQuery } from "../stores/boids"
import { uiQuery } from "../stores/ui"

// Engine
import Loop, { IFramePlan, IFrameScheduler } from "./Loop"
import { stepBoids } from "./utils/stepBoids"

interface IOptions {
  canvas: ICanvas
  boids: readonly IBoid[]
  maxFps: number
  scheduler?: IFrameScheduler
}

/**
 * Engine runs two loops in sequence:
 *
 * 1. Updates the physics from a shared snapshot, then publishes the completed actors state.
 * 2. Draws the latest published state after all updates for the frame have finished.
 */
export default class Engine {
  private readonly canvas: ICanvas
  private readonly boids: readonly IBoid[]
  private readonly loop: Loop

  constructor({ canvas, boids, maxFps, scheduler }: IOptions) {
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
  }: IFramePlan) => {
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
    const snapshot = boidsQuery.all

    boidsStore.set(stepBoids(snapshot, uiQuery.pointerVector))
  }

  private draw() {
    if (this.canvas.state.isEnabled) {
      this.canvas.draw()
    }

    this.boids.forEach((boid) => boid.draw())
  }
}
