import { Store, StoreConfig } from "@datorama/akita"

export interface IAppStoreState {
  isRunning: boolean
  elapsedTime: number
  lastDrawTime: number
}

const initialState: IAppStoreState = {
  isRunning: true,
  elapsedTime: 0,
  lastDrawTime: 0,
}

@StoreConfig({ name: "app" })
export class AppStore extends Store<IAppStoreState> {
  constructor() {
    super(initialState)
  }
}
