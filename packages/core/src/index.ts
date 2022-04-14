import { JsxElement } from "typescript";

export function setApp(_app: JsxElement) {}

export type ToolConfig = {
  layers: { pkg: string }[];
};

export type LayerConfig = {
  modulePath: string;
};
