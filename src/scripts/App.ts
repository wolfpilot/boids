import Canvas, { ICanvas } from "./actors/Canvas/Canvas";
import Boid, { IBoid } from "./actors/Boid/Boid";

// Utils
import { Store } from "./Store";
import { getRandomNumber } from "./utils/MathHelpers";

// Interface
import GUI from "./interface/GUI";

// Config
import { config } from "./config";

interface IAppStoreState extends Store {
  isRunning: boolean;
  boids: IBoid[];
}

interface IStore extends Store {
  state: IAppStoreState;
}

// Setup
const initialState = {
  isRunning: true,
};

let startTimestamp: number;

// Create a new store
export const store = new Store() as IStore;

store.setState(initialState);

// Setup
class App {
  public canvasEl: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  private canvas: ICanvas | any;

  constructor() {
    this.canvasEl = <HTMLCanvasElement>document.getElementById("canvas");
    this.ctx = this.canvasEl.getContext("2d")!;
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

    const boids = [...new Array(config.boids.count)].map(() => {
      const size = getRandomNumber(config.boids.minSize, config.boids.maxSize);

      const options = {
        ctx: this.ctx,
        x: getRandomNumber(0, wWidth),
        y: getRandomNumber(0, wHeight),
        size,
        awarenessAreaSize: size * config.boids.awarenessFactor,
        color:
          config.boids.colors[
            getRandomNumber(0, config.boids.colors.length - 1)
          ],
      };

      return new Boid(options);
    });

    store.setState({
      boids,
    });

    store.state.boids.forEach((boid: IBoid) => boid.init());

    requestAnimationFrame(this.tick);
  }

  private tick = (timestamp: number) => {
    if (!store.state.isRunning) {
      return;
    }

    if (!startTimestamp) {
      startTimestamp = timestamp;
    }

    // The elapsed time since starting a new animation cycle
    const elapsed = timestamp - startTimestamp;

    console.log(elapsed);

    if (this.canvas && this.canvas.state.isEnabled) {
      this.canvas.render();
    }

    if (store.state.boids && store.state.boids.length) {
      store.state.boids.forEach((boid: IBoid) => boid.render());
    }

    requestAnimationFrame(newTimestamp => this.tick(newTimestamp));
  };
}

export default App;
