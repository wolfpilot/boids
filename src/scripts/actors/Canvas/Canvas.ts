// Config
import { config } from "./config";

interface IState {
  isEnabled: boolean;
  fill: string;
}

export interface ICanvas {
  init: () => void;
  draw: () => void;
  handleResize: () => void;
  update: (args: IState) => void;
}

class Canvas implements ICanvas {
  private state: IState;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.state = {
      ...config,
    };
  }

  public init() {
    this.resize();
  }

  public handleResize() {
    this.resize();
  }

  public update(args: IState) {
    this.state = { ...this.state, ...args };
  }

  public draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = this.state.fill;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private resize() {
    const dpi = window.devicePixelRatio;

    const wWidth = window.innerWidth;
    const wHeight = window.innerHeight;

    this.canvas.width = wWidth * dpi;
    this.canvas.height = wHeight * dpi;

    this.canvas.style.width = `${wWidth}px`;
    this.canvas.style.height = `${wHeight}px`;

    // !: Do NOT cache the DPI as state!
    // It needs to be set every time after the canvas size is updated
    this.ctx.scale(dpi, dpi);

    // Everything's updated, now draw it again!
    this.draw();
  }
}

export default Canvas;