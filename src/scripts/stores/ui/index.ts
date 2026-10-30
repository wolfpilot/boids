import { UiStore } from "@stores/ui/ui.store"
import { UiService } from "@stores/ui/ui.service"
import { UiQuery } from "@stores/ui/ui.query"

export { UiStore, UiService, UiQuery }

export const uiStore = new UiStore()
export const uiService = new UiService(uiStore)
export const uiQuery = new UiQuery(uiStore)
