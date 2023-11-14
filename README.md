# Muser

<a href="https://www.npmjs.com/package/muser">
  <img src="https://img.shields.io/npm/v/muser"/>
</a>

![](https://visitor-badge.glitch.me/badge?page_id=ymssx.muser)

[中文](https://github.com/ymssx/muse/blob/master/README_CN.md)

A Canvas Componentization Framework to Help You Build Complex UI.

- Componentization
- High Performance
- Easy to Use

*This repo is still under development. If you encounter any issues, please feel free to contact me. Additionally, you are welcome to participate in the development together.*

## Install

```shell
npm install muser
```

or

```shell
yarn add muser
```

## Usage

```js
import { Element, useElement } from 'muser';
import ChildrenElement from 'src/components/children-element';

export default class HelloWord extends Element {
  state = { width: 10, color: 'green' };

  render({ state, props }) {
    const child = useElement(ChildrenElement, {
      width: 100,
      height: 100,
      key: 'child-element',
    });

    return [
      // re-render when 'width' and 'value' was changed
      (context) => {
        const { width } = state;
        const { value } = props;

        context.fillRect(0, 0, width, width);
        child({ value })
          .paste({  x: 0, y: 0 });
      },
      // re-render when 'color' was changed
      (context) => {
        const { color } = state;

        context.fillStyle = color;
        context.fillRect(0, 0, width, width);
      },
    ];
  }
}
```

## Document

[See Document](https://github.com/ymssx/muse/blob/master/DOC_EN.md)

