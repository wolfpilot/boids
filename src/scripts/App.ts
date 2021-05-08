import Canvas, { ICanvas } from "./actors/Canvas/Canvas";
import Boid, { IBoid } from "./actors/Boid/Boid";

// Stores
import { appStore } from "./stores/appStore";

// Utils
import { getRandomNumber } from "./utils/MathHelpers";

// Interface
import GUI from "./interface/GUI";

// Config
import { config } from "./config";

let startTimestamp: number;

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

    appStore.setState({
      boids,
    });

    appStore.state.boids.forEach((boid: IBoid) => boid.init());

    requestAnimationFrame(this.tick);
  }

  private tick = (timestamp: number) => {
    if (!appStore.state.isRunning) return;

    if (!startTimestamp) {
      startTimestamp = timestamp;
    }

    // The elapsed time since starting a new animation cycle
    const elapsed = timestamp - startTimestamp;

    console.log(elapsed);

    if (this.canvas && this.canvas.state.isEnabled) {
      this.canvas.render();
    }

    if (appStore.state.boids && appStore.state.boids.length) {
      appStore.state.boids.forEach((boid: IBoid) => boid.render());
    }

    requestAnimationFrame(newTimestamp => this.tick(newTimestamp));
  };
}

export default App;
