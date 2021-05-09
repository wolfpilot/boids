import { IBoid } from "../actors/Boid/Boid"

// Config
import { config } from "../config"

// Utils
import { Store } from "./Store"

export interface IAppStoreState {
  isRunning: boolean
  maxFps: number
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
  maxFps: config.app.maxFramerate,
  fps: "",
  fpsCount: 0,
  fpsInterval: 0,
  lastFpsSampleTime: 0,
  lastDrawTime: 0,
  elapsedTime: 0,
  // !: Move to a different store? Entities?
  boids: [],
}

export const appStore: AppStore = new Store(initialState)
