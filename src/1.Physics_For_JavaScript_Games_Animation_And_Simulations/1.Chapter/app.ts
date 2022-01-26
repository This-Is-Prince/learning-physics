import { Canvas2DContext } from "../lib";
import { Position, RenderLoop, Utils } from "../utils";

window.addEventListener("load", () => {
  // canvas
  const canvas = Utils.getCanvas("canvas");

  // set canvas size
  const width = 500;
  const height = 500;
  Utils.setCanvasSize(canvas, width, height);
  // context
  const ctx = Utils.get2DContext(canvas);
  ctx.clearColor("white");

  const ball = new Ball(20, 50, 50);
  const physics = new Physics(ball, 1, 2, 0);
  const renderer = new Renderer2D();
  renderer.render(function (_dt) {
    ctx.clear();
    physics.update(ctx);
    ball.draw(ctx);
  });
});

class Physics {
  private _g!: number;
  private _vx!: number;
  private _vy!: number;
  private bouncingFactor!: number;
  private isRest!: boolean;
  constructor(private body: Ball, g?: number, vx?: number, vy?: number) {
    this._g = g || 0.1;
    this._vx = vx || 1;
    this._vy = vy || 1;
    this.bouncingFactor = 0.8;
    this.isRest = false;
  }
  // public get g()
  update(ctx: Canvas2DContext) {
    if (!this.isRest) {
      this._vy += this._g;
      this.body.position.x += this._vx;
      this.body.position.y += this._vy;
      if (this.body.position.y > ctx.canvas.height - this.body.radius) {
        this.body.position.y = ctx.canvas.height - this.body.radius;
        this._vy *= -this.bouncingFactor;
      }
      if (this.body.position.x >= ctx.canvas.width - this.body.radius) {
        // this.body.position.x = -this.body.radius;
        this.isRest = true;
      }
    }
  }
}

class Renderer2D {
  private renderLoop!: RenderLoop;
  constructor(public fps?: number) {}
  render(callback: FrameRequestCallback) {
    if (this.renderLoop) {
      this.renderLoop.start();
    } else {
      this.renderLoop = new RenderLoop(callback, this.fps);
      this.renderLoop.start();
    }
  }
}

class Ball {
  private _radius!: number;
  private _position!: Position;
  private _color!: string;
  constructor(radius?: number, x?: number, y?: number, color?: string) {
    this._radius = radius || 25;
    this._position = new Position(x || 10, y || 10);
    this._color = color || "blue";
  }
  public get radius(): number {
    return this._radius;
  }
  public get position(): Position {
    return this._position;
  }
  public set radius(radius: number) {
    this._radius = radius;
  }
  public set position(pos: Position) {
    this._position = pos;
  }
  draw(ctx: Canvas2DContext) {
    ctx.fillStyle = this._color;
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      2 * Math.PI,
      true
    );
    ctx.closePath();
    ctx.fill();
  }
}
