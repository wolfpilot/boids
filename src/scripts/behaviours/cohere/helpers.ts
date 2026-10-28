import { BoidEntity } from "../../types/entities"
import { mag, subtract } from "../../utils/vectorHelper"
import { isInFieldOfView } from "../utils/isInFieldOfView"

export const isInRange = (target: BoidEntity, source: BoidEntity): boolean => {
  const distance = mag(subtract(target.state.location, source.state.location))

  return (
    distance > 0 &&
    distance < source.traits.cohesionAreaSize &&
    isInFieldOfView(target, source)
  )
}
