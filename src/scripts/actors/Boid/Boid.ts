import Vector, { IVector } from "../../geometry/Vector";

// Utils
import * as PubSub from "../../services/pubSub";
import {
  add,
  applyForces,
  subtract,
  multiply,
  mag,
  normalize,
  limitMagnitude,
} from "../../utils/vectorHelpers";
import { IBehaviourType, seek, align, separate } from "../../behaviours/index";

// Config
import { config } from "./config";
import { config as appConfig } from "../../config";

// Stores
import { appStore } from "../../stores/appStore";

export interface IBoid {
  init: () => void;
  render: () => void;
  size: number;
  state: IState;
}

interface IState {
  location: IVector;
  acceleration: IVector;
  velocity: IVector;
  friction: IVector;
  targetVector: IVector;
  normTargetVector: IVector;
  showTargetVector: boolean;
  showNormalizedTargetVector: boolean;
  showAwarenessArea: boolean;
  showSeparationArea: boolean;
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

const onMouseUpdate = (e: MouseEvent): void => {
  mouseVector.x = e.pageX;
  mouseVector.y = e.pageY;
};

document.addEventListener("mousemove", onMouseUpdate);

// Setup
class Boid implements IBoid {
  private ctx: CanvasRenderingContext2D;
  private awarenessAreaSize: number;
  private separationAreaSize: number;
  private color: string;
  private maxSpeed: number;
  private frictionFactor: number;
  private behaviours: IBehaviourType[];
  public size: number;
  public state: IState;

  constructor(options: IOptions) {
    this.ctx = options.ctx;

    this.size = options.size;
    this.awarenessAreaSize = options.awarenessAreaSize;
    this.separationAreaSize = this.size + this.awarenessAreaSize / 10;
    this.color = options.color;

    // Set a max speed directly proportional to the weight (size)
    this.maxSpeed = this.size / 5;

    // Friction is directly proportional to weight (size)
    this.frictionFactor = this.size / appConfig.boids.maxSize / 15;

    // Set up all available behaviours
    this.behaviours = ["seek", "align", "separate"];

    // TODO: Get initial values from GUI
    this.state = {
      showTargetVector: true,
      showNormalizedTargetVector: true,
      showAwarenessArea: true,
      showSeparationArea: true,
      location: new Vector(options.x, options.y),
      acceleration: new Vector(0, 0),
      velocity: new Vector(0, 0),
      friction: new Vector(0, 0),
      targetVector: new Vector(0, 0),
      normTargetVector: new Vector(0, 0),
    };

    // Bind public functions
    this.init = this.init.bind(this);
  }

  public init(): void {
    this.bindListeners();
  }

  public bindListeners(): void {
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
    PubSub.subscribe(
      "gui:showSeparationArea",
      (val: boolean) => (this.state.showSeparationArea = val)
    );
  }

  public render(): void {
    this.update();
    this.draw();

    // Reset acceleration
    this.state.acceleration = multiply(this.state.acceleration, 0);
  }

  private getComputedSteering(): IVector {
    // Accumulator vector
    let steer = new Vector(0, 0);
    const otherBoids = appStore.state.boids.filter(
      (boid: IBoid) => boid !== this
    );

    if (this.behaviours.includes("seek")) {
      const options = {
        target: mouseVector,
        source: this,
        maxSteeringForce: config.maxSteeringForce,
        maxSpeed: this.maxSpeed,
      };
      const vec = seek(options);

      steer = add(steer, vec);
    }

    if (this.behaviours.includes("align")) {
      const options = {
        boids: otherBoids,
        source: this,
        awarenessAreaSize: this.awarenessAreaSize,
        alignmentFactor: config.alignmentFactor,
      };
      const vec = align(options);

      steer = add(steer, vec);
    }

    if (this.behaviours.includes("separate")) {
      const options = {
        boids: otherBoids,
        source: this,
        separationAreaSize: this.separationAreaSize,
        maxSpeed: this.maxSpeed,
      };
      const vec = separate(options);

      steer = add(steer, vec);
    }

    return steer;
  }

  private update(): void {
    this.state.targetVector = subtract(mouseVector, this.state.location);
    this.state.normTargetVector = normalize(this.state.targetVector);

    // Calculate a stopping distance from the target
    // This prevents the boid spazzing out by always reaching and then overshooting its target
    const distanceFromTarget = mag(this.state.targetVector);

    if (
      distanceFromTarget < config.stopThreshold &&
      mag(this.state.velocity) < 0.1
    ) {
      this.state.velocity = new Vector(0, 0);

      return;
    }

    const steer = this.getComputedSteering();

    // Assign a friction-like force that pushes back against the current direction
    const normVelocity = normalize(this.state.velocity);
    const normFriction = multiply(normVelocity, -1);
    const friction = multiply(normFriction, this.frictionFactor);

    const forces = [steer, friction];

    // Compound all external forces with the original vector. This will result
    // in a new vector pointing in the mean direction with a length
    // of the combined magnitude of all vectors.
    this.state.acceleration = applyForces(this.state.acceleration, forces);

    this.state.velocity = add(this.state.velocity, this.state.acceleration);
    this.state.velocity = limitMagnitude(this.state.velocity, this.maxSpeed);

    this.state.location = add(this.state.location, this.state.velocity);
  }

  private draw(): void {
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

    if (this.state.showSeparationArea) {
      this.drawSeparationArea();
    }
  }

  // Draw the shape
  private drawShape(): void {
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
  private drawTargetVector(): void {
    this.ctx.beginPath();
    this.ctx.moveTo(this.state.location.x, this.state.location.y);
    this.ctx.lineWidth = 1;
    this.ctx.lineTo(mouseVector.x, mouseVector.y);
    this.ctx.strokeStyle = config.targetVector.color;
    this.ctx.stroke();
  }

  // Draw normalized direction vector
  private drawDirectionVector(): void {
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
    this.ctx.strokeStyle = config.directionVector.color;
    this.ctx.stroke();
  }

  // Draw area in which the boid can be affected by external forces
  private drawAwarenessArea(): void {
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

  // Draw area in which the boid wants to push itself away from others
  private drawSeparationArea(): void {
    this.ctx.save();
    this.ctx.globalAlpha = 0.25;

    this.ctx.beginPath();
    this.ctx.moveTo(
      this.state.location.x - this.size / 2,
      this.state.location.y - this.size / 2
    );
    this.ctx.arc(
      this.state.location.x,
      this.state.location.y,
      this.separationAreaSize,
      0,
      2 * Math.PI
    );
    this.ctx.fillStyle = this.color;
    this.ctx.fill();

    this.ctx.restore();
  }
}

export default Boid;
