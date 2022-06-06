import React from "react";

export type CssProprtyComponentType = {
  styles: React.CSSProperties;
  patchCb: (slice: any) => void;
};
