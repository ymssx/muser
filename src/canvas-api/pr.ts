export const transPr = (style: string) => {
  const re = /(?<=\s*)(?<!\S)\d+\.?\d*pr(?=\s*)(?!\S)/i;
  let res = style;
  while (re.test(res)) {
    res = res.replace(re, (item) => {
      const res = item.match(/\d+\.?\d*/i);
      return `${Number((res ?? [parseFloat(item)])[0]) * window.devicePixelRatio}px`;
    });
  }
  return res;
};
