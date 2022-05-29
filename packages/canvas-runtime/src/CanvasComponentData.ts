import { createRef } from "react";
import { BodyComponent, bodyCatchers } from "./BodyComponent";
import { CanvasComponentStore, CanvasComponentTree } from "./types";

export const canvasComponentStore: CanvasComponentStore = {
  body: {
    id: "body",
    comp: BodyComponent,
    props: { children: [] },
    ref: createRef(),
    parent: { id: "", index: 0 },
    decorators: [],
    catchers: bodyCatchers,
  },
};

export const canvasComponentTree: CanvasComponentTree = {};
