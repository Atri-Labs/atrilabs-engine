import BaseLayer from "@atrilabs/base-layer";
// import LoadForestDataLayer from "@atrilabs/load-forest-data-layer";
import AppDesignLayer from "@atrilabs/app-design-layer";
import AtriIconLayer from "@atrilabs/atri-icon-layer";
import AppPageLayer from "@atrilabs/app-page-layer";
import CanvasBreakPointLayer from "@atrilabs/canvas-breakpoint-layer";
import ComponentListLayer from "@atrilabs/component-list-layer";
// import ManageCanvasRuntimeLayer from "@atrilabs/manage-canvas-runtime-layer";
import ComponentStyleLayer from "@atrilabs/component-style-layer";
// import OverlayHintsLayer from "@atrilabs/overlay-hints-layer";
// import PublishAppLayer from "@atrilabs/publish-app-layer";
import CustomPropsLayer from "@atrilabs/custom-props-layer";
// import AssetManagerLayer from "@atrilabs/asset-manager-layer";
// import AppTemplateLayer from "@atrilabs/app-template-layer";
// import ActionLayer from "@atrilabs/action-layer";
// import ResourceProcessLayer from "@atrilabs/resource-processor-layer";
// import UndoRedoLayer from "@atrilabs/undo-redo-layer";
// import ComponentNavigatorLayer from "@atrilabs/component-navigator";
// import ServicesStatusLayer from "@atrilabs/services-status-layer";
import CanvasLayer from "@atrilabs/pwa-canvas-layer";
// import StyleLayer from "@atrilabs/pwa-style-layer";

export default function App() {
  return (
    <>
      <BaseLayer />
      {/* <LoadForestDataLayer /> */}
      <AppDesignLayer />
      <AtriIconLayer />
      <AppPageLayer />
      <CanvasBreakPointLayer />
      <ComponentListLayer />
      <ComponentStyleLayer />
      {/* <PublishAppLayer /> */}
      <CustomPropsLayer />
      {/* <AssetManagerLayer /> */}
      {/* <AppTemplateLayer /> */}
      {/* <ActionLayer /> */}
      {/* <ResourceProcessLayer /> */}
      {/* <UndoRedoLayer /> */}
      {/* <ServicesStatusLayer /> */}
      {/* <CanvasRuntime>
        <ManageCanvasRuntimeLayer />
        <OverlayHintsLayer />
        <ComponentNavigatorLayer />
      </CanvasRuntime> */}
      {/* <StyleLayer /> */}
      <CanvasLayer />
    </>
  );
}
