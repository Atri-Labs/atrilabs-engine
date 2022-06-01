import { Catcher } from "../types";

const componentCatcher: Catcher = (dragData, _loc) => {
  if (dragData.type === "component") {
    return true;
  }
  return false;
};

export const bodyCatchers: Catcher[] = [componentCatcher];
