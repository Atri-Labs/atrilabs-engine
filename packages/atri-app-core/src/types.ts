import type { AnyEvent } from "@atrilabs/forest";
import type {
  AcceptsChildFunction,
  Callback,
  CallbackHandler,
  ReactComponentManifestSchema,
} from "@atrilabs/react-component-manifest-schema";

export type DragData = {
  type: "component";
  data: { pkg: string; key: string; manifestSchema: string; id: string };
};

export type DragComp = { comp: "CommonIcon"; props: any };

export type CanvasComponent = {
  id: string;
  ref: React.RefObject<HTMLElement>[];
  comp: React.FC<any>;
  props: any;
  parent: { id: string; index: number; canvasZoneId: string };
  decorators: React.FC<any>[];
  acceptsChild: AcceptsChildFunction | undefined;
  callbacks: { [callbackName: string]: any };
  meta: { manifestSchemaId: string; pkg: string; key: string };
  isRepeating: boolean;
  alias: string | undefined;
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

export type CanvasZoneEvent = "new_component" | "children_updated";

export type ComponentEvent =
  | "new_component"
  | "props_updated"
  | "children_updated";

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

export type ImportedResource = {
  str: string;
  method: "link" | "css";
  imports: {
    fonts?: {
      fontFamily: string;
      fontWeight: string | number;
      fontStyle: string;
    }[];
  };
};

export type ClipboardCopyObject = {
  type: "atri-copy-events";
  events: AnyEvent[];
  copiedCompId: string;
};

export type ClipboardPasteObject = Omit<ClipboardCopyObject, "type"> & {
  type: "atri-paste-events";
  pasteTargetComp?: string; // comp id where Ctrl + V event was emitted
  pasteTargetCanvasZone?: string;
};

export type ClipboardPasteObjectWithParent = Omit<
  ClipboardPasteObject,
  "type"
> & {
  parent: { id: string; index: number; canvasZoneId: string };
  newTemplateRootId: string;
};

export type Breakpoint = {
  min: number;
  max: number;
  isReferencePoint?: boolean; // desktop size is the reference point to apply styles
};

export interface LiveApiServerToClientEvents {
  newEvents(urlPath: string, events: AnyEvent[]): void;
}

export interface LiveapiClientToServerEvents {
  sendEvents(urlPath: string, callback: (events: AnyEvent[]) => void): void;
  runSSR(
    data: { urlPath: string; state: { [alias: string]: any }; query?: string },
    callback: (state: { [alias: string]: any }) => void
  ): void;
  runSSG(
    data: { urlPath: string; state: { [alias: string]: any } },
    callback: (state: { [alias: string]: any }) => void
  ): void;
}

export interface LiveApiInterServerEvents {}

export interface LiveApiSocketData {}

export type RepeatingContextData = {
  indices: number[];
  lengths: number[];
  compIds: string[];
};

export type ProdAppEntryOptions = {
  routes: { path: string }[];
  entryPageFC: React.FC<any>;
  entryRouteObjectPath: string;
  entryRouteStore: {
    [alias: string]: { custom: any };
  };
  styles: string;
  PageWrapper: React.FC<any>;
  aliasCompMap: AliasCompMapContextType;
  componentTree: ComponentTreeContextType;
};

export type AliasCompMapContextType = {
  [alias: string]: {
    Comp: React.FC<any>;
    ref: React.RefObject<HTMLElement>;
    actions: { [callbackName: string]: Callback[] };
    handlers: { [callbackName: string]: CallbackHandler };
    type?: "parent" | "repeating" | "normal";
  };
};

export type ComponentTreeContextType = {
  [canvasZoneId: string]: { [alias: string]: string[] }; // sorted alias
};

export type ManifestIR = {
  // path to component file
  component: string;
  // path to optional devComponent file
  devComponent?: string;
  // path to manifest file
  manifest: string;
  // the package in which this manifest & component is located
  pkg: string;
  // path to icon
  icon?: string;
};

export type ComponentManifests = {
  [pkg: string]: {
    [key: string]: {
      manifest: ReactComponentManifestSchema;
      paths: ManifestIR; // all the paths in this ManifestIR will be relative to package root dir
    };
  };
};
