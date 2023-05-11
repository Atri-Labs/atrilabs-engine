import { getId } from "@atrilabs/core";
import { AnyEvent, CreateEvent } from "./types";
import { LinkEvent } from "@atrilabs/forest";

export function fixEvents(events: AnyEvent[]) {
  events.forEach((event, index) => {
    if (
      event.type !== "CREATE$$@atrilabs/app-design-forest/src/componentTree"
    ) {
      return;
    }
    const createEvent = event as CreateEvent;
    const attrsId = createEvent.id;
    const findLink = events.filter((event) => {
      const linkEvent = event as LinkEvent;
      return (
        linkEvent.refId === attrsId &&
        linkEvent.type.includes("LINK") &&
        linkEvent.type.includes("attributesTree")
      );
    });

    if (!findLink.length) {
      const id = getId(); // generate a new ID
      const attributeCreateEvent = {
        id: id,
        type: "CREATE$$@atrilabs/app-design-forest/src/attributesTree",
        meta: {},
        state: {
          parent: {
            id: "",
            index: 0,
          },
          property: {
            attrs: {},
          },
        },
      };

      const attributeLinkEvent = {
        type: "LINK$$@atrilabs/app-design-forest/src/attributesTree",
        refId: attrsId,
        childId: id,
      };
      events.splice(index + 1, 0, attributeCreateEvent);
      events.splice(index + 2, 0, attributeLinkEvent);
    }
  });
}
