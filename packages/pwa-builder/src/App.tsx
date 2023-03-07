import BaseLayer from "@atrilabs/base-layer";
import AppDesignLayer from "@atrilabs/app-design-layer";
import AtriIconLayer from "@atrilabs/atri-icon-layer";
import AppPageLayer from "@atrilabs/app-page-layer";
import CanvasBreakPointLayer from "@atrilabs/canvas-breakpoint-layer";
import ComponentListLayer from "@atrilabs/component-list-layer";
import ComponentStyleLayer from "@atrilabs/component-style-layer";
import CustomPropsLayer from "@atrilabs/custom-props-layer";
import AssetManagerLayer from "@atrilabs/asset-manager-layer";
import ActionLayer from "@atrilabs/action-layer";
import ResourceProcessLayer from "@atrilabs/resource-processor-layer";
import CanvasLayer from "@atrilabs/pwa-canvas-layer";
import ComponentNavigatorLayer from "@atrilabs/component-navigator-layer";

export default function App() {
  return (
    <>
      <BaseLayer />
      <AppDesignLayer />
      <AtriIconLayer />
      <AppPageLayer />
      <CanvasBreakPointLayer />
      <ComponentListLayer />
      <ComponentStyleLayer />
      <CustomPropsLayer />
      <AssetManagerLayer />
      <ActionLayer />
      <ResourceProcessLayer />
      <CanvasLayer />
      <ComponentNavigatorLayer />
    </>
  );
}
