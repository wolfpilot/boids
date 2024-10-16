import "jest-canvas-mock"

// Utils
import { isEntityOutside, isEntityOffscreen } from "./entityHelper"

// Geometry
import Vector from "../geometry/Vector"

describe("actorHelper", () => {
  it("should determine if the entity is found outside the area", () => {
    const scene = {
      minX: 100,
      minY: -300,
      maxX: 1280,
      maxY: 800,
    }

    // Entity 1
    const entity1 = {
      v: new Vector(250, 600),
      radius: 50,
    }

    const result1 = isEntityOutside({
      ...entity1,
      ...scene,
    })

    expect(result1).toBe(false)

    // Entity 2
    const entity2 = {
      v: new Vector(100, -300),
      radius: 50,
    }

    const result2 = isEntityOutside({
      ...entity2,
      ...scene,
    })

    expect(result2).toBe(false)

    // Entity 3
    const entity3 = {
      v: new Vector(49, -300),
      radius: 50,
    }

    const result3 = isEntityOutside({
      ...entity3,
      ...scene,
    })

    expect(result3).toBe(true)
  })

  it("should determine if the entity is found outside the screen", () => {
    const entity1 = {
      v: new Vector(250, 600),
      radius: 50,
    }

    const result = isEntityOffscreen({
      ...entity1,
    })

    expect(result).toBe(false)
  })
})
