import { Shims } from "./shims";

export function setup(
  registry: (comps: any[]) => void,
  React: any,
  ReactRuntime: any
) {
  Shims.React = React;
  Shims.ReactRuntime = ReactRuntime;
  import("./manifests").then((mod) => registry(mod.comps));
}
