import path from "path";
import fs from "fs";
import { AnyEvent, createCompressedEvents } from "@atrilabs/forest";
import { forestDef } from "@atrilabs/atri-app-core/src/api/forestDef";

export function compress(options: { eventsFilepath: string }) {
  const absEventsFilepath = path.resolve(options.eventsFilepath);

  const events: AnyEvent[] = JSON.parse(
    fs.readFileSync(absEventsFilepath).toString()
  );

  const { linkEvents, nonRootCreateEvents, rootCreateEvents } =
    createCompressedEvents(events, forestDef);

  console.log(`Overwriting ${absEventsFilepath}`);
  fs.writeFileSync(
    absEventsFilepath,
    JSON.stringify(
      [...nonRootCreateEvents, ...rootCreateEvents, ...linkEvents],
      null,
      2
    )
  );
}
