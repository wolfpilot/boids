export interface IVector {
  x: number;
  y: number;
}

class Vector implements IVector {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export default Vector;
