// Types
import { IState as IBoidState } from "../actors/Boid/Boid"

export interface IBoidEntity {
  id: number
  size: number
  state: IBoidState
}
