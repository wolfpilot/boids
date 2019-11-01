import Vector, { IVector } from "../../geometry/Vector";

// Utils
import * as PubSub from "../../utils/pubSub";
import { subtract, multiply, normalize } from "../../utils/vectorHelpers";

export interface IBoid {
  init: () => void;
  draw: () => void;
}

interface IState {
  x: number;
  y: number;
  showTargetVector: boolean;
  showNormalizedTargetVector: boolean;
  showAwarenessArea: boolean;
}

interface IOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  awarenessAreaSize: number;
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
  private awarenessAreaSize: number;
  private color: string;
  private vector: IVector;
  public state: IState;

  constructor(options: IOptions) {
    this.ctx = options.ctx;
    this.size = options.size;
    this.awarenessAreaSize = options.awarenessAreaSize;
    this.color = options.color;

    // TODO: Get initial values from GUI
    this.state = {
      showTargetVector: true,
      showNormalizedTargetVector: true,
      showAwarenessArea: true,
      x: options.x,
      y: options.y,
    };

    this.vector = new Vector(this.state.x, this.state.y);
  }

  public init() {
    this.bindListeners();
  }

  public bindListeners() {
    PubSub.subscribe(
      "gui:showTargetVector",
      (val: boolean) => (this.state.showTargetVector = val)
    );
    PubSub.subscribe(
      "gui:showNormalizedTargetVector",
      (val: boolean) => (this.state.showNormalizedTargetVector = val)
    );
    PubSub.subscribe(
      "gui:showAwarenessArea",
      (val: boolean) => (this.state.showAwarenessArea = val)
    );
  }

  public draw() {
    this.drawShape();

    if (this.state.showTargetVector) {
      this.drawTargetVector();
    }

    if (this.state.showNormalizedTargetVector) {
      this.drawNormalizedTargetVector();
    }

    if (this.state.showAwarenessArea) {
      this.drawAwarenessArea();
    }
  }

  // Draw the shape
  private drawShape() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.state.x - this.size / 2, this.state.y - this.size / 2);
    this.ctx.arc(this.state.x, this.state.y, this.size, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }

  // Draw vector to target
  private drawTargetVector() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.state.x, this.state.y);
    this.ctx.lineWidth = 1;
    this.ctx.lineTo(mouseX, mouseY);
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
  }

  // Draw normalized direction vector
  private drawNormalizedTargetVector() {
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

  private drawAwarenessArea() {
    this.ctx.beginPath();
    this.ctx.arc(
      this.state.x,
      this.state.y,
      this.awarenessAreaSize,
      0,
      2 * Math.PI
    );
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();
  }
}

export default Boid;
