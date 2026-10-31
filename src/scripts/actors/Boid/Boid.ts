// Config
import { config } from "@actors/Boid/config"

// Store
import { guiQuery } from "@stores/gui"
import { boidsQuery } from "@stores/boids"

// Utils
import { multiply } from "@utils/vectorHelper"
import { isEntityOffscreen } from "@utils/entityHelper"
import { darkenHexColor } from "@utils/colorHelper"
import { drawArrow } from "@utils/drawingHelper"

// Geometry
import VectorImpl from "@geometry/Vector"
import { Boid, BoidState, BoidTraits, Options } from "@actors/Boid/types"
import type { FlockDynamics } from "@behaviours/types"

// Setup
const FRICTION_MULTIPLIER_SCALE = 1e-5

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
    fleeingMultiplier,
    separationMultiplier,
    color,
  }: Options) {
    this.id = id
    this.ctx = ctx

    const speedRange = config.individualSpeedMultiplier
    const forceRange = config.individualSteeringForce
    const speedMultiplier =
      speedRange.min + Math.random() * (speedRange.max - speedRange.min)
    const maxSpeed = size * maxSpeedMultiplier * speedMultiplier
    const initialHeading = Math.random() * Math.PI * 2
    const initialSpeed = maxSpeed * config.initialSpeedFraction

    // Traits scale with the weight (size)
    this.traits = {
      size,
      maxSpeed,
      maxSteeringForce:
        forceRange.min + Math.random() * (forceRange.max - forceRange.min),
      frictionFactor:
        size * size * size * frictionMultiplier * FRICTION_MULTIPLIER_SCALE,
      brakingDistance: size * size * brakingMultiplier,
      alignmentAreaSize: size * alignmentMultiplier,
      cohesionAreaSize: size * cohesionMultiplier,
      seekingAreaSize: size * seekingMultiplier,
      fleeingAreaSize: size * fleeingMultiplier,
      separationAreaSize: size * separationMultiplier,
      color,
    }

    this.state = {
      ...initialState,
      location: new VectorImpl(x, y),
      velocity: new VectorImpl(
        Math.cos(initialHeading) * initialSpeed,
        Math.sin(initialHeading) * initialSpeed
      ),
      wanderAngle: Math.random() * Math.PI * 2,
    }
  }

  public draw(flockDynamics?: FlockDynamics) {
    const boidEntity = boidsQuery.getBoid(this.id)

    if (!boidEntity?.state) return

    const isOffscreen = isEntityOffscreen({
      v: boidEntity.state.location,
      radius: boidEntity.traits.size,
    })

    if (guiQuery.allValues.showAlignmentArea) {
      this.drawAlignmentArea(
        boidEntity.state,
        boidEntity.traits.alignmentAreaSize *
          (flockDynamics?.alignmentRadiusMultiplier ?? 1)
      )
    }

    if (guiQuery.allValues.showCohesionArea) {
      this.drawCohesionArea(
        boidEntity.state,
        boidEntity.traits.cohesionAreaSize *
          (flockDynamics?.cohesionRadiusMultiplier ?? 1)
      )
    }

    if (guiQuery.allValues.showSeekingArea) {
      this.drawSeekingArea(boidEntity.state, boidEntity.traits.seekingAreaSize)
    }

    if (guiQuery.allValues.showFleeingArea) {
      this.drawFleeingArea(boidEntity.state, boidEntity.traits.fleeingAreaSize)
    }

    if (guiQuery.allValues.showSeparationArea) {
      this.drawSeparationArea(
        boidEntity.state,
        boidEntity.traits.separationAreaSize *
          (flockDynamics?.separationRadiusMultiplier ?? 1)
      )
    }

    if (guiQuery.allValues.showStoppingArea) {
      this.drawStoppingArea(boidEntity.state, boidEntity.traits.brakingDistance)
    }

    // Skip drawing if offscreen
    if (isOffscreen) return

    this.drawShape(boidEntity.state)

    if (guiQuery.allValues.showTargetVector) {
      this.drawTargetVector(boidEntity.state)
    }

    if (guiQuery.allValues.showVelocityVector) {
      this.drawVelocityVector(boidEntity.state)
    }

    if (guiQuery.allValues.showNormalizedTargetVector) {
      this.drawDirectionVector(boidEntity.state)
    }
  }

  // Draw area in which the boid can be affected by external forces
  private drawAlignmentArea(state: BoidState, radius: number) {
    this.ctx.beginPath()
    this.ctx.arc(state.location.x, state.location.y, radius, 0, 2 * Math.PI)
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = this.traits.color
    this.ctx.stroke()
  }

  private drawSeekingArea(state: BoidState, radius: number) {
    this.ctx.beginPath()
    this.ctx.arc(state.location.x, state.location.y, radius, 0, 2 * Math.PI)
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = config.seekingArea.color
    this.ctx.stroke()
  }

  private drawFleeingArea(state: BoidState, radius: number) {
    this.ctx.beginPath()
    this.ctx.arc(state.location.x, state.location.y, radius, 0, 2 * Math.PI)
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = config.fleeingArea.color
    this.ctx.stroke()
  }

  private drawCohesionArea(state: BoidState, radius: number) {
    this.ctx.beginPath()
    this.ctx.arc(state.location.x, state.location.y, radius, 0, 2 * Math.PI)
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = config.cohesionArea.color
    this.ctx.stroke()
  }

  // Draw area in which the boid wants to push itself away from others
  private drawSeparationArea(state: BoidState, radius: number) {
    this.ctx.save()
    this.ctx.globalAlpha = 0.35

    this.ctx.beginPath()
    this.ctx.moveTo(
      state.location.x - this.traits.size / 2,
      state.location.y - this.traits.size / 2
    )
    this.ctx.arc(state.location.x, state.location.y, radius, 0, 2 * Math.PI)
    this.ctx.fillStyle = this.traits.color
    this.ctx.fill()

    this.ctx.restore()
  }

  // Draw area in which the boid deccelerates near the target
  private drawStoppingArea(state: BoidState, radius: number) {
    this.ctx.save()
    this.ctx.globalAlpha = 0.05

    this.ctx.beginPath()
    this.ctx.moveTo(
      state.location.x - this.traits.size / 2,
      state.location.y - this.traits.size / 2
    )
    this.ctx.arc(state.location.x, state.location.y, radius, 0, 2 * Math.PI)
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
    this.ctx.lineTo(
      state.location.x + state.targetVector.x,
      state.location.y + state.targetVector.y
    )
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

  private drawVelocityVector(state: BoidState) {
    const upscaledVelocityVector = multiply(state.velocity, 7.5)

    drawArrow({
      ctx: this.ctx,
      origin: state.location,
      displacement: upscaledVelocityVector,
      color: darkenHexColor(this.traits.color, 0.025),
      lineWidth: 3,
      headSize: 8,
    })
  }
}

export default BoidImpl
