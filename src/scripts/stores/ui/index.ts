import { UiStore } from "./ui.store"
import { UiService } from "./ui.service"
import { UiQuery } from "./ui.query"

export { UiStore, UiService, UiQuery }

export const uiStore = new UiStore()
export const uiService = new UiService(uiStore)
export const uiQuery = new UiQuery(uiStore)
