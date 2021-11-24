export abstract class WorkerBridge {
  canvasMap: { [name: string]: OffscreenCanvas };
  worker: Worker;

  constructor(script: string, canvasMap: { [name: string]: HTMLCanvasElement }) {
    this.canvasMap = {};
    const canvasList = [];
    for (const name in canvasMap) {
      const offscreen = canvasMap[name].transferControlToOffscreen();
      this.canvasMap[name] = offscreen;
      canvasList.push(offscreen);
    }

    this.worker = new Worker(script);
    this.worker.onmessage = ((event: string) => {
      const on = this.on || {};
      if (on[event] instanceof Function) {
        on[event]();
      }
    }) as any;

    this.emit('init', this.canvasMap, canvasList);
  }

  abstract on: {
    [event: string]: Function;
  };

  emit(event: string, data?: any, list?: any[]): void {
    this.worker.postMessage(
      {
        event,
        data,
      },
      list
    );
  }

  paint() {
    this.emit('paint');
  }
}
