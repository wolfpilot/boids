// Config
import { config } from "./config"
import { config as appConfig } from "../../config"

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

export interface IBoidConfig {
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
  config: IBoidConfig
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
  brakingDistance: number
  awarenessAreaSize: number
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
  public config: IBoidConfig
  public state: IBoidState
  private ctx: CanvasRenderingContext2D
  private behaviours: IBehaviourType[]

  constructor(options: IOptions) {
    this.id = options.id
    this.ctx = options.ctx

    this.behaviours = [
      BehaviourKind.Seek,
      BehaviourKind.Align,
      BehaviourKind.Separate,
    ]

    this.config = {
      size: options.size,
      // Max speed is directly proportional to the weight (size)
      maxSpeed: options.size / 5,
      brakingDistance: options.brakingDistance,
      awarenessAreaSize: options.awarenessAreaSize,
      separationAreaSize: options.size + options.awarenessAreaSize / 10,
      // Friction is directly proportional to weight (size)
      frictionFactor: options.size / appConfig.boids.maxSize / 15,
      color: options.color,
    }

    this.state = {
      ...initialState,
      location: new Vector(options.x, options.y),
    }
  }

  public init(): void {
    appQuery.elapsedTime$.subscribe(this.update)
  }

  private getComputedSteering(newState: IBoidState): IVector {
    const newBoid = {
      ...this,
      state: {
        ...newState,
      },
    }

    // Accumulator vector
    let steer = new Vector(0, 0)

    if (!this.behaviours || !this.behaviours.length) return steer

    const otherBoids = boidsQuery.getOtherBoids(newBoid.id)

    if (this.behaviours.includes(BehaviourKind.Seek)) {
      const options = {
        target: mouseVector,
        source: newBoid,
      }
      const vec = seek(options)

      steer = add(steer, vec)
    }

    if (this.behaviours.includes(BehaviourKind.Align)) {
      const options = {
        boids: otherBoids,
        source: newBoid,
      }
      const vec = align(options)

      steer = add(steer, vec)
    }

    if (this.behaviours.includes(BehaviourKind.Separate)) {
      const options = {
        boids: otherBoids,
        source: newBoid,
      }
      const vec = separate(options)

      steer = add(steer, vec)
    }

    return steer
  }

  private update = (): void => {
    const boidEntity = boidsQuery.getBoid(this.id)

    if (!boidEntity) return

    // *: tempState to be shared within the whole instance
    const newState = {
      ...boidEntity?.state,
      targetVector: subtract(mouseVector, boidEntity.state.location),
      normTargetVector: normalize(boidEntity.state.targetVector),
    }

    // Calculate a stopping distance from the target.
    // This prevents the boid spazzing out by always
    // reaching and then overshooting its target.
    const distanceFromTarget = mag(newState.targetVector)

    if (
      distanceFromTarget < config.stopThreshold &&
      mag(newState.velocity) < 0.1
    ) {
      boidsStore.update(this.id, (entity) => ({
        state: {
          ...entity.state,
          ...newState,
          velocity: initialState.velocity,
        },
      }))

      return
    }

    const steer = this.getComputedSteering(newState)

    // Assign a friction-like force that pushes back against the current direction
    const normVelocity = normalize(newState.velocity)
    const normFriction = multiply(normVelocity, -1)
    const friction = multiply(normFriction, this.config.frictionFactor)

    const forces = [steer, friction]

    // Compound all external forces with the original vector
    const newAcceleration = applyForces(newState.acceleration, forces)
    const newVelocity = limitMagnitude(
      add(newState.velocity, newAcceleration),
      this.config.maxSpeed
    )
    const newLocation = add(newState.location, newVelocity)

    boidsStore.update(this.id, (entity) => ({
      state: {
        ...entity.state,
        ...newState,
        acceleration: initialState.acceleration,
        velocity: newVelocity,
        location: newLocation,
      },
    }))
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
      state.location.x - this.config.size / 2,
      state.location.y - this.config.size / 2
    )
    this.ctx.arc(
      state.location.x,
      state.location.y,
      this.config.size,
      0,
      2 * Math.PI
    )
    this.ctx.fillStyle = this.config.color
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
      this.config.size
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
      this.config.awarenessAreaSize,
      0,
      2 * Math.PI
    )
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = this.config.color
    this.ctx.stroke()
  }

  // Draw area in which the boid wants to push itself away from others
  private drawSeparationArea(state: IBoidState): void {
    this.ctx.save()
    this.ctx.globalAlpha = 0.25

    this.ctx.beginPath()
    this.ctx.moveTo(
      state.location.x - this.config.size / 2,
      state.location.y - this.config.size / 2
    )
    this.ctx.arc(
      state.location.x,
      state.location.y,
      this.config.separationAreaSize,
      0,
      2 * Math.PI
    )
    this.ctx.fillStyle = this.config.color
    this.ctx.fill()

    this.ctx.restore()
  }
}

export default Boid
