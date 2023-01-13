// Segments

export type StaticSegment = { name: string; type: "static" };
/**
 * name without "[", "]"
 */
export type DynamicSegment = { name: string; type: "dynamic" };
/**
 * name without "[", "...", "]"
 */
export type CatchAllSegment = { name: string; type: "catchall" };

// Routes

export type NormalRoute = (StaticSegment | DynamicSegment)[];
export type CatchAllRoute = [
  StaticSegment | DynamicSegment,
  ...NormalRoute,
  CatchAllSegment
];

// Intermediate Representation

export type RoutesIR = (NormalRoute | CatchAllRoute)[];
