import { IBoid } from "../actors/Boid/Boid"

// Utils
import { Store } from "./Store"

export interface IAppStoreState {
  isRunning: boolean
  elapsedTime: number
  lastDrawTime: number
  fpsInterval: number
  boids: IBoid[]
}

export type AppStore = Store<IAppStoreState>

const initialState: IAppStoreState = {
  isRunning: true,
  elapsedTime: 0,
  lastDrawTime: 0,
  fpsInterval: 0,
  boids: [],
}

export const appStore: AppStore = new Store(initialState)
