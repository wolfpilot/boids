import {
  darkenHexColor,
  lightenHexColor,
  saturateHexColor,
} from "@utils/colorHelper"

describe("darkenHexColor", () => {
  it("darkens each RGB channel by ten percent", () => {
    expect(darkenHexColor("#f89a99", 0.1)).toBe("#df8b8a")
    expect(darkenHexColor("#FD4365", 0.1)).toBe("#e43c5b")
  })

  it("leaves unsupported color formats unchanged", () => {
    expect(darkenHexColor("red", 0.1)).toBe("red")
  })

  it("clamps the amount to the range from zero to one", () => {
    expect(darkenHexColor("#804020", -1)).toBe("#804020")
    expect(darkenHexColor("#804020", 2)).toBe("#000000")
  })
})

describe("lightenHexColor", () => {
  it("moves RGB channels toward white", () => {
    expect(lightenHexColor("#804020", 0.5)).toBe("#c0a090")
    expect(lightenHexColor("#000000", 1)).toBe("#ffffff")
  })

  it("clamps the amount and leaves unsupported colors unchanged", () => {
    expect(lightenHexColor("#804020", -1)).toBe("#804020")
    expect(lightenHexColor("#804020", 2)).toBe("#ffffff")
    expect(lightenHexColor("red", 0.5)).toBe("red")
  })
})

describe("saturateHexColor", () => {
  it("increases saturation while retaining hue and lightness", () => {
    expect(saturateHexColor("#804040", 0.5)).toBe("#a02020")
    expect(saturateHexColor("#804040", 1)).toBe("#c00000")
  })

  it("leaves grays and fully saturated colors unchanged", () => {
    expect(saturateHexColor("#808080", 0.5)).toBe("#808080")
    expect(saturateHexColor("#ff0000", 0.5)).toBe("#ff0000")
  })

  it("clamps the amount and leaves unsupported colors unchanged", () => {
    expect(saturateHexColor("#804040", -1)).toBe("#804040")
    expect(saturateHexColor("#804040", 2)).toBe("#c00000")
    expect(saturateHexColor("red", 0.5)).toBe("red")
  })
})
