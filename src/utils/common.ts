import { Data } from "src/const/common";

/**
 * @param props new object
 * @param old origin object
 * @returns is object updated
 */
export const hasChangeProps = (props: unknown, old: unknown): boolean => {
  if (props === old) {
    return false;
  }
  if (props === null || old === null) {
    return true;
  }

  if (typeof props === "object" && typeof old === "object") {
    for (const key in props) {
      const propsValue = (props as Data)[key];
      const oldValue = (old as Data)[key];

      if (!(old as object).hasOwnProperty(key)) {
        return true;
      }
      // both have common key
      if (typeof propsValue === "object") {
        const res = hasChangeProps(propsValue, oldValue);
        if (res) {
          return true;
        }
      } else {
        if (propsValue !== oldValue) {
          return true;
        }
      }
    }
    return false;
  } else {
    return true;
  }
};
