// Types
import { IBoidEntity } from "../../types/entities"

// Config
import { config } from "./config"

// Store
import { appQuery } from "../../stores/app"
import { guiQuery } from "../../stores/gui"
import { boidsStore, boidsQuery } from "../../stores/boids"

// Utils
import {
  add,
  applyForces,
  subtract,
  multiply,
  mag,
  normalize,
  limitMagnitude,
} from "../../utils/vectorHelper"
import { IBehaviourType, seek, align, separate } from "../../behaviours/index"

// Geometry
import Vector, { IVector } from "../../geometry/Vector"

export enum BehaviourKind {
  Seek = "seek",
  Align = "align",
  Separate = "separate",
}

export interface IBoidTraits {
  size: number
  maxSpeed: number
  frictionFactor: number
  brakingDistance: number
  awarenessAreaSize: number
  separationAreaSize: number
  color: string
}

export interface IBoidState {
  location: IVector
  acceleration: IVector
  velocity: IVector
  friction: IVector
  targetVector: IVector
  normTargetVector: IVector
}

export interface IBoid {
  id: number
  traits: IBoidTraits
  state: IBoidState
  init: () => void
  draw: () => void
}

interface IOptions {
  id: number
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  size: number
  maxSpeedMultiplier: number
  frictionMultiplier: number
  brakingMultiplier: number
  awarenessMultiplier: number
  separationMultiplier: number
  color: string
}

// Setup
const initialState: IBoidState = {
  location: new Vector(0, 0),
  acceleration: new Vector(0, 0),
  velocity: new Vector(0, 0),
  friction: new Vector(0, 0),
  targetVector: new Vector(0, 0),
  normTargetVector: new Vector(0, 0),
}

// *: Temporarily using the mouse as the common boid target
const mouseVector = new Vector(window.innerWidth / 2, window.innerHeight / 2)

const onMouseUpdate = (e: MouseEvent): void => {
  mouseVector.x = e.pageX
  mouseVector.y = e.pageY
}

document.addEventListener("mousemove", onMouseUpdate)

// Setup
class Boid implements IBoid {
  public id: number
  public traits: IBoidTraits
  public state: IBoidState
  private ctx: CanvasRenderingContext2D
  private behaviours: IBehaviourType[]

  constructor({
    id,
    ctx,
    x,
    y,
    size,
    maxSpeedMultiplier,
    frictionMultiplier,
    brakingMultiplier,
    awarenessMultiplier,
    separationMultiplier,
    color,
  }: IOptions) {
    this.id = id
    this.ctx = ctx

    this.behaviours = [
      BehaviourKind.Seek,
      BehaviourKind.Align,
      BehaviourKind.Separate,
    ]

    // Traits scale proportionally or exponentially with the weight (size)
    this.traits = {
      size: size,
      maxSpeed: size * maxSpeedMultiplier,
      frictionFactor: size * size * size * frictionMultiplier,
      brakingDistance: size * size * brakingMultiplier,
      awarenessAreaSize: size * awarenessMultiplier,
      separationAreaSize: size * separationMultiplier,
      color: color,
    }

    this.state = {
      ...initialState,
      location: new Vector(x, y),
    }
  }

  public init(): void {
    appQuery.elapsedTime$.subscribe(this.update)
  }

  private update = (): void => {
    const boidEntity = boidsQuery.getBoid(this.id)

    if (!boidEntity) return

    const targetVector = subtract(mouseVector, boidEntity.state.location)
    const targetDistance = mag(targetVector)
    const normTargetVector = normalize(boidEntity.state.targetVector)
    const velocityMag = mag(boidEntity.state.velocity)

    const newBoidEntity = {
      ...boidEntity,
      state: {
        ...boidEntity.state,
        targetVector,
        normTargetVector,
      },
    }

    const shouldStop =
      targetDistance < config.stopDistanceThreshold &&
      velocityMag < config.stopVelocityTreshold

    shouldStop
      ? this.handleStopUpdate(newBoidEntity)
      : this.handleContinueUpdate(newBoidEntity)
  }

  private handleStopUpdate(newBoidEntity: IBoidEntity): void {
    boidsStore.update(newBoidEntity.id, {
      state: {
        ...newBoidEntity.state,
        velocity: initialState.velocity,
      },
    })
  }

  private handleContinueUpdate(newBoidEntity: IBoidEntity): void {
    const steer = this.getComputedSteering(newBoidEntity)

    // Assign an opposing force that simulates friction
    const normVelocity = normalize(newBoidEntity.state.velocity)
    const normFriction = multiply(normVelocity, -1)
    const friction = multiply(normFriction, newBoidEntity.traits.frictionFactor)

    const forces = [steer, friction]

    // Compound all external forces with the original vector
    const nextAcceleration = applyForces(
      newBoidEntity.state.acceleration,
      forces
    )
    const velocity = limitMagnitude(
      add(newBoidEntity.state.velocity, nextAcceleration),
      newBoidEntity.traits.maxSpeed
    )
    const location = add(newBoidEntity.state.location, velocity)

    boidsStore.update(newBoidEntity.id, {
      state: {
        ...newBoidEntity.state,
        acceleration: initialState.acceleration, // Reset
        velocity,
        location,
      },
    })
  }

  private getComputedSteering(boidEntity: IBoidEntity): IVector {
    let acc = new Vector(0, 0)

    if (!this.behaviours || !this.behaviours.length) return acc

    const otherBoidEntities = boidsQuery.getOtherBoids(boidEntity.id)

    if (this.behaviours.includes(BehaviourKind.Seek)) {
      const options = {
        target: mouseVector,
        source: boidEntity,
      }
      const vec = seek(options)

      acc = add(acc, vec)
    }

    if (this.behaviours.includes(BehaviourKind.Align)) {
      const options = {
        boids: otherBoidEntities,
        source: boidEntity,
      }
      const vec = align(options)

      acc = add(acc, vec)
    }

    if (this.behaviours.includes(BehaviourKind.Separate)) {
      const options = {
        boids: otherBoidEntities,
        source: boidEntity,
      }
      const vec = separate(options)

      acc = add(acc, vec)
    }

    return acc
  }

  public draw(): void {
    const boidEntity = boidsQuery.getBoid(this.id)

    if (!boidEntity?.state) return

    this.drawShape(boidEntity.state)

    if (guiQuery.allValues.showTargetVector) {
      this.drawTargetVector(boidEntity.state)
    }

    if (guiQuery.allValues.showNormalizedTargetVector) {
      this.drawDirectionVector(boidEntity.state)
    }

    if (guiQuery.allValues.showAwarenessArea) {
      this.drawAwarenessArea(boidEntity.state)
    }

    if (guiQuery.allValues.showSeparationArea) {
      this.drawSeparationArea(boidEntity.state)
    }
  }

  // Draw the shape
  private drawShape(state: IBoidState): void {
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
  private drawTargetVector(state: IBoidState): void {
    this.ctx.beginPath()
    this.ctx.moveTo(state.location.x, state.location.y)
    this.ctx.lineWidth = 1
    this.ctx.lineTo(mouseVector.x, mouseVector.y)
    this.ctx.strokeStyle = config.targetVector.color
    this.ctx.stroke()
  }

  // Draw normalized direction vector
  private drawDirectionVector(state: IBoidState): void {
    const normalizedDirectionVector = multiply(
      state.normTargetVector,
      this.traits.size
    )

    this.ctx.beginPath()
    this.ctx.moveTo(state.location.x, state.location.y)
    this.ctx.lineWidth = 2
    this.ctx.lineTo(
      state.location.x + normalizedDirectionVector.x,
      state.location.y + normalizedDirectionVector.y
    )
    this.ctx.strokeStyle = config.directionVector.color
    this.ctx.stroke()
  }

  // Draw area in which the boid can be affected by external forces
  private drawAwarenessArea(state: IBoidState): void {
    this.ctx.beginPath()
    this.ctx.arc(
      state.location.x,
      state.location.y,
      this.traits.awarenessAreaSize,
      0,
      2 * Math.PI
    )
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = this.traits.color
    this.ctx.stroke()
  }

  // Draw area in which the boid wants to push itself away from others
  private drawSeparationArea(state: IBoidState): void {
    this.ctx.save()
    this.ctx.globalAlpha = 0.25

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
}

export default Boid
