import type { IBoidState, IBoidTraits } from "../actors/Boid/Boid"
import type { IBoidEntity } from "../types/entities"
import Vector from "../geometry/Vector"

interface IBoidEntityOverrides {
  id?: number
  traits?: Partial<IBoidTraits>
  state?: Partial<IBoidState>
}

export const createBoidEntity = ({
  id = 0,
  traits = {},
  state = {},
}: IBoidEntityOverrides = {}): IBoidEntity => ({
  id,
  traits: {
    size: 10,
    maxSpeed: 1,
    frictionFactor: 0,
    brakingDistance: 100,
    awarenessAreaSize: 100,
    separationAreaSize: 10,
    color: "#000000",
    ...traits,
  },
  state: {
    location: new Vector(0, 0),
    acceleration: new Vector(0, 0),
    velocity: new Vector(0, 0),
    friction: new Vector(0, 0),
    targetVector: new Vector(0, 0),
    normTargetVector: new Vector(0, 0),
    ...state,
  },
})
