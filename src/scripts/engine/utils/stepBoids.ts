import { config } from "../../actors/Boid/config"
import { align, seek, separate, wander } from "../../behaviours"
import VectorImpl from "../../geometry/Vector"
import type { BoidEntity } from "../../types/entities"
import type { Vector } from "../../types/geometry"
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
  source: BoidEntity,
  targetVector: Vector,
  neighbourSteering: Vector
): boolean =>
  mag(targetVector) < config.stopDistanceThreshold &&
  mag(source.state.velocity) < config.stopVelocityTreshold &&
  mag(neighbourSteering) === 0

const stopBoid = (source: BoidEntity): BoidEntity => ({
  ...source,
  state: {
    ...source.state,
    acceleration: new VectorImpl(0, 0),
    velocity: new VectorImpl(0, 0),
  },
})

const advanceBoid = (source: BoidEntity, steering: Vector): BoidEntity => {
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
      acceleration: new VectorImpl(0, 0),
      velocity,
      location,
    },
  }
}

const stepBoid = (
  source: BoidEntity,
  snapshot: readonly BoidEntity[],
  target: Vector
): BoidEntity => {
  const neighbours = snapshot.filter((boid) => boid.id !== source.id)
  const neighbourSteering = add(
    align({ boids: neighbours, source }),
    separate({ boids: neighbours, source })
  )

  // TODO: Detect if mouse in awareness area. If not, wander. Otherwise, seek.
  if (!target) {
    const { force, nextAngle } = wander({
      source,
      randomValue: Math.random(),
    })

    const boid = {
      ...source,
      state: {
        ...source.state,
        wanderAngle: nextAngle,
        targetVector: new VectorImpl(0, 0),
        normTargetVector: new VectorImpl(0, 0),
      },
    }

    return advanceBoid(boid, add(neighbourSteering, force))
  }

  const targetVector = subtract(target, source.state.location)
  const boid = {
    ...source,
    state: {
      ...source.state,
      targetVector,
      normTargetVector: normalize(targetVector),
    },
  }

  return shouldStop(source, targetVector, neighbourSteering)
    ? stopBoid(boid)
    : advanceBoid(boid, add(neighbourSteering, seek({ target, source })))
}

export const stepBoids = (
  snapshot: readonly BoidEntity[],
  target: Vector
): BoidEntity[] => snapshot.map((boid) => stepBoid(boid, snapshot, target))
