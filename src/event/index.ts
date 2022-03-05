import Element from '../element';

interface ElementEvent {
  name: string;
  event: Event;
  x: number;
  y: number;
}

export const listenEvent = (element: Element) => {
  const canvas = element.canvas as HTMLCanvasElement;
  const rect = canvas.getBoundingClientRect();
  const rw = canvas.width / rect.width;
  const rh = canvas.height / rect.height;

  canvas?.addEventListener('mousemove', (event) => {
    const x = event.clientX - rect.left * rw;
    const y = event.clientY - rect.top * rh;

    broadcastEvent(element, {
      name: 'mousemove',
      event,
      x,
      y,
    });
  });
  canvas?.addEventListener('click', (event) => {
    const x = event.clientX - rect.left * rw;
    const y = event.clientY - rect.top * rh;

    broadcastEvent(element, {
      name: 'click',
      event,
      x,
      y,
    });
  });
};

export type EventCallBack = (event: ElementEvent) => void;

export const addEventListener = (element: Element, eventName: string, callback: EventCallBack) => {
  const map = element.$.eventMap;
  if (!map.has(eventName)) {
    map.set(eventName, new Set());
  }
  const set = map.get(eventName);
  set?.add(callback);
};

export const trigerEvent = (element: Element, event: ElementEvent) => {
  const map = element.$.eventMap;
  if (map.has(event?.name)) {
    map.get(event.name)?.forEach((callback) => callback(event));
  }
};

export const broadcastEvent = (element: Element, event: ElementEvent) => {
  trigerEvent(element, event);
  const { x, y } = event;
  element.$.childList?.forEach((child) => {
    const { width, height } = child.config;
    child.$.positionSnapshots?.forEach((snap) => {
      const [[xs, ys]] = snap;
      const currentX = xs[xs.length - 1];
      const currentY = ys[ys.length - 1];
      if (x >= currentX && x <= currentX + width && y >= currentY && y <= currentY + height) {
        broadcastEvent(child, {
          ...event,
          x: x - currentX,
          y: y - currentY,
        });
      }
    });
  });
};
