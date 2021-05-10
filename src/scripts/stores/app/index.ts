import { AppStore } from "./app.store"
import { AppService } from "./app.service"
import { AppQuery } from "./app.query"

export { AppStore, AppService, AppQuery }

export const appStore = new AppStore()
export const appService = new AppService(appStore)
export const appQuery = new AppQuery(appStore)
