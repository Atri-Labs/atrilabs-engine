import { createRef } from "react";
import { BodyComponent } from "./BodyComponent";
import { CanvasComponentStore, CanvasComponentTree } from "./types";

export const canvasComponentStore: CanvasComponentStore = {
  body: {
    id: "body",
    comp: BodyComponent,
    props: { children: [] },
    ref: createRef(),
    parent: { id: "", index: 0 },
    decorators: [],
    catchers: [],
  },
};

export const canvasComponentTree: CanvasComponentTree = {};
