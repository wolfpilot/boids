export interface IBoid {
  draw: () => void;
}

interface IState {
  x: number;
  y: number;
}

interface IOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  color: string;
}

class Boid implements IBoid {
  private ctx: CanvasRenderingContext2D;
  private size: number;
  private color: string;
  public state: IState;

  constructor(options: IOptions) {
    this.ctx = options.ctx;
    this.size = options.size;
    this.color = options.color;

    this.state = {
      x: options.x,
      y: options.y,
    };
  }

  public draw() {
    this.ctx.moveTo(this.state.x, this.state.y);

    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.state.x, this.state.y, this.size, this.size);
  }
}

export default Boid;
