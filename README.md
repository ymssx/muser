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
import { Element, useElement, Brush } from 'muser';
import ChildrenElement from 'src/components/children-element';

export default class App extends Element<{ value: string }> {
  state = { width: 10, color: 'green' };

  render({ state, props }: App) {
    const child = useElement(ChildrenElement, {
      width: 100,
      height: 100,
      key: 'key-of-child-element',
    });

    // re-render when 'width' or 'value' or 'color' was changed
    return ({ rect }: Brush) => {
      const { width, color } = state;
      const { value } = props;

      rect([0, 0, width, width], { fillStyle: color });

      child({ value })
        .paste({  x: 0, y: 0 });
    };
  }
}

const app = new App({ width: 100, height: 100 });
app.init({ value: 'hello world!' });
```

## Document

[See Document](https://github.com/ymssx/muse/blob/master/DOC_EN.md)

