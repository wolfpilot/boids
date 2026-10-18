import { config } from "../../actors/Boid/config"
import { align, seek, separate } from "../../behaviours"
import Vector from "../../geometry/Vector"
import type { IBoidEntity } from "../../types/entities"
import type { IVector } from "../../types/geometry"
import {
  add,
  applyForces,
  limitMagnitude,
  mag,
  multiply,
  normalize,
  subtract,
} from "../../utils/vectorHelper"

const shouldStop = (
  source: IBoidEntity,
  targetVector: IVector,
  neighbourSteering: IVector
): boolean =>
  mag(targetVector) < config.stopDistanceThreshold &&
  mag(source.state.velocity) < config.stopVelocityTreshold &&
  mag(neighbourSteering) === 0

const stopBoid = (source: IBoidEntity): IBoidEntity => ({
  ...source,
  state: {
    ...source.state,
    acceleration: new Vector(0, 0),
    velocity: new Vector(0, 0),
  },
})

const advanceBoid = (
  source: IBoidEntity,
  target: IVector,
  neighbourSteering: IVector
): IBoidEntity => {
  const steering = add(neighbourSteering, seek({ target, source }))
  const friction = multiply(
    normalize(source.state.velocity),
    -source.traits.frictionFactor
  )
  const acceleration = applyForces(source.state.acceleration, [
    steering,
    friction,
  ])
  const velocity = limitMagnitude(
    add(source.state.velocity, acceleration),
    source.traits.maxSpeed
  )
  const location = add(source.state.location, velocity)

  return {
    ...source,
    state: {
      ...source.state,
      acceleration: new Vector(0, 0),
      velocity,
      location,
    },
  }
}

const stepBoid = (
  source: IBoidEntity,
  snapshot: readonly IBoidEntity[],
  target: IVector
): IBoidEntity => {
  const targetVector = subtract(target, source.state.location)
  const normTargetVector = normalize(targetVector)

  const boid = {
    ...source,
    state: {
      ...source.state,
      targetVector,
      normTargetVector,
    },
  }

  const neighbours = snapshot.filter((boid) => boid.id !== source.id)
  const neighbourSteering = add(
    align({ boids: neighbours, source }),
    separate({ boids: neighbours, source })
  )

  return shouldStop(source, targetVector, neighbourSteering)
    ? stopBoid(boid)
    : advanceBoid(boid, target, neighbourSteering)
}

export const stepBoids = (
  snapshot: readonly IBoidEntity[],
  target: IVector
): IBoidEntity[] => snapshot.map((boid) => stepBoid(boid, snapshot, target))
