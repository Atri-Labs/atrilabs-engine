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

// Intermediate Representation
export type PathIR = (StaticSegment | DynamicSegment | CatchAllSegment)[];
export type PathsIR = PathIR[];
