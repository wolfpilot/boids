import { IBoid } from "../actors/Boid/Boid"

// Utils
import { Store } from "./Store"

export interface IAppStoreState {
  startTimestamp: number
  elapsedTime: number
  isRunning: boolean
  boids: IBoid[]
}

export type AppStore = Store<IAppStoreState>

const initialState: IAppStoreState = {
  startTimestamp: 0,
  elapsedTime: 0,
  isRunning: true,
  boids: [],
}

export const appStore: AppStore = new Store(initialState)
