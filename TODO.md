## TODO LIST

- ~~覆盖树算法~~ 暂时不做局部渲染

- 切片渲染
- hooks
  - 已实现 useElement

- 多组件渲染有问题，自组件无内容
- 后处理算法待验证
- 插槽在初次渲染不生效，和多点更新问题需要一起看一下

### 待讨论

- 子组件的宽高应不应该由父级决定？
  -- 不应该，因为组件绘图时不知道自己的尺寸

- 也许不需要局部渲染，因为使用offscreen canvas的成本不大，且为固定的（与canvas尺寸没太大关系）耗时 （有实验）
  从可维护性的角度上来说，组件树渲染更好

- 取消Muse，直接new根元素
