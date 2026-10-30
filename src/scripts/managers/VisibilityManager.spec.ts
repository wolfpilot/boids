import VisibilityManager from "@managers/VisibilityManager"
import { appQuery } from "@stores/app"

describe("VisibilityManager", () => {
  it("tracks initial visibility and later resumes the app", () => {
    const original = Object.getOwnPropertyDescriptor(
      document,
      "visibilityState"
    )
    let visibility: DocumentVisibilityState = "hidden"
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => visibility,
    })

    try {
      VisibilityManager.init()
      expect(appQuery.isRunning).toBe(false)

      visibility = "visible"
      document.dispatchEvent(new Event("visibilitychange"))
      expect(appQuery.isRunning).toBe(true)
    } finally {
      if (original) Object.defineProperty(document, "visibilityState", original)
      else Reflect.deleteProperty(document, "visibilityState")
    }
  })
})
