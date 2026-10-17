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

const stepBoid = (
  source: IBoidEntity,
  snapshot: readonly IBoidEntity[],
  target: IVector
): IBoidEntity => {
  const targetVector = subtract(target, source.state.location)

  const neighbours = snapshot.filter((boid) => boid.id !== source.id)
  const neighbourSteering = add(
    align({ boids: neighbours, source }),
    separate({ boids: neighbours, source })
  )
  const steering = add(seek({ target, source }), neighbourSteering)

  const state = {
    ...source.state,
    targetVector,
    normTargetVector: normalize(targetVector),
  }

  const shouldStop =
    mag(targetVector) < config.stopDistanceThreshold &&
    mag(source.state.velocity) < config.stopVelocityTreshold &&
    mag(neighbourSteering) === 0

  if (shouldStop) {
    return {
      ...source,
      state: {
        ...state,
        acceleration: new Vector(0, 0),
        velocity: new Vector(0, 0),
      },
    }
  }

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
      ...state,
      acceleration: new Vector(0, 0),
      velocity,
      location,
    },
  }
}

export const stepBoids = (
  snapshot: readonly IBoidEntity[],
  target: IVector
): IBoidEntity[] => snapshot.map((boid) => stepBoid(boid, snapshot, target))
