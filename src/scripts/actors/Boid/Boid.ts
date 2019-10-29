import Vector, { IVector } from "../../geometry/Vector";

// Utils
import { subtract, multiply, normalize } from "../../utils/vectorHelpers";

export interface IBoid {
  draw: () => void;
}

interface IState {
  x: number;
  y: number;
}

interface IOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  color: string;
}

// Setup
// *: Temporarily using the mouse as the common boid target
let mouseX: number;
let mouseY: number;

const onMouseUpdate = (e: MouseEvent) => {
  mouseX = e.pageX;
  mouseY = e.pageY;
};

document.addEventListener("mousemove", onMouseUpdate, false);
document.addEventListener("mouseenter", onMouseUpdate, false);

// Setup
class Boid implements IBoid {
  private ctx: CanvasRenderingContext2D;
  private size: number;
  private color: string;
  private vector: IVector;
  public state: IState;

  constructor(options: IOptions) {
    this.ctx = options.ctx;
    this.size = options.size;
    this.color = options.color;

    this.state = {
      x: options.x,
      y: options.y,
    };

    this.vector = new Vector(this.state.x, this.state.y);
  }

  public draw() {
    // Draw the shape
    this.ctx.moveTo(this.state.x - this.size / 2, this.state.y - this.size / 2);
    this.ctx.arc(this.state.x, this.state.y, this.size, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();

    // Draw vector to target
    this.ctx.beginPath();
    this.ctx.moveTo(this.state.x, this.state.y);
    this.ctx.lineWidth = 1;
    this.ctx.lineTo(mouseX, mouseY);
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();

    // Draw normalized direction vector
    const targetVector = subtract(new Vector(mouseX, mouseY), this.vector);
    const normTargetVector = normalize(targetVector);
    const scaledNormTargetVector = multiply(normTargetVector, this.size);

    this.ctx.beginPath();
    this.ctx.moveTo(this.state.x, this.state.y);
    this.ctx.lineWidth = 2;
    this.ctx.lineTo(
      this.state.x + scaledNormTargetVector.x,
      this.state.y + scaledNormTargetVector.y
    );
    this.ctx.strokeStyle = "red";
    this.ctx.stroke();
  }
}

export default Boid;
