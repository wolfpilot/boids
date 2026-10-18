// Types
import { BoidTraits, BoidState } from "../actors/Boid/Boid"

export interface BoidEntity {
  id: number
  traits: BoidTraits
  state: BoidState
}
