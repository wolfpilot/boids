import Vector, { IVector } from "../../geometry/Vector";

// Utils
import * as PubSub from "../../utils/pubSub";
import {
  add,
  applyForces,
  subtract,
  multiply,
  normalize,
  limitXY,
} from "../../utils/vectorHelpers";

// Config
import { config as appConfig } from "../../config";

export interface IBoid {
  init: () => void;
  render: () => void;
}

interface IState {
  location: IVector;
  velocity: IVector;
  friction: IVector;
  targetVector: IVector;
  normTargetVector: IVector;
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
const mouseVector = new Vector(window.innerWidth / 2, window.innerHeight / 2);

const onMouseUpdate = (e: MouseEvent) => {
  mouseVector.x = e.pageX;
  mouseVector.y = e.pageY;
};

document.addEventListener("mousemove", onMouseUpdate);

// Setup
class Boid implements IBoid {
  private ctx: CanvasRenderingContext2D;
  private size: number;
  private awarenessAreaSize: number;
  private color: string;
  private maxSpeed: number;
  private accelerationFactor: number;
  private frictionFactor: number;
  public state: IState;

  constructor(options: IOptions) {
    this.ctx = options.ctx;
    this.size = options.size;
    this.awarenessAreaSize = options.awarenessAreaSize;
    this.color = options.color;

    // Calculate additional properties
    this.maxSpeed = this.size / 5;

    // Acceleration is inverse proportional to weight (size)
    this.accelerationFactor = appConfig.boids.maxSize / this.size / 5;

    // Friction is directly proportional to weight (size)
    this.frictionFactor = this.size / appConfig.boids.maxSize / 15;

    // TODO: Get initial values from GUI
    this.state = {
      showTargetVector: true,
      showNormalizedTargetVector: true,
      showAwarenessArea: true,
      location: new Vector(options.x, options.y),
      velocity: new Vector(0, 0),
      friction: new Vector(0, 0),
      targetVector: new Vector(0, 0),
      normTargetVector: new Vector(0, 0),
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
    this.update();
    this.draw();
  }

  private update() {
    this.state.targetVector = subtract(mouseVector, this.state.location);
    this.state.normTargetVector = normalize(this.state.targetVector);

    // TODO: Add attract GUI option
    // Set up forces
    const acceleration = multiply(
      this.state.normTargetVector,
      this.accelerationFactor
    );

    const frictionDirection = multiply(this.state.normTargetVector, -1);
    const friction = multiply(frictionDirection, this.frictionFactor);

    const forces = [acceleration, friction];

    // Compound all external forces with the original vector
    const velocity = applyForces(this.state.velocity, forces);

    this.state.velocity = limitXY(velocity, this.maxSpeed, this.maxSpeed);
    this.state.location = add(this.state.location, this.state.velocity);
  }

  private draw() {
    this.drawShape();

    if (this.state.showTargetVector) {
      this.drawTargetVector();
    }

    if (this.state.showNormalizedTargetVector) {
      this.drawDirectionVector();
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
    this.ctx.lineTo(mouseVector.x, mouseVector.y);
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
  }

  // Draw normalized direction vector
  private drawDirectionVector() {
    const normalizedDirectionVector = multiply(
      this.state.normTargetVector,
      this.size
    );

    this.ctx.beginPath();
    this.ctx.moveTo(this.state.location.x, this.state.location.y);
    this.ctx.lineWidth = 2;
    this.ctx.lineTo(
      this.state.location.x + normalizedDirectionVector.x,
      this.state.location.y + normalizedDirectionVector.y
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
