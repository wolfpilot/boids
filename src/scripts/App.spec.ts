import App from "./App"
import Engine from "@engine/Engine"
import FpsMonitor from "@interface/FpsMonitor"
import { boidsQuery, boidsStore } from "@stores/boids"
import { guiQuery } from "@stores/gui"

describe("App global controls", () => {
  afterEach(() => {
    jest.restoreAllMocks()
    boidsStore.set([])
    document.body.innerHTML = ""
  })

  it("updates boids from stepped numeric controls and restores invalid input", () => {
    jest.spyOn(Engine.prototype, "start").mockImplementation()
    jest.spyOn(FpsMonitor.prototype, "init").mockImplementation()
    const setGlobalMultipliers = jest.spyOn(
      Engine.prototype,
      "setGlobalMultipliers"
    )
    document.body.innerHTML = '<canvas id="canvas"></canvas>'
    const app = new App()
    app.init()

    const globalRows = Array.from(
      document.querySelectorAll(".dg .cr.number")
    ).filter((element) =>
      element
        .querySelector(".property-name")
        ?.textContent?.includes("Multiplier")
    )
    expect(
      globalRows.map((element) =>
        element.querySelector(".property-name")?.textContent?.trim()
      )
    ).toEqual([
      "maxSpeedMultiplier",
      "brakingMultiplier",
      "alignmentMultiplier",
      "cohesionMultiplier",
      "seekingMultiplier",
      "separationMultiplier",
      "frictionMultiplier",
    ])
    const frictionRow = globalRows.find((element) =>
      element.textContent?.includes("frictionMultiplier")
    )
    const frictionInput = frictionRow?.querySelector("input")
    if (!frictionInput) throw new Error("No friction multiplier input")
    expect(frictionInput.value).toBe("0.33")
    const separationRow = globalRows.find((element) =>
      element.textContent?.includes("separationMultiplier")
    )
    expect(separationRow?.querySelector("input")?.value).toBe("1.25")

    const row = Array.from(document.querySelectorAll(".dg .cr")).find(
      (element) => element.textContent?.includes("cohesionMultiplier")
    )
    const input = row?.querySelector("input")
    if (!input) throw new Error("No cohesion multiplier input")
    expect(input.value).toBe(
      String(guiQuery.globalMultipliers.cohesionMultiplier)
    )

    input.value = "9.237"
    input.dispatchEvent(new Event("change", { bubbles: true }))

    expect(guiQuery.globalMultipliers.cohesionMultiplier).toBe(9.24)
    expect(setGlobalMultipliers).toHaveBeenLastCalledWith(
      guiQuery.globalMultipliers
    )
    const boid = boidsQuery.all[0]
    expect(boid.traits.cohesionAreaSize).toBe(boid.traits.size * 9.24)

    frictionInput.value = "0"
    frictionInput.dispatchEvent(new Event("change", { bubbles: true }))
    expect(guiQuery.globalMultipliers.frictionMultiplier).toBe(0)
    expect(boidsQuery.all[0].traits.frictionFactor).toBe(0)

    frictionInput.value = "0.33"
    frictionInput.dispatchEvent(new Event("change", { bubbles: true }))
    expect(guiQuery.globalMultipliers.frictionMultiplier).toBe(0.33)
    expect(boidsQuery.all[0].traits.frictionFactor).toBe(
      boid.traits.frictionFactor
    )

    input.value = "-1"
    input.dispatchEvent(new Event("change", { bubbles: true }))
    input.dispatchEvent(new Event("blur"))

    expect(guiQuery.globalMultipliers.cohesionMultiplier).toBe(9.24)
    expect(input.value).toBe("9.24")
  })
})
