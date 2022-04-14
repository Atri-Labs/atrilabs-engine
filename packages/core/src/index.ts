import { JsxElement } from "typescript";

export function setApp(_app: JsxElement) {}

export type ToolConfig = {
  layers: { pkg: string }[];
  /**
   * directory where editor code will be emitted.
   * web    - contains ui of editor
   * server - contains backend of editor
   */
  output: string;
};

export type LayerConfig = {
  modulePath: string;
};
