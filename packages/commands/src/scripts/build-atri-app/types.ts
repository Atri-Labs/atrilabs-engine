import { getComponentsFromNodes } from "../../commons/build-utils";

export type PageInfo = {
  pagePath: string;
  routeObjectPath: string;
  eventsPath?: string;
  components: ReturnType<typeof getComponentsFromNodes>;
};
