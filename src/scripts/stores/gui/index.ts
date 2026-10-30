import { GuiStore } from "@stores/gui/gui.store"
import { GuiService } from "@stores/gui/gui.service"
import { GuiQuery } from "@stores/gui/gui.query"

export { GuiStore, GuiService, GuiQuery }

export const guiStore = new GuiStore()
export const guiService = new GuiService(guiStore)
export const guiQuery = new GuiQuery(guiStore)
