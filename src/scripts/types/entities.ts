// Types
import { BoidTraits, BoidState } from "../actors/Boid/types"

export interface BoidEntity {
  id: number
  traits: BoidTraits
  state: BoidState
}
