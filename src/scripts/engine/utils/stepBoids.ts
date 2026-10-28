import { config } from "../../actors/Boid/config"
import {
  align,
  cohere,
  seek,
  separate,
  wander,
  isInSeekingArea,
} from "../../behaviours"
import VectorImpl from "../../geometry/Vector"
import type { BoidEntity } from "../../types/entities"
import type { Bounds, Vector } from "../../types/geometry"
import {
  add,
  limitMagnitude,
  mag,
  multiply,
  normalize,
  subtract,
} from "../../utils/vectorHelper"
import { wrapLocation } from "./wrapLocation"
import { combineSteering } from "./combineSteering"
import { SteeringForces } from "../../behaviours/types"
import { createWanderOffset } from "./createWanderOffset"

interface StepBoidsOptions {
  snapshot: readonly BoidEntity[]
  bounds: Bounds
  target?: Vector
}

const shouldStop = (
  source: BoidEntity,
  targetVector: Vector,
  neighbourForces: SteeringForces
): boolean =>
  mag(targetVector) < config.stopDistanceThreshold &&
  mag(source.state.velocity) < config.stopVelocityTreshold &&
  mag(combineSteering(neighbourForces)) === 0

const stopBoid = (source: BoidEntity): BoidEntity => ({
  ...source,
  state: {
    ...source.state,
    acceleration: new VectorImpl(0, 0),
    velocity: new VectorImpl(0, 0),
  },
})

const advanceBoid = (
  source: BoidEntity,
  forces: SteeringForces
): BoidEntity => {
  const steering = combineSteering(forces, source.state.acceleration)
  const friction =
    source.traits.maxSpeed === 0
      ? new VectorImpl(0, 0)
      : multiply(
          source.state.velocity,
          -source.traits.frictionFactor / source.traits.maxSpeed
        )
  const acceleration = add(steering, friction)
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
  target?: Vector
): BoidEntity => {
  const neighbours = snapshot.filter((boid) => boid.id !== source.id)
  const neighbourForces = {
    alignment: align({ boids: neighbours, source }),
    cohesion: cohere({ boids: neighbours, source }),
    separation: separate({ boids: neighbours, source }),
  }

  if (!target || !isInSeekingArea(source, target)) {
    const { force, nextAngle } = wander({
      source,
      randomOffset: createWanderOffset(),
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

    return advanceBoid(boid, { ...neighbourForces, wander: force })
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

  return shouldStop(source, targetVector, neighbourForces)
    ? stopBoid(boid)
    : advanceBoid(boid, { ...neighbourForces, seek: seek({ target, source }) })
}

export const stepBoids = ({
  snapshot,
  bounds,
  target,
}: StepBoidsOptions): BoidEntity[] =>
  snapshot.map((source) => {
    const boid = stepBoid(source, snapshot, target)

    return {
      ...boid,
      state: {
        ...boid.state,
        location: wrapLocation(boid.state.location, boid.traits.size, bounds),
      },
    }
  })
