import PointerManager from "@managers/PointerManager"
import { uiQuery, uiService } from "@stores/ui"

const dispatchPointer = (
  target: EventTarget,
  type: string,
  pointerType: string,
  x = 15,
  y = 25
) => {
  const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y })
  Object.defineProperty(event, "pointerType", { value: pointerType })
  target.dispatchEvent(event)
}

describe("PointerManager", () => {
  beforeAll(() => PointerManager.init())
  beforeEach(() => uiService.clearPointerPresence())

  it("tracks the mouse over the page and its GUI elements", () => {
    expect(uiQuery.isPointerPresent).toBe(false)

    const guiElement = document.createElement("button")
    document.body.appendChild(guiElement)

    try {
      dispatchPointer(guiElement, "pointermove", "mouse")

      expect(uiQuery.isPointerPresent).toBe(true)
      expect(uiQuery.pointerVector).toEqual({ x: 15, y: 25 })

      dispatchPointer(document.documentElement, "pointerleave", "mouse")
      expect(uiQuery.isPointerPresent).toBe(false)

      dispatchPointer(document.documentElement, "pointerenter", "mouse", 30, 40)
      expect(uiQuery.isPointerPresent).toBe(true)
      expect(uiQuery.pointerVector).toEqual({ x: 30, y: 40 })

      window.dispatchEvent(new Event("blur"))
      expect(uiQuery.isPointerPresent).toBe(false)
    } finally {
      guiElement.remove()
    }
  })

  it("does not activate seeking for touch input", () => {
    dispatchPointer(document.body, "pointermove", "touch")
    expect(uiQuery.isPointerPresent).toBe(false)
  })
})
