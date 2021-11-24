import Muse from '../muse';

export const addEventListener = (root: Muse) => {
  self.addEventListener('message', ({ data: res }) => {
    const { event, data } = res;

    // init事件
    if (event === 'init') {
      console.log('init', data);
      root.childs.forEach((element) => {
        if (element.$.canvasName && data.hasOwnProperty(element.$.canvasName)) {
          element.canvas = data[element.$.canvasName];
        }
      });
      root.paint();
    }
  });
};
