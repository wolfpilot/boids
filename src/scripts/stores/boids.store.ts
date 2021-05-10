import { IBoid } from "../actors/Boid/Boid"

// Utils
import { Store } from "./Store"

export interface IBoidsStoreState {
  entities: IBoid[]
}

export type BoidsStore = Store<IBoidsStoreState>

const initialState: IBoidsStoreState = {
  entities: [],
}

export const boidsStore: BoidsStore = new Store(initialState)
