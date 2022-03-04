import Element from '../element';

interface ElementEvent {
  name: string;
  event: Event;
  x: number;
  y: number;
}

export const listenEvent = (element: Element) => {
  const canvas = element.canvas;
  canvas?.addEventListener('mousemove', (event) => {
    broadcastEvent(element, {
      name: 'mousemove',
      event,
      x: 0,
      y: 0,
    });
  });
  canvas?.addEventListener('click', (event) => {
    broadcastEvent(element, {
      name: 'click',
      event,
      x: 0,
      y: 0,
    });
  });
};

export const trigerEvent = (element: Element, event: ElementEvent) => {
  console.log(element, event);
};

export const broadcastEvent = (element: Element, event: ElementEvent) => {
  trigerEvent(element, event);
  const { x, y } = event;
  element.$.childList?.forEach(child => {
    const { width, height } = child.config;
    child.$.positionSnapshots?.forEach((snap) => {
      const [[xs, ys]] = snap;
      const currentX = xs[xs.length - 1];
      const currentY = ys[ys.length - 1];
      if (
        (x >= currentX && x <= (currentX + width))
        && (y >= currentY && y <= (currentY + height))
      ) {
        broadcastEvent(child, {
          ...event,
          x: x - currentX,
          y: y - currentY,
        });
      }
    })
  });
};
