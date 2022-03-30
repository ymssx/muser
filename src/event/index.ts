import Element from '../element';

enum EventTriggerType {
  tigger = 'trigger',
  bubble = 'bubble',
}

interface ElementEvent {
  name: string;
  event: Event;
  x: number;
  y: number;
  type?: EventTriggerType;
}

let MouseInSetOld = new Set<Element>();
let MouseInSet = new Set<Element>();

export const listenEvent = (element: Element) => {
  const canvas = element.canvas as HTMLCanvasElement;

  const addEvent = (eventName: keyof HTMLElementEventMap) => {
    canvas?.addEventListener(eventName, ((event: MouseEvent) => {
      let x, y;
      const rect = canvas.getBoundingClientRect();

      x = event.clientX;
      y = event.clientY;
      x -= rect.left;
      y -= rect.top;
      x |= 0;
      y |= 0;

      MouseInSetOld = MouseInSet;
      MouseInSet = new Set();

      broadcastEvent(element, {
        name: eventName,
        event,
        x,
        y,
      });

      for (const element of MouseInSetOld) {
        if (!MouseInSet.has(element)) {
          trigerEvent(element, {
            name: 'out',
            event,
            x,
            y,
          });
        }
      }

      for (const element of MouseInSet) {
        if (!MouseInSetOld.has(element)) {
          trigerEvent(element, {
            name: 'in',
            event,
            x,
            y,
          });
        }
      }
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
  const { x, y } = event;
  const childList = element.$.childList || [];

  let hasChildTrigger = false;
  for (const child of childList) {
    const { width, height } = child.config;
    for (const snap of child.$.positionSnapshots || []) {
      const { x: styleX = 0, y: styleY = 0 } = snap;
      const currentX = styleX;
      const currentY = styleY;
      if (x >= currentX && x <= currentX + width && y >= currentY && y <= currentY + height) {
        hasChildTrigger = true;
        MouseInSet.add(child);
        broadcastEvent(child, {
          ...event,
          x: x - currentX,
          y: y - currentY,
        });
      }
    }
  }

  trigerEvent(element, {
    ...event,
    type: hasChildTrigger ? EventTriggerType.bubble : EventTriggerType.tigger,
  });
};
