import { AcceptsChildFunction } from "@atrilabs/react-component-manifest-schema";

export type DragData = {
  type: "component";
  data: { pkg: string; key: string; manifestSchema: string; id: string };
};

export type DragComp = { comp: "CommonIcon"; props: any };

export type CanvasComponent = {
  id: string;
  ref: React.RefObject<HTMLElement>;
  comp: React.FC<any>;
  props: any;
  parent: { id: string; index: number; canvasZoneId: string };
  decorators: React.FC<any>[];
  acceptsChild: AcceptsChildFunction | undefined;
  callbacks: { [callbackName: string]: any };
  meta: { manifestSchemaId: string; pkg: string; key: string };
};

export type CanvasComponentStore = { [compId: string]: CanvasComponent };

export type CanvasZoneReverseMap = {
  [canvasZoneId: string]: string[];
};

export type ComponentReverseMap = { [parentCompId: string]: string[] };

export type CanvasZoneRendererProps = {
  canvasZoneId: string;
  styles?: React.CSSProperties;
};

export type ParentComponentRendererProps = { id: string };

export type NormalComponentRendererProps = { id: string };

export type RepeatingComponentRendererProps = { id: string };

export type DecoratorData = { id: string };

export type CanvasZoneEvent = "new_component";

export type ComponentEvent = "new_component";

export type ComponentCoordsWM = {
  top: number;
  left: number;
  width: number;
  height: number;
  topWM: number;
  leftWM: number;
  rightWM: number;
  bottomWM: number;
};

export type Location = { pageX: number; pageY: number };
