import Vector, { IVector } from "../../geometry/Vector";

// Utils
import * as PubSub from "../../utils/pubSub";
import {
  add,
  applyForces,
  subtract,
  multiply,
  mag,
  normalize,
  limitMagnitude,
} from "../../utils/vectorHelpers";

// Config
import { config } from "./config";
import { config as appConfig } from "../../config";

type IBehaviourType = "seek";

export interface IBoid {
  init: () => void;
  render: () => void;
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
  private frictionFactor: number;
  private behaviours: IBehaviourType[];
  public state: IState;

  constructor(options: IOptions) {
    this.ctx = options.ctx;
    this.size = options.size;
    this.awarenessAreaSize = options.awarenessAreaSize;
    this.color = options.color;

    // Set a max speed directly proportional to the weight (size)
    this.maxSpeed = this.size / 5;

    // Friction is directly proportional to weight (size)
    this.frictionFactor = this.size / appConfig.boids.maxSize / 15;

    // Set up all available behaviours
    this.behaviours = ["seek"];

    // TODO: Get initial values from GUI
    this.state = {
      showTargetVector: true,
      showNormalizedTargetVector: true,
      showAwarenessArea: true,
      location: new Vector(options.x, options.y),
      acceleration: new Vector(0, 0),
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

    // Reset acceleration
    this.state.acceleration = multiply(this.state.acceleration, 0);
  }

  private seek(target: IVector) {
    const targetVector = subtract(target, this.state.location);
    const normTargetVector = normalize(targetVector);

    // TODO: Add attract GUI option
    // Assume that the actor will desire to head towards its target at max speed
    const desired = multiply(normTargetVector, this.maxSpeed);

    // Assign a force that allows only a certain amount of maneuverability
    const seekVector = subtract(desired, this.state.velocity);
    const seek = limitMagnitude(seekVector, config.maxSteeringForce);

    return seek;
  }

  private getComputedSteering(): IVector {
    // Accumulator vector
    let steer = new Vector(0, 0);

    if (this.behaviours.includes("seek")) {
      const vec = this.seek(mouseVector);

      steer = add(steer, vec);
    }

    return steer;
  }

  private update() {
    this.state.targetVector = subtract(mouseVector, this.state.location);
    this.state.normTargetVector = normalize(this.state.targetVector);

    // Calculate a stopping distance from the target
    // This prevents the boid spazzing out by always reaching and then overshooting its target
    const dxTarget = mag(this.state.targetVector);

    if (dxTarget < config.stopThreshold) {
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
    this.ctx.strokeStyle = config.targetVector.color;
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
    this.ctx.strokeStyle = config.directionVector.color;
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
