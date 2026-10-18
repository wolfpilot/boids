import { Store, StoreConfig } from "@datorama/akita"

export interface AppStoreState {
  isRunning: boolean
  elapsedTime: number
  lastDrawTime: number
}

const initialState: AppStoreState = {
  isRunning: true,
  elapsedTime: 0,
  lastDrawTime: 0,
}

@StoreConfig({ name: "app" })
export class AppStore extends Store<AppStoreState> {
  constructor() {
    super(initialState)
  }
}
