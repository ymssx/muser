export const pureBox = (props: Object) => {
  const { color } = props as any;

  return (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = color as string || 'green';
    ctx.fillRect(0, 0, 100, 30);
  };
};
