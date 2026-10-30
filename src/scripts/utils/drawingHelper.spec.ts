import VectorImpl from "@geometry/Vector"
import { drawArrow } from "@utils/drawingHelper"

describe("drawArrow", () => {
  const ctx = document.createElement("canvas").getContext("2d")!

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("draws a line and a small arrowhead in the vector's direction", () => {
    const origin = new VectorImpl(10, 20)
    const displacement = new VectorImpl(20, 0)
    const stroke = jest.spyOn(ctx, "stroke").mockImplementation(() => {
      expect(ctx.strokeStyle).toBe("#df8b8a")
      expect(ctx.lineWidth).toBe(3)
    })

    drawArrow({
      ctx,
      origin,
      displacement,
      color: "#df8b8a",
      lineWidth: 3,
      headSize: 6,
    })

    expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 10, 20)
    expect(ctx.lineTo).toHaveBeenNthCalledWith(1, 30, 20)
    expect(ctx.moveTo).toHaveBeenNthCalledWith(2, 24, 23)
    expect(ctx.lineTo).toHaveBeenNthCalledWith(2, 30, 20)
    expect(ctx.lineTo).toHaveBeenNthCalledWith(3, 24, 17)
    expect(stroke).toHaveBeenCalledTimes(1)
    expect(origin).toEqual(new VectorImpl(10, 20))
    expect(displacement).toEqual(new VectorImpl(20, 0))
    stroke.mockRestore()
  })

  it("limits the arrowhead to half of a short vector", () => {
    drawArrow({
      ctx,
      origin: new VectorImpl(0, 0),
      displacement: new VectorImpl(0, 4),
      color: "#000000",
      lineWidth: 3,
      headSize: 7,
    })

    expect(ctx.moveTo).toHaveBeenNthCalledWith(2, -1, 2)
    expect(ctx.lineTo).toHaveBeenNthCalledWith(3, 1, 2)
  })

  it("does not draw an arrow for a stationary vector", () => {
    drawArrow({
      ctx,
      origin: new VectorImpl(2, 3),
      displacement: new VectorImpl(0, 0),
      color: "#000000",
      lineWidth: 3,
      headSize: 7,
    })

    expect(ctx.stroke).not.toHaveBeenCalled()
  })
})
