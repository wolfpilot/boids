import { createBoidEntity } from "../../utils/testHelpers"
import { guiQuery } from "../../stores/gui"
import { getScaledBoidTraits } from "./getScaledBoidTraits"

describe("getScaledBoidTraits", () => {
  const initial = guiQuery.globalMultipliers
  const original = createBoidEntity({
    traits: {
      size: 20,
      maxSpeed: 3,
      maxSteeringForce: 0.55,
      brakingDistance: 60,
      alignmentAreaSize: 160,
      cohesionAreaSize: 60,
      seekingAreaSize: 120,
      separationAreaSize: 25,
      frictionFactor: 0.02,
    },
  }).traits

  it("scales all seven traits without changing the original or force cap", () => {
    const scaled = getScaledBoidTraits(original, {
      maxSpeedMultiplier: initial.maxSpeedMultiplier * 2,
      brakingMultiplier: initial.brakingMultiplier * 3,
      alignmentMultiplier: initial.alignmentMultiplier * 4,
      cohesionMultiplier: initial.cohesionMultiplier * 5,
      seekingMultiplier: initial.seekingMultiplier * 6,
      separationMultiplier: initial.separationMultiplier * 7,
      frictionMultiplier: initial.frictionMultiplier * 8,
    })

    expect(scaled).toEqual({
      ...original,
      maxSpeed: 6,
      brakingDistance: 180,
      alignmentAreaSize: 640,
      cohesionAreaSize: 300,
      seekingAreaSize: 720,
      separationAreaSize: 175,
      frictionFactor: 0.16,
    })
    expect(original.maxSpeed).toBe(3)
    expect(original.frictionFactor).toBe(0.02)
  })

  it("recovers the original values after a zero setting", () => {
    const zero = getScaledBoidTraits(original, {
      maxSpeedMultiplier: 0,
      brakingMultiplier: 0,
      alignmentMultiplier: 0,
      cohesionMultiplier: 0,
      seekingMultiplier: 0,
      separationMultiplier: 0,
      frictionMultiplier: 0,
    })

    expect(zero.maxSpeed).toBe(0)
    expect(zero.brakingDistance).toBe(0)
    expect(zero.alignmentAreaSize).toBe(0)
    expect(zero.cohesionAreaSize).toBe(0)
    expect(zero.seekingAreaSize).toBe(0)
    expect(zero.separationAreaSize).toBe(0)
    expect(zero.frictionFactor).toBe(0)
    expect(getScaledBoidTraits(original, initial)).toEqual(original)
  })
})
