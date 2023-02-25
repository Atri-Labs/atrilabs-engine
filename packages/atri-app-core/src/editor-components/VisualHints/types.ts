export type ComponentCoords = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type Position = { top: number; left: number };

export type BoxDimension = {
  // border and padding included
  width: number;
  // border and padding included
  height: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
};

export type HintDimension = {
  position: Position;
  dimension: { width: number; height: number };
};

export type BoxOverlay = (comp: { dimension: BoxDimension }) => HintDimension;

export type HintOverlay = {
  overlayId: string;
  compId: string;
  comp: React.ReactNode;
  box: BoxOverlay;
};

export type HintOverlayDimension = {
  box: HintDimension;
  canvasZoneCoords: ComponentCoords;
  compCoords: ComponentCoords;
};
