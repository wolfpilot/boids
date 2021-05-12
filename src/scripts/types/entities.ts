// Types
import { IBoidTraits, IBoidState } from "../actors/Boid/Boid"

export interface IBoidEntity {
  id: number
  traits: IBoidTraits
  state: IBoidState
}
