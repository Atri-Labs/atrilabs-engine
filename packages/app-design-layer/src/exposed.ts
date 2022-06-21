import { container, menu, tab } from "@atrilabs/core";

export const appMenu = menu("AppMenu")!;
export const pageMenu = menu("PageMenu")!;
export const canvasMenu = menu("CanvasMenu")!;
export const publishMenu = menu("PublishMenu")!;

export const canvasContainer = container("Canvas")!;
export const dropContainer = container("Drop")!;
export const playgroundOverlayContainer = container(
  "PlaygroundOverlayContainer"
)!;

export const propertiesTab = tab("PropertiesTab")!;
