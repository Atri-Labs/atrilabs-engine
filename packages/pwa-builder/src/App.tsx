import BaseLayer from "@atrilabs/base-layer";
import LoadForestDataLayer from "@atrilabs/load-forest-data-layer";
import AppDesignLayer from "@atrilabs/app-design-layer";
import AtriIconLayer from "@atrilabs/atri-icon-layer";
import AppPageLayer from "@atrilabs/app-page-layer";
import CanvasBreakPointLayer from "@atrilabs/canvas-breakpoint-layer";
import ComponentListLayer from "@atrilabs/component-list-layer";

export default function App() {
  return (
    <>
      <BaseLayer />
      <LoadForestDataLayer />
      <AppDesignLayer />
      <AtriIconLayer />
      <AppPageLayer />
      <CanvasBreakPointLayer />
      <ComponentListLayer />
    </>
  );
}
