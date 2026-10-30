import { AppStore } from "@stores/app/app.store"
import { AppService } from "@stores/app/app.service"
import { AppQuery } from "@stores/app/app.query"

export { AppStore, AppService, AppQuery }

export const appStore = new AppStore()
export const appService = new AppService(appStore)
export const appQuery = new AppQuery(appStore)
