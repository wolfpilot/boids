import { Store, StoreConfig } from "@datorama/akita"
import { AppStoreState } from "@stores/app/app.types"

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
