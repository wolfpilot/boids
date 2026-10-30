import { config as appConfig } from "../../config"
import { getFlockDynamics } from "../../engine/utils/getFlockDynamics"
import { boidsStore } from "../../stores/boids"
import { guiService } from "../../stores/gui"
import Boid from "./Boid"

describe("Boid drawing", () => {
  afterEach(() => {
    jest.restoreAllMocks()
    boidsStore.set([])
    guiService.updateShowAlignmentArea(false)
    guiService.updateShowCohesionArea(false)
    guiService.updateShowSeekingArea(false)
    guiService.updateShowSeparationArea(false)
    guiService.updateShowStoppingArea(false)
  })

  it("draws current entity radii with the flock cycles", () => {
    const ctx = document.createElement("canvas").getContext("2d")
    if (!ctx) throw new Error("No canvas context")

    const boid = new Boid({
      ...appConfig.boids,
      id: 1,
      ctx,
      x: 50,
      y: 50,
      size: 10,
      color: "#ff0000",
    })
    boidsStore.set([
      {
        id: boid.id,
        state: boid.state,
        traits: {
          ...boid.traits,
          alignmentAreaSize: 100,
          cohesionAreaSize: 120,
          seekingAreaSize: 140,
          separationAreaSize: 130,
          brakingDistance: 150,
        },
      },
    ])
    guiService.updateShowAlignmentArea(true)
    guiService.updateShowCohesionArea(true)
    guiService.updateShowSeekingArea(true)
    guiService.updateShowSeparationArea(true)
    guiService.updateShowStoppingArea(true)
    const arc = jest.spyOn(ctx, "arc")

    boid.draw({
      ...getFlockDynamics(0),
      alignmentRadiusMultiplier: 2,
      cohesionRadiusMultiplier: 3,
      separationRadiusMultiplier: 4,
    })

    expect(arc).toHaveBeenCalledWith(50, 50, 200, 0, 2 * Math.PI)
    expect(arc).toHaveBeenCalledWith(50, 50, 360, 0, 2 * Math.PI)
    expect(arc).toHaveBeenCalledWith(50, 50, 140, 0, 2 * Math.PI)
    expect(arc).toHaveBeenCalledWith(50, 50, 520, 0, 2 * Math.PI)
    expect(arc).toHaveBeenCalledWith(50, 50, 150, 0, 2 * Math.PI)
  })
})
