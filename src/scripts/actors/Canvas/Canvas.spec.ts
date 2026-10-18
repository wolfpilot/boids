import CanvasImpl from "./Canvas"

describe("Canvas", () => {
  it("keeps logical bounds and backing size current after resize", () => {
    const originalWidth = window.innerWidth
    const originalHeight = window.innerHeight
    const originalDpi = window.devicePixelRatio
    const element = document.createElement("canvas")
    const context = element.getContext("2d") as CanvasRenderingContext2D
    const canvas = new CanvasImpl(element, context)

    try {
      Object.defineProperties(window, {
        innerWidth: { configurable: true, value: 100 },
        innerHeight: { configurable: true, value: 80 },
        devicePixelRatio: { configurable: true, value: 2 },
      })
      canvas.init()
      expect(canvas.getBounds()).toEqual({ width: 100, height: 80 })
      expect(element.width).toBe(200)
      expect(element.height).toBe(160)

      const bounds = canvas.getBounds()
      bounds.width = 0
      expect(canvas.getBounds().width).toBe(100)

      Object.defineProperties(window, {
        innerWidth: { configurable: true, value: 60 },
        innerHeight: { configurable: true, value: 40 },
      })
      window.dispatchEvent(new Event("resize"))
      expect(canvas.getBounds()).toEqual({ width: 60, height: 40 })
      expect(element.width).toBe(120)
      expect(element.height).toBe(80)
    } finally {
      Object.defineProperties(window, {
        innerWidth: { configurable: true, value: originalWidth },
        innerHeight: { configurable: true, value: originalHeight },
        devicePixelRatio: { configurable: true, value: originalDpi },
      })
    }
  })
})
