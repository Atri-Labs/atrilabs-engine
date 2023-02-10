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
  parent: { id: string; index: number };
  decorators: React.FC<any>[];
  acceptsChild: boolean;
  callbacks: { [callbackName: string]: any };
};

export type CanvasComponentStore = {
  [canvasZoneId: string]: {
    [compId: string]: CanvasComponent;
  };
};

export type ComponentRendererProps = { id: string };

export type DecoratorData = { id: string };
