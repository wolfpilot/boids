import { config } from "@actors/Boid/config"
import {
  align,
  cohere,
  seek,
  flee,
  separate,
  wander,
  getSeekingInfluence,
  getFleeingInfluence,
} from "@behaviours/index"
import VectorImpl from "@geometry/Vector"
import type { BoidEntity } from "@ts/entities"
import type { Bounds, Vector } from "@ts/geometry"
import {
  add,
  limitMagnitude,
  mag,
  multiply,
  normalize,
  subtract,
} from "@utils/vectorHelper"
import { wrapLocation } from "@engine/utils/wrapLocation"
import { combineSteering } from "@engine/utils/combineSteering"
import {
  FlockDynamics,
  SteeringForces,
  SteeringTarget,
} from "@behaviours/types"
import { createWanderOffset } from "@engine/utils/createWanderOffset"
import { getFlockDynamics } from "@engine/utils/getFlockDynamics"

interface StepBoidsOptions {
  snapshot: readonly BoidEntity[]
  bounds: Bounds
  target?: SteeringTarget
  flockDynamics?: FlockDynamics
}

const shouldStop = (
  source: BoidEntity,
  targetVector: Vector,
  neighbourForces: SteeringForces,
  flockDynamics: FlockDynamics
): boolean =>
  mag(targetVector) < config.stopDistanceThreshold &&
  mag(source.state.velocity) < config.stopVelocityTreshold &&
  mag(
    combineSteering(neighbourForces, {
      maxSteeringForce: source.traits.maxSteeringForce,
      weights: flockDynamics.steeringWeights,
    })
  ) === 0

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
  forces: SteeringForces,
  flockDynamics: FlockDynamics
): BoidEntity => {
  const steering = combineSteering(forces, {
    acceleration: source.state.acceleration,
    maxSteeringForce: source.traits.maxSteeringForce,
    weights: flockDynamics.steeringWeights,
  })
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

const getTargetInfluence = (
  source: BoidEntity,
  target?: SteeringTarget
): number => {
  if (!target) return 0

  return target.behaviour === "flee"
    ? getFleeingInfluence(source, target.position)
    : getSeekingInfluence(source, target.position)
}

const stepBoid = (
  source: BoidEntity,
  snapshot: readonly BoidEntity[],
  flockDynamics: FlockDynamics,
  target?: SteeringTarget
): BoidEntity => {
  const neighbours = snapshot.filter((boid) => boid.id !== source.id)
  const flockingSource = {
    ...source,
    traits: {
      ...source.traits,
      alignmentAreaSize:
        source.traits.alignmentAreaSize *
        flockDynamics.alignmentRadiusMultiplier,
      cohesionAreaSize:
        source.traits.cohesionAreaSize * flockDynamics.cohesionRadiusMultiplier,
      separationAreaSize:
        source.traits.separationAreaSize *
        flockDynamics.separationRadiusMultiplier,
    },
  }
  const neighbourForces = {
    alignment: align({ boids: neighbours, source: flockingSource }),
    cohesion: cohere({ boids: neighbours, source: flockingSource }),
    separation: separate({ boids: neighbours, source: flockingSource }),
  }

  const targetInfluence = getTargetInfluence(source, target)
  const targetVector =
    target && targetInfluence > 0
      ? subtract(target.position, source.state.location)
      : new VectorImpl(0, 0)
  const forces: SteeringForces = { ...neighbourForces }
  let wanderAngle = source.state.wanderAngle

  if (targetInfluence < 1) {
    const { force, nextAngle } = wander({
      source,
      randomOffset: createWanderOffset(),
    })
    forces.wander = multiply(force, 1 - targetInfluence)
    wanderAngle = nextAngle
  }

  if (target && targetInfluence > 0) {
    const steering =
      target.behaviour === "flee"
        ? flee({ target: target.position, source })
        : seek({ target: target.position, source })
    forces[target.behaviour] = multiply(steering, targetInfluence)
  }

  const boid = {
    ...source,
    state: {
      ...source.state,
      wanderAngle,
      targetVector,
      normTargetVector: normalize(targetVector),
    },
  }

  return target?.behaviour === "seek" &&
    targetInfluence === 1 &&
    shouldStop(source, targetVector, neighbourForces, flockDynamics)
    ? stopBoid(boid)
    : advanceBoid(boid, forces, flockDynamics)
}

export const stepBoids = ({
  snapshot,
  bounds,
  target,
  flockDynamics = getFlockDynamics(0),
}: StepBoidsOptions): BoidEntity[] =>
  snapshot.map((source) => {
    const boid = stepBoid(source, snapshot, flockDynamics, target)

    return {
      ...boid,
      state: {
        ...boid.state,
        location: wrapLocation(boid.state.location, boid.traits.size, bounds),
      },
    }
  })
