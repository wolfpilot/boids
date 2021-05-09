import { IBoid } from "../actors/Boid/Boid"

// Utils
import { Store } from "./Store"

export interface IAppStoreState {
  isRunning: boolean
  fps: string
  fpsCount: number
  fpsInterval: number
  lastFpsSampleTime: number
  lastDrawTime: number
  elapsedTime: number
  boids: IBoid[]
}

export type AppStore = Store<IAppStoreState>

const initialState: IAppStoreState = {
  isRunning: true,
  fps: "",
  fpsCount: 0,
  fpsInterval: 0,
  lastFpsSampleTime: 0,
  lastDrawTime: 0,
  elapsedTime: 0,
  boids: [],
}

export const appStore: AppStore = new Store(initialState)
