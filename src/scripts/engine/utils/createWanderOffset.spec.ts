import { createWanderOffset } from "@engine/utils/createWanderOffset"
import { mag } from "@utils/vectorHelper"

describe("createWanderOffset", () => {
  afterEach(() => jest.restoreAllMocks())

  it("samples radius from area so offsets are uniform across the disk", () => {
    jest.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(0.25)

    expect(createWanderOffset()).toEqual({ x: 0.5, y: 0 })
  })

  it.each([0, 0.25, 0.5, 0.75, 1])(
    "stays inside the unit disk at angle sample %s",
    (angle) => {
      jest
        .spyOn(Math, "random")
        .mockReturnValueOnce(angle)
        .mockReturnValueOnce(1)

      expect(mag(createWanderOffset())).toBeCloseTo(1)
    }
  )
})
