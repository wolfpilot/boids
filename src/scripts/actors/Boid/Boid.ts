import Vector, { IVector } from "../../geometry/Vector";

// Utils
import * as PubSub from "../../utils/pubSub";
import { add, subtract, multiply, normalize } from "../../utils/vectorHelpers";

// Config
import { config as appConfig } from "../../config";

export interface IBoid {
  init: () => void;
  render: () => void;
}

interface IState {
  location: IVector;
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
  private maxSpeed: number;
  public state: IState;

  constructor(options: IOptions) {
    this.ctx = options.ctx;
    this.size = options.size;
    this.awarenessAreaSize = options.awarenessAreaSize;
    this.color = options.color;

    // Speed is inverse proportional to weight (size)
    this.maxSpeed = Math.pow(appConfig.boids.maxSize / this.size, 2) * 2;

    // TODO: Get initial values from GUI
    this.state = {
      showTargetVector: true,
      showNormalizedTargetVector: true,
      showAwarenessArea: true,
      location: new Vector(options.x, options.y),
    };
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

  public render() {
    const mouseVector = new Vector(mouseX, mouseY);
    const targetVector = subtract(mouseVector, this.state.location);
    const normTargetVector = normalize(targetVector);

    this.update(normTargetVector);
    this.draw(normTargetVector);
  }

  private update(normTargetVector: IVector) {
    if (!mouseX || !mouseY) {
      return;
    }

    const scaledNormTargetVector = multiply(normTargetVector, this.maxSpeed);
    const velocity = scaledNormTargetVector;

    this.state.location = add(this.state.location, velocity);
  }

  private draw(normTargetVector: IVector) {
    this.drawShape();

    if (this.state.showTargetVector) {
      this.drawTargetVector();
    }

    if (this.state.showNormalizedTargetVector) {
      this.drawNormalizedTargetVector(normTargetVector);
    }

    if (this.state.showAwarenessArea) {
      this.drawAwarenessArea();
    }
  }

  // Draw the shape
  private drawShape() {
    this.ctx.beginPath();
    this.ctx.moveTo(
      this.state.location.x - this.size / 2,
      this.state.location.y - this.size / 2
    );
    this.ctx.arc(
      this.state.location.x,
      this.state.location.y,
      this.size,
      0,
      2 * Math.PI
    );
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }

  // Draw vector to target
  private drawTargetVector() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.state.location.x, this.state.location.y);
    this.ctx.lineWidth = 1;
    this.ctx.lineTo(mouseX, mouseY);
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
  }

  // Draw normalized direction vector
  private drawNormalizedTargetVector(normTargetVector: IVector) {
    const scaledNormTargetVector = multiply(normTargetVector, this.size);

    this.ctx.beginPath();
    this.ctx.moveTo(this.state.location.x, this.state.location.y);
    this.ctx.lineWidth = 2;
    this.ctx.lineTo(
      this.state.location.x + scaledNormTargetVector.x,
      this.state.location.y + scaledNormTargetVector.y
    );
    this.ctx.strokeStyle = "red";
    this.ctx.stroke();
  }

  // Draw area in which the boid can be affected by external forces
  private drawAwarenessArea() {
    this.ctx.beginPath();
    this.ctx.arc(
      this.state.location.x,
      this.state.location.y,
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
