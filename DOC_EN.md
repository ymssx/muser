# Muse <a href="https://www.npmjs.com/package/muser">   <img src="https://img.shields.io/npm/v/muser"/> </a>  [English](https://github.com/ymssx/muse/blob/master/README.md)

Muse is a canvas-based component framework for building complex UIs. 

- Componentization
- High-performance
- Easy-to-use

## Installation

```shell
npm install muser
```

or

```shell
yarn add muser
```

## Usage

To demonstrate how to use Muse to build your application, we'll create a simple Tetris game.

### Creating the First Component

First, we'll create a container component. This component will draw a solid rectangle in the `render` method as the background of our application.

```js
import { Element } from 'muse';

class Container extends Element {
  // Custom component content
  render() {
    return (context) => {
      context.fillStyle = '#DDDDDD';
      context.fillRect(0, 0, 300, 1000);
    }
  }
}
```

The `render` method should return a drawing function that takes a canvas context `context` as its parameter. You can use it for custom canvas drawing.

### Passing Parameters to Components

Now let's create a second component. This time, we'll add a tetromino element to the `Container` component. Let's take the "O" shape tetromino as an example:

```js
class Block extends Element {
  render({ props }) {
    return (context) => {
      // Agreement on required external parameters
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

We have a "O" tetromino component `Block` that is blue by default. When using this component, we can pass the `boxColor` parameter. In the `render` method, we can read this parameter from `props` to dynamically change the color.

In fact, when instantiating the `Block` component, we maintain an `Offscreen Canvas` internally to cache the internal state of the component. This way, when unnecessary (such as when `boxColor` hasn't been updated), we don't need to repeatedly execute the `render` method for rendering the view.

### Component References

Muse is a component framework, which means we can easily reference other components to build complex applications.

Let's reference the `Block` component in the initial `Container` component!

We need to modify the component:

```js
import { Element } from 'muse';

class Container extends Element {
  // Here, we refer to other components and specify their sizes
  block = new Block({ width: 100, height: 100 });

  render({ childs }) {
    // Accessing the specified components from `childs`
    const { block } = childs;

    return (context) => {
      context.fillStyle = '#DDDDDD';
      context.fillRect(0, 0, 300, 1000);

      block({
        boxColor: 'green', // Passed parameter
      })
      .process(({ context }) => {
        // Post-processing, secondary drawing of the block component's view.
      })
      .paste({
        x: 0, // x-coordinate for pasting in the parent component
        y: 0, // y-coordinate for pasting in the parent component
      });
    };
  }
}
```

After referencing the component in the manner described above, we can perform secondary processing on the referenced component and paste the view using the `paste` method.

### Animating the View

Muse is a data-driven framework, which means that when data is updated, the corresponding component's view is automatically updated. However, when a component doesn't need updating, we use the cached view in the `Offscreen Canvas` to prevent redundant rendering. In addition, we try to perform partial rendering of the component to maximize the efficiency of the framework.

Each component has its own internal state, which we maintain using a `State` object. To make the view animate, we must first make the data animated.

According to our goal, we need to slowly slide the "O" tetromino down. In the `Container` component, we've specified the paste position for the child component as `(0, 0)`. Now, let's modify this by animating the "O" tetromino:  

```js
import { Element } from 'muse';

class Container extends Element {
  block = new Block({ width: 100, height: 100 });

  // Initial value for internal state
  state = {
    y: 0,
  };

  // Lifecycle - instantiated
  created() {
    setTimeout(() => {
      // Increase the value of the internal state y by 50
      this.setState({
        y: 50,
      });
    }, 1000);
  }

  render({ childs, state }) {
    const { block } = childs;

    // Read the internal state
    const { y } = state;

    return (context) => {
      context.fillStyle = '#DDDDDD';
      context.fillRect(0, 0, 300, 1000);

      block({
        boxColor: 'green',
      })
      .paste({
        x: 100,
        y, // Dynamically adjust the coordinates as state changes
      });
    };
  }
}
```

We have now defined an internal state `y` that changes the position of the "O" tetromino. When `y` changes, the position of the `block` component that is pasted in the container component also changes.

During this process, because the internal state changes, the `Container` component is automatically redrawn, but the `block` component does not need to be redrawn because the `boxColor` parameter has not changed. This way, we efficiently complete one tree update of the components.

### Mounting on the Page

The outermost container `Container` needs to be mounted on a real `Canvas` node to take effect. Using the following code, you'll need to manually specify an `HTMLCanvasElement` node for it and set its drawing range.

```ts
import { Muse } from 'muse';
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

As you can see, our `Muse` constructor receives an array of components, which means that you can specify multiple root components to achieve multi-layer rendering.

Finally, use the `render` method on our `Muse` instance `app`, and the entire application will start running!

### Using WebWorker Off-Screen Rendering

Compared to DOM rendering, one of the great advantages of canvas application is that we can use a `WebWorker` to perform off-screen rendering, ensuring that the rendering program will not block the main program.

In Muse, we can easily support this mode by adding a new file:

```js
import { WorkerBridge } from 'muse';

const canvas = document.querySelector('#main');
const bridge = new WorkerBridge(
  'src/canvas-app.js',
  { wrapper: canvas },
);

bridge.render();
```

We may need to use bundling tools such as `Webpack` to merge applications into a single file, then reference it in the `WorkerBridge`, binding it to a real `Canvas` node. We will automatically perform `Offscreen Canvas` rendering in the worker thread and synchronize it to the real `Canvas` at the appropriate time.
