interface Canvas2DContext extends CanvasRenderingContext2D {
  clearColor: (color: string) => Canvas2DContext;
  clear: () => Canvas2DContext;
}
export { Canvas2DContext };
