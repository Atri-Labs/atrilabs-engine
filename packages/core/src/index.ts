import { JsxElement } from "typescript";

export function setApp(_app: JsxElement) {}

export type ToolConfig = {
  layers: { modulePath: string }[];
};
