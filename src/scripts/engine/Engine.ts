// Actors
import { Canvas } from "../actors/Canvas/types"
import { Boid } from "../actors/Boid/types"
import type { BoidTraits } from "../actors/Boid/types"

// Stores
import { appService } from "../stores/app"
import { boidsStore, boidsQuery } from "../stores/boids"
import { uiQuery } from "../stores/ui"
import type { GlobalBoidMultipliers } from "../stores/gui/gui.types"

// Engine
import Loop, { FramePlan } from "./Loop"
import { stepBoids } from "./utils/stepBoids"
import { getFlockDynamics } from "./utils/getFlockDynamics"
import { getScaledBoidTraits } from "./utils/getScaledBoidTraits"
import { Options } from "./types"

/**
 * Engine runs two loops in sequence:
 *
 * 1. Updates the physics from a shared snapshot, then publishes the completed actors state.
 * 2. Draws the latest published state after all updates for the frame have finished.
 */
export default class Engine {
  private readonly canvas: Canvas
  private readonly boids: readonly Boid[]
  private readonly originalTraits: Map<number, BoidTraits>
  private readonly loop: Loop
  private physicsUpdateIndex = 0
  private flockDynamics = getFlockDynamics(0)

  constructor({ canvas, boids, maxFps, scheduler }: Options) {
    this.canvas = canvas
    this.boids = boids
    this.originalTraits = new Map(
      boids.map((boid) => [boid.id, { ...boid.traits }])
    )
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

  public setGlobalMultipliers(multipliers: GlobalBoidMultipliers) {
    boidsStore.set(
      boidsQuery.all.map((boid) => {
        const original = this.originalTraits.get(boid.id)
        if (!original) return boid

        return {
          ...boid,
          traits: getScaledBoidTraits(original, multipliers),
        }
      })
    )
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
    const flockDynamics = getFlockDynamics(this.physicsUpdateIndex)

    const updatedBoids = stepBoids({
      snapshot: boidsQuery.all,
      target: isPointerPresent ? pointerVector : undefined,
      bounds: this.canvas.getBounds(),
      flockDynamics,
    })

    boidsStore.set(updatedBoids)
    this.flockDynamics = flockDynamics
    this.physicsUpdateIndex++
  }

  private draw() {
    if (this.canvas.state.isEnabled) {
      this.canvas.draw()
    }

    this.boids.forEach((boid) => boid.draw(this.flockDynamics))
  }
}
