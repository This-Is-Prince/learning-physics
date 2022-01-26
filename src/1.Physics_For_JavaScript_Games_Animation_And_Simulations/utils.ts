import { Canvas2DContext } from "./lib";

class RenderLoop {
  public isActive!: boolean;
  public msLastFrame!: number;
  public msFpsLimit!: number;
  public run!: FrameRequestCallback;
  constructor(public callback: FrameRequestCallback, fps?: number) {
    this.msLastFrame = performance.now();
    this.msFpsLimit = 0;
    if (fps && fps > 0) {
      this.msFpsLimit = fps / 1000;
      this.run = (() => {
        const msCurrent = performance.now();
        const deltaTime = msCurrent - this.msLastFrame;
        const msDelta = deltaTime / 1000;

        if (deltaTime >= this.msFpsLimit) {
          this.msLastFrame = msCurrent;
          this.callback(msDelta);
        }
        if (this.isActive) {
          window.requestAnimationFrame(this.run);
        }
      }).bind(this);
    } else {
      this.run = (() => {
        const msCurrent = performance.now();
        const msDelta = (msCurrent - this.msLastFrame) / 1000;

        this.msLastFrame = msCurrent;
        this.callback(msDelta);
        if (this.isActive) {
          window.requestAnimationFrame(this.run);
        }
      }).bind(this);
    }
  }

  start() {
    if (!this.isActive) {
      this.isActive = true;
      this.msLastFrame = performance.now();
      window.requestAnimationFrame(this.run);
    }
  }
  stop() {
    this.isActive = false;
  }
}

class Utils {
  private constructor() {}

  /**
   * Find HTMLCanvasElement with given id
   * @param id Canvas ID
   * @returns HTMLCanvasElement With current id
   */
  static getCanvas(id: string): HTMLCanvasElement {
    let canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) {
      console.error(
        `unable to find canvas with id ${id}, so we append our own canvas with id ${id}`
      );

      canvas = document.createElement("canvas");
      canvas.id = id;
      document.body.appendChild(canvas);
    }
    return canvas;
  }

  /**
   * Get 2D context of canvas
   * @param canvas HTMLCanvasElement
   * @returns 2D context for Canvas
   */
  static get2DContext(canvas: HTMLCanvasElement): Canvas2DContext {
    const ctx = canvas.getContext("2d") as Canvas2DContext;
    if (!ctx) {
      console.error(`unable to get 2D context from canvas ${canvas} `);
    }
    ctx.clearColor = function (color) {
      this.canvas.style.backgroundColor = color;
      return this;
    };
    ctx.clear = function () {
      this.save();
      this.setTransform(1, 0, 0, 1, 0, 0);
      this.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.restore();
      return this;
    };
    return ctx;
  }

  static setCanvasSize(
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ) {
    if (!canvas) {
      console.error(
        `unable to set canvas width and height, canvas is not defined`
      );
      return;
    }
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = width;
    canvas.height = height;
  }
}

class Position {
  private _x!: number;
  private _y!: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public get x(): number {
    return this._x;
  }
  public get y(): number {
    return this._y;
  }
  public set x(value: number) {
    this._x = value;
  }
  public set y(value: number) {
    this._y = value;
  }
}

export { Utils, RenderLoop, Position };
