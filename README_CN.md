# Muser

<a href="https://www.npmjs.com/package/muser">
  <img src="https://img.shields.io/npm/v/muser"/>
</a>

[English](https://github.com/ymssx/muse/blob/master/README.md)

构建复杂UI的Canvas组件化框架.

- 组件化
- 高性能
- 易于使用

## 安装

```shell
npm install muser
```

或者

```shell
yarn add muser
```

## 使用

我们将制作一个简单的俄罗斯方块游戏，来简单地演示如何使用Muse构建你的应用。

### 创建第一个组件

首先我们创建一个容器组件。这个组件将在`render`方法中绘制一个实体矩形，作为我们应用的背景。

```js
import { Element } from 'muser';

class Container extends Element {
  // 自定义组件的内容
  render() {
    return (context) => {
      context.fillStyle = '#DDDDDD';
      context.fillRect(0, 0, 300, 1000);
    }
  }
}
```

`render`方法需要返回一个绘制函数，参数为Canvas上下文`context`，你可以使用它进行自定义的Canvas画布绘制。

### 给组件传递参数

我们来创建第二个组件吧。这次我们要给组件`Container`内部添加一个积木元素。以“田”字积木为例：

```js
class Block extends Element {
  render({ props }) {
    return (context) => {
      // 约定需要外部传递的参数
      const { boxColor } = props;

      context.fillStyle = boxColor || 'blue';
      context.fillRect(0, 0, 49, 49);
      context.fillRect(51, 0, 100, 49);
      context.fillRect(0, 51, 49, 100);
      context.fillRect(51, 51, 100, 100);
    };
  }
}
```

我们得到了一个默认蓝色的“田字”积木组件`Block`。在引用这个组件时，我们可以传递`boxColor`参数，在`render`方法里我们从`props`中可以读取到这个参数，这样就可以根据外部需要来动态上色了。

实际上，在实例化组件`Block`时，我们会在内部维护一个`Offscreen Canvas`来缓存组件的内部状态，这样在没有必要时（比如`boxColor`没有更新时），我们无需重复执行render方法进行视图绘制。

### 组件的引用

Muse是一个组件化的框架，这意味着我们可以轻松的引用其它的组件来构建复杂应用。

我们在最开始的`Container`组件中引用组件`Block`吧！

我们需要对组件进行修改：

```js
import { Element } from 'muser';

class Container extends Element {
  // 在这里引用其它组件，并指定尺寸
  block = new Block({ width: 100, height: 100 });

  render({ childs }) {
    // 从childs中访问上面指定的组件
    const { block } = childs;

    return (context) => {
      context.fillStyle = '#DDDDDD';
      context.fillRect(0, 0, 300, 1000);

      block({
        boxColor: 'green', // 传递的参数
      })
        .process(({ context }) => {
          // 后处理，可以对block组件的视图进行二次绘制
        })
        .paste({
          x: 0, // 在父组件中粘贴的x坐标
          y: 0, // 在父组件中粘贴的y坐标
        });
    };
  }
}
```

按照上面的方式引用后，我们可以对引用组件进行二次加工，最后使用`paste`方法进行视图粘贴。

### 让视图动起来

Muse是一个数据驱动的框架，当数据更新时，我们会自动驱使对应的组件进行视图更新。但是当组件没有必要更新时，我们会直接使用`Offscreen Canvas`中缓存的视图，以防止没有必要的重复绘制。另外，我们会尽可能地进行组件的局部渲染，来最大化框架的更新效率。

每个组件都有自己的内部状态，这个状态使用`State`对象来进行维护。要想让视图动起来，那么首先要让数据“动”起来。

按照我们的目标，我们需要让“田”字积木缓缓落下。在组件`Container`中，我们在子组件实例的`paste`方法中指定了粘贴的位置`(0, 0)`，现在我们做以下改造：

```js
import { Element } from 'muser';

class Container extends Element {
  block = new Block({ width: 100, height: 100 });

  // 内部状态，初始值
  state = {
    y: 0,
  };

  // 生命周期，实例被初始化
  created() {
    setTimeout(() => {
      // 将内部状态y的值增加50
      this.setState({
        y: 50,
      });
    }, 1000);
  }

  render({ childs, state }) {
    const { block } = childs;

    return (context) => {
      // 读取内部状态state
      const { y } = state;

      context.fillStyle = '#DDDDDD';
      context.fillRect(0, 0, 300, 1000);

      block({
        boxColor: 'green',
      })
        .paste({
          x: 100,
          y,  // 动态调整坐标，随着state下降
        });
    };
  }
}
```

我们维护了一个内部状态`y`，当`y`改变的时候，`block`的粘贴位置也跟着改变。

这个过程中，因为内部状态改变，组件`container`会被自动重绘，而子组件`block`由于参数`boxColor`没有发生更改，因此子组件不需要重绘。这样我们高效的完成了组件树的一次更新。

### 挂载到页面中

最外层的容器`Container`需要挂载到一个真实的`Canvas`元素上才能生效。依照下面的代码，你需要手动给它指定一个`HTMLCanvasElement`节点，同时设置它的绘制范围。

```ts
import { Muse } from 'muser';
import Container from 'src/components/container';

const app = new Muse([
  new Container({
    canvas: document.querySelector('#main'),
    width: 300,
    height: 300,
  }),
]);

app.render();
```

可以看到，我们的`Muse`构造函数接收一个组件数组，这意味着你可以指定多个根级组件来实现多图层渲染。

最后，对我们的`Muse`实例`app`使用`render`方法，整个应用就开始运转起来了！

### 使用WebWorker离屏渲染

相比于DOM渲染，`Canvas`应用的一大优势是，我们可以使用`WebWorker`来进行离屏渲染，渲染程序不会堵塞主程序。

在Muse中，我们可以轻松支持这一模式，仅仅需要新增一个文件：

```js
import { WorkerBridge } from 'muser';

const canvas = document.querySelector('#main');
const bridge = new WorkerBridge(
  'src/canvas-app.js',
  { wrapper: canvas },
);

bridge.render();
```

我们可能需要使用`Webpack`等打包工具来将应用合并为一个单文件，然后在WorkerBridge中引用，然后为它绑定一个真实的`Canvas`节点，我们会自动在worker线程中进行`Offscreen Canvas`的渲染，并在合适的时机同步到真实的`Canvas`中。
