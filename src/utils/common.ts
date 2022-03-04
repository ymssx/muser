import { Data } from '../const/common';

/**
 * @param props new object
 * @param old origin object
 * @returns is object updated
 */
export const objectDiff = (props: unknown, old: unknown): boolean => {
  if (props === old) {
    return false;
  }

  if (props === null || old === null) {
    return true;
  }

  if (typeof props === 'object' && typeof old === 'object') {
    for (const key in props) {
      const propsValue = (props as Data)[key];
      const oldValue = (old as Data)[key];

      if (propsValue !== oldValue) {
        return true;
      }

      // // both have common key
      // if (typeof propsValue === 'object') {
      //   const res = objectDiff(propsValue, oldValue);
      //   if (res) {
      //     return true;
      //   }
      // } else {
      //   if (propsValue !== oldValue) {
      //     return true;
      //   }
      // }
    }
    return false;
  } else {
    return true;
  }
};
