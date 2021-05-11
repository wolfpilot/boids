// Types
import { IBoidConfig, IBoidState } from "../actors/Boid/Boid"

export interface IBoidEntity {
  id: number
  config: IBoidConfig
  state: IBoidState
}
