import Canvas, { ICanvas } from "./actors/Canvas/Canvas";

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

  public canvasEl?: HTMLCanvasElement;
  public ctx?: CanvasRenderingContext2D;
  private canvas: ICanvas | any;

  public init() {
    this.canvasEl = <HTMLCanvasElement>document.getElementById("canvas");
    this.ctx = this.canvasEl.getContext("2d")!;

    // Setup instances
    this.canvas = new Canvas(this.canvasEl, this.ctx);

    this.canvas.init();

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

    requestAnimationFrame(newTimestamp => this.tick(newTimestamp));
  };
}

export default App;
