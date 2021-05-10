import { Store, StoreConfig } from "@datorama/akita"

export interface IAppStoreState {
  isRunning: boolean
  fps: string
  fpsCount: number
  fpsInterval: number
  lastFpsSampleTime: number
  lastDrawTime: number
  elapsedTime: number
}

const initialState: IAppStoreState = {
  isRunning: true,
  fps: "",
  fpsCount: 0,
  fpsInterval: 0,
  lastFpsSampleTime: 0,
  lastDrawTime: 0,
  elapsedTime: 0,
}

@StoreConfig({ name: "app" })
export class AppStore extends Store<IAppStoreState> {
  constructor() {
    super(initialState)
  }
}
