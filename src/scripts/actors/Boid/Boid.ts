// Config
import { config } from "./config"

// Store
import { guiQuery } from "../../stores/gui"
import { uiQuery } from "../../stores/ui"
import { boidsQuery } from "../../stores/boids"

// Utils
import { multiply } from "../../utils/vectorHelper"
import { isEntityOffscreen } from "../../utils/entityHelper"

// Geometry
import VectorImpl from "../../geometry/Vector"
import { Boid, BoidState, BoidTraits, Options } from "./types"

// Setup
const initialState: BoidState = {
  location: new VectorImpl(0, 0),
  acceleration: new VectorImpl(0, 0),
  velocity: new VectorImpl(0, 0),
  friction: new VectorImpl(0, 0),
  targetVector: new VectorImpl(0, 0),
  normTargetVector: new VectorImpl(0, 0),
  wanderAngle: 0,
}

// Setup
class BoidImpl implements Boid {
  public readonly id: number
  public readonly traits: BoidTraits
  public state: BoidState
  private ctx: CanvasRenderingContext2D

  constructor({
    id,
    ctx,
    x,
    y,
    size,
    maxSpeedMultiplier,
    frictionMultiplier,
    brakingMultiplier,
    alignmentMultiplier,
    cohesionMultiplier,
    seekingMultiplier,
    separationMultiplier,
    color,
  }: Options) {
    this.id = id
    this.ctx = ctx

    // Traits scale with the weight (size)
    this.traits = {
      size,
      maxSpeed: size * maxSpeedMultiplier,
      frictionFactor: size * size * size * frictionMultiplier,
      brakingDistance: size * size * brakingMultiplier,
      alignmentAreaSize: size * alignmentMultiplier,
      cohesionAreaSize: size * cohesionMultiplier,
      seekingAreaSize: size * seekingMultiplier,
      separationAreaSize: size * separationMultiplier,
      color,
    }

    this.state = {
      ...initialState,
      location: new VectorImpl(x, y),
      wanderAngle: Math.random() * Math.PI * 2,
    }
  }

  public draw() {
    // !: throw? complete on die?

    const boidEntity = boidsQuery.getBoid(this.id)

    if (!boidEntity?.state) return

    const isOffscreen = isEntityOffscreen({
      v: boidEntity.state.location,
      radius: boidEntity.traits.size,
    })

    if (guiQuery.allValues.showAlignmentArea) {
      this.drawAlignmentArea(boidEntity.state)
    }

    if (guiQuery.allValues.showCohesionArea) {
      this.drawCohesionArea(boidEntity.state)
    }

    if (guiQuery.allValues.showSeekingArea) {
      this.drawSeekingArea(boidEntity.state)
    }

    if (guiQuery.allValues.showSeparationArea) {
      this.drawSeparationArea(boidEntity.state)
    }

    if (guiQuery.allValues.showStoppingArea) {
      this.drawStoppingArea(boidEntity.state)
    }

    // Skip drawing if offscreen
    if (isOffscreen) return

    this.drawShape(boidEntity.state)

    if (guiQuery.allValues.showTargetVector) {
      this.drawTargetVector(boidEntity.state)
    }

    if (guiQuery.allValues.showNormalizedTargetVector) {
      this.drawDirectionVector(boidEntity.state)
    }

    if (guiQuery.allValues.showVelocityVector) {
      this.drawVelocityVector(boidEntity.state)
    }
  }

  // Draw area in which the boid can be affected by external forces
  private drawAlignmentArea(state: BoidState) {
    this.ctx.beginPath()
    this.ctx.arc(
      state.location.x,
      state.location.y,
      this.traits.alignmentAreaSize,
      0,
      2 * Math.PI
    )
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = this.traits.color
    this.ctx.stroke()
  }

  private drawSeekingArea(state: BoidState) {
    this.ctx.beginPath()
    this.ctx.arc(
      state.location.x,
      state.location.y,
      this.traits.seekingAreaSize,
      0,
      2 * Math.PI
    )
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = config.seekingArea.color
    this.ctx.stroke()
  }

  private drawCohesionArea(state: BoidState) {
    this.ctx.beginPath()
    this.ctx.arc(
      state.location.x,
      state.location.y,
      this.traits.cohesionAreaSize,
      0,
      2 * Math.PI
    )
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = config.cohesionArea.color
    this.ctx.stroke()
  }

  // Draw area in which the boid wants to push itself away from others
  private drawSeparationArea(state: BoidState) {
    this.ctx.save()
    this.ctx.globalAlpha = 0.35

    this.ctx.beginPath()
    this.ctx.moveTo(
      state.location.x - this.traits.size / 2,
      state.location.y - this.traits.size / 2
    )
    this.ctx.arc(
      state.location.x,
      state.location.y,
      this.traits.separationAreaSize,
      0,
      2 * Math.PI
    )
    this.ctx.fillStyle = this.traits.color
    this.ctx.fill()

    this.ctx.restore()
  }

  // Draw area in which the boid deccelerates near the target
  private drawStoppingArea(state: BoidState) {
    this.ctx.save()
    this.ctx.globalAlpha = 0.05

    this.ctx.beginPath()
    this.ctx.moveTo(
      state.location.x - this.traits.size / 2,
      state.location.y - this.traits.size / 2
    )
    this.ctx.arc(
      state.location.x,
      state.location.y,
      this.traits.brakingDistance,
      0,
      2 * Math.PI
    )
    this.ctx.fillStyle = config.brakingArea.color
    this.ctx.fill()

    this.ctx.restore()
  }

  // Draw the shape
  private drawShape(state: BoidState) {
    this.ctx.beginPath()
    this.ctx.moveTo(
      state.location.x - this.traits.size / 2,
      state.location.y - this.traits.size / 2
    )
    this.ctx.arc(
      state.location.x,
      state.location.y,
      this.traits.size,
      0,
      2 * Math.PI
    )
    this.ctx.fillStyle = this.traits.color
    this.ctx.fill()
  }

  // Draw vector to target
  private drawTargetVector(state: BoidState) {
    this.ctx.beginPath()
    this.ctx.moveTo(state.location.x, state.location.y)
    this.ctx.lineWidth = 1
    this.ctx.lineTo(uiQuery.pointerVector.x, uiQuery.pointerVector.y)
    this.ctx.strokeStyle = config.targetVector.color
    this.ctx.stroke()
  }

  // Draw normalized direction vector
  private drawDirectionVector(state: BoidState) {
    const normalizedDirectionVector = multiply(
      state.normTargetVector,
      this.traits.size
    )

    this.ctx.beginPath()
    this.ctx.moveTo(state.location.x, state.location.y)
    this.ctx.lineWidth = 3
    this.ctx.lineTo(
      state.location.x + normalizedDirectionVector.x,
      state.location.y + normalizedDirectionVector.y
    )
    this.ctx.strokeStyle = config.directionVector.color
    this.ctx.stroke()
  }

  // Draw the resulting force vector
  private drawVelocityVector(state: BoidState) {
    const upscaledVelocityVector = multiply(state.velocity, 5)

    this.ctx.beginPath()
    this.ctx.moveTo(state.location.x, state.location.y)
    this.ctx.lineWidth = 3
    this.ctx.lineTo(
      state.location.x + upscaledVelocityVector.x,
      state.location.y + upscaledVelocityVector.y
    )
    this.ctx.strokeStyle = config.velocityVector.color
    this.ctx.stroke()
  }
}

export default BoidImpl
