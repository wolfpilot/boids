import { config } from "../../config"
import { GuiQuery } from "@stores/gui/gui.query"
import { GuiService } from "@stores/gui/gui.service"
import { GuiStore } from "@stores/gui/gui.store"

describe("global boid multipliers", () => {
  it("switches pointer mode from seek to flee", () => {
    const store = new GuiStore()
    const query = new GuiQuery(store)
    const service = new GuiService(store)

    expect(query.pointerMode).toBe("seek")
    service.updatePointerMode("flee")
    expect(query.pointerMode).toBe("flee")
  })

  it("starts from the boid config and publishes valid edits", () => {
    const store = new GuiStore()
    const query = new GuiQuery(store)
    const service = new GuiService(store)
    const received: number[] = []
    const subscription = query.globalMultipliers$.subscribe((multipliers) => {
      received.push(multipliers.cohesionMultiplier)
    })

    expect(query.globalMultipliers).toEqual({
      maxSpeedMultiplier: config.boids.maxSpeedMultiplier,
      brakingMultiplier: config.boids.brakingMultiplier,
      alignmentMultiplier: config.boids.alignmentMultiplier,
      cohesionMultiplier: config.boids.cohesionMultiplier,
      seekingMultiplier: config.boids.seekingMultiplier,
      fleeingMultiplier: config.boids.fleeingMultiplier,
      separationMultiplier: config.boids.separationMultiplier,
      frictionMultiplier: config.boids.frictionMultiplier,
    })

    expect(service.updateCohesionMultiplier(0)).toBe(true)
    expect(query.globalMultipliers.cohesionMultiplier).toBe(0)
    expect(received).toEqual([config.boids.cohesionMultiplier, 0])
    subscription.unsubscribe()
  })

  it("updates each multiplier through its named method", () => {
    const store = new GuiStore()
    const query = new GuiQuery(store)
    const service = new GuiService(store)

    expect(service.updateMaxSpeedMultiplier(1)).toBe(true)
    expect(service.updateBrakingMultiplier(2)).toBe(true)
    expect(service.updateAlignmentMultiplier(3)).toBe(true)
    expect(service.updateCohesionMultiplier(4)).toBe(true)
    expect(service.updateSeekingMultiplier(5)).toBe(true)
    expect(service.updateFleeingMultiplier(5.5)).toBe(true)
    expect(service.updateSeparationMultiplier(6)).toBe(true)
    expect(service.updateFrictionMultiplier(7)).toBe(true)

    expect(query.globalMultipliers).toEqual({
      maxSpeedMultiplier: 1,
      brakingMultiplier: 2,
      alignmentMultiplier: 3,
      cohesionMultiplier: 4,
      seekingMultiplier: 5,
      fleeingMultiplier: 5.5,
      separationMultiplier: 6,
      frictionMultiplier: 7,
    })
  })

  it("rejects negative and non-finite values", () => {
    const store = new GuiStore()
    const query = new GuiQuery(store)
    const service = new GuiService(store)

    expect(service.updateFrictionMultiplier(-1)).toBe(false)
    expect(service.updateFrictionMultiplier(NaN)).toBe(false)
    expect(service.updateFrictionMultiplier(Infinity)).toBe(false)
    expect(service.updateFleeingMultiplier(-1)).toBe(false)
    expect(service.updateFleeingMultiplier(NaN)).toBe(false)
    expect(query.globalMultipliers.frictionMultiplier).toBe(
      config.boids.frictionMultiplier
    )
    expect(query.globalMultipliers.fleeingMultiplier).toBe(
      config.boids.fleeingMultiplier
    )
  })
})
