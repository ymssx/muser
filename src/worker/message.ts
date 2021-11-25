import Muse from '../muse';
import { renderToNewCanvas } from '../render/render';

export const addEventListener = (root: Muse) => {
  self.addEventListener('message', ({ data: res }) => {
    const { event, data } = res;

    // init事件
    if (event === 'init') {
      console.log('init', data);
      root.childs.forEach((element) => {
        if (element.$.canvasName && data.hasOwnProperty(element.$.canvasName)) {
          renderToNewCanvas(element, data[element.$.canvasName]);
        }
      });
    } else if (event === 'render') {
      root.render();
    }
  });
};
