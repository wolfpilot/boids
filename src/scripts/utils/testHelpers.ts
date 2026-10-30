import type { BoidState, BoidTraits } from "../actors/Boid/types"
import type { BoidEntity } from "../types/entities"
import VectorImpl from "../geometry/Vector"

interface BoidEntityOverrides {
  id?: number
  traits?: Partial<BoidTraits>
  state?: Partial<BoidState>
}

export const createBoidEntity = ({
  id = 0,
  traits = {},
  state = {},
}: BoidEntityOverrides = {}): BoidEntity => ({
  id,
  traits: {
    size: 10,
    maxSpeed: 1,
    maxSteeringForce: 0.5,
    frictionFactor: 0,
    brakingDistance: 100,
    alignmentAreaSize: 100,
    cohesionAreaSize: 60,
    seekingAreaSize: 80,
    separationAreaSize: 10,
    color: "#000000",
    ...traits,
  },
  state: {
    location: new VectorImpl(0, 0),
    acceleration: new VectorImpl(0, 0),
    velocity: new VectorImpl(0, 0),
    friction: new VectorImpl(0, 0),
    targetVector: new VectorImpl(0, 0),
    normTargetVector: new VectorImpl(0, 0),
    wanderAngle: 0,
    ...state,
  },
})
