import { GuiStore } from "./gui.store"
import { GuiService } from "./gui.service"
import { GuiQuery } from "./gui.query"

export { GuiStore, GuiService, GuiQuery }

export const guiStore = new GuiStore()
export const guiService = new GuiService(guiStore)
export const guiQuery = new GuiQuery(guiStore)
