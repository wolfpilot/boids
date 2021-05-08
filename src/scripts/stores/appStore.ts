import { IBoid } from "../actors/Boid/Boid"

// Utils
import { Store } from "./Store"

export interface IAppStoreState {
  isRunning: boolean
  boids: IBoid[]
}

export type AppStore = Store<IAppStoreState>

const initialState: IAppStoreState = {
  isRunning: true,
  boids: [],
}

export const appStore: AppStore = new Store(initialState)
