// Types
import { Vector } from "@ts/geometry"

class VectorImpl implements Vector {
  public x: number
  public y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

export default VectorImpl
