import Link from '../components/link';
import Element from '../element';

interface ElementEvent {
  name: string;
  event: Event;
  x: number;
  y: number;
}

export const listenEvent = (element: Element) => {
  const canvas = element.canvas as HTMLCanvasElement;

  const addEvent = (eventName: keyof HTMLElementEventMap) => {
    canvas?.addEventListener(eventName, ((event: MouseEvent) => {
      let x, y;
      if (event.pageX || event.pageY) {
        x = event.pageX;
        y = event.pageY;
      } else {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }

      x -= canvas.offsetLeft;
      y -= canvas.offsetTop;
      x |= 0;
      y |= 0;

      broadcastEvent(element, {
        name: eventName,
        event,
        x,
        y,
      });
    }) as any);
  };

  addEvent('mousemove');
  addEvent('click');
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
      const [[xs, ys], { x: styleX = 0, y: styleY = 0 }] = snap;
      const currentX = (xs[xs.length - 1] || 0) + styleX;
      const currentY = (ys[ys.length - 1] || 0) + styleY;
      if (x >= currentX && x <= currentX + width && y >= currentY && y <= currentY + height) {
        broadcastEvent(child, {
          ...event,
          x: x - currentX,
          y: y - currentY,
        });
        child.$.mouseIn = true;
      } else if (child.$.mouseIn) {
        child.$.mouseIn = false;
        trigerEvent(child, {
          ...event,
          name: 'mouseout',
          x: x - currentX,
          y: y - currentY,
        });
      }
    });
  });
};
