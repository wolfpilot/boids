import Canvas, { ICanvas } from "./actors/Canvas/Canvas";
import Boid, { IBoid } from "./actors/Boid/Boid";

// Utils
import { getRandomNumber } from "./utils/MathHelpers";

// Interface
import GUI from "./interface/GUI";

// Config
import { config } from "./config";

interface IState {
  isRunning: boolean;
}

interface IApp {
  state: IState;
}

// Setup
let startTimestamp: number;

const initialState = {
  isRunning: true,
};

// Setup
class App implements IApp {
  public state = {
    ...initialState,
  };

  public canvasEl: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  private canvas: ICanvas | any;
  private boids: IBoid[];

  constructor() {
    this.canvasEl = <HTMLCanvasElement>document.getElementById("canvas");
    this.ctx = this.canvasEl.getContext("2d")!;

    this.boids = [];
  }

  public init() {
    const wWidth = window.innerWidth;
    const wHeight = window.innerHeight;

    if (!this.ctx) {
      throw new Error("Canvas context could not be initialised.");
    }

    // Setup instances
    const gui = new GUI();
    this.canvas = new Canvas(this.canvasEl, this.ctx);

    gui.init();
    this.canvas.init();

    this.boids = [...new Array(config.boids.count)].map(() => {
      const options = {
        ctx: this.ctx,
        x: getRandomNumber(0, wWidth),
        y: getRandomNumber(0, wHeight),
        size: getRandomNumber(config.boids.minSize, config.boids.maxSize),
        color:
          config.boids.colors[
            getRandomNumber(0, config.boids.colors.length - 1)
          ],
      };

      return new Boid(options);
    });

    this.boids.forEach((boid: IBoid) => boid.init());

    requestAnimationFrame(this.tick);
  }

  private tick = (timestamp: number) => {
    if (!this.state.isRunning) {
      return;
    }

    if (!startTimestamp) {
      startTimestamp = timestamp;
    }

    // The elapsed time since starting a new animation cycle
    const elapsed = timestamp - startTimestamp;

    console.log(elapsed);

    if (this.canvas && this.canvas.state.isEnabled) {
      this.canvas.draw();
    }

    if (this.boids && this.boids.length) {
      this.boids.forEach((boid: IBoid) => boid.draw());
    }

    requestAnimationFrame(newTimestamp => this.tick(newTimestamp));
  };
}

export default App;
