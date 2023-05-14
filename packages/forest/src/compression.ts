import { AnyEvent, ForestDef } from "./types";
import { createCompressedEvents } from "./createCompressedEvents";

/**
 * It implements a tree agnostic compression algorithm.
 * All patch events are merged. Only last link event is kept.
 * Only last unlink event is kept. A node is dropped if delete is emitted.
 */
export function compressEvents(events: AnyEvent[], forestDef: ForestDef) {
  const { linkEvents, nonRootCreateEvents, rootCreateEvents } =
    createCompressedEvents(events, forestDef);

  return [...nonRootCreateEvents, ...rootCreateEvents, ...linkEvents];
}
