import { api, getId } from "@atrilabs/core";
import { AnyEvent, CreateEvent, LinkEvent } from "@atrilabs/forest";

export function postTemplateEvents(params: {
  events: AnyEvent[];
  newTemplateRootId: string;
  forestPkgId: string;
  forestId: string;
  parentId: string;
  index: number;
}) {
  const { events, newTemplateRootId, forestPkgId, forestId, parentId, index } =
    params;

  const replacementIdMap: { [oldId: string]: string } = {};

  function createOrReturnNew(oldId: string) {
    if (replacementIdMap[oldId]) {
      return replacementIdMap[oldId];
    } else {
      const newId = getId();
      replacementIdMap[oldId] = newId;
      return newId;
    }
  }
  function replaceWithId(oldId: string, newId: string) {
    replacementIdMap[oldId] = newId;
  }

  const idAliasMap: { [oldId: string]: string } = {};

  const aliasPromises = events.map((event) => {
    return new Promise<void>((resolve) => {
      if (event.type.match(/^CREATE/)) {
        const createEvent = event as CreateEvent;
        // get alias if key field exists in meta
        if (createEvent.meta["key"]) {
          api.getNewAlias(forestPkgId, createEvent.meta["key"], (alias) => {
            idAliasMap[createEvent.id] = alias;
            resolve();
          });
        } else {
          // resolve immidiately if no key field exists
          resolve();
        }
      } else {
        resolve();
      }
    });
  });

  Promise.all(aliasPromises).then(() => {
    // find create event with templateRoot as parent
    // and add that to replacementIdMap
    events.forEach((event) => {
      if (event.type.match(/^CREATE/)) {
        const createEvent = event as CreateEvent;
        if (createEvent.state.parent.id === "templateRoot") {
          replaceWithId(createEvent.id, newTemplateRootId);
        }
      }
    });
    events.forEach((event) => {
      if (event.type.match(/^CREATE/)) {
        const createEvent = event as CreateEvent;
        const oldId = createEvent.id;
        if (idAliasMap[oldId]) {
          createEvent.state.alias = idAliasMap[oldId];
        }
        // replace all components with new id
        if (createEvent.state.parent.id === "templateRoot") {
          createEvent.id = newTemplateRootId;
          // templateRoot will be replaced by the parent (caughtBy) in which template is dropped
          createEvent.state.parent = { id: parentId, index };
        } else {
          createEvent.id = createOrReturnNew(createEvent.id);
          createEvent.state.parent.id = createOrReturnNew(
            createEvent.state.parent.id
          );
        }
      }
      if (event.type.match(/^LINK/)) {
        const linkEvent = event as LinkEvent;
        linkEvent.childId = createOrReturnNew(linkEvent.childId);
        linkEvent.refId = createOrReturnNew(linkEvent.refId);
      }
      const custom = { topmostId: newTemplateRootId };
      api.postNewEvents(forestPkgId, forestId, {
        events: [event],
        meta: { agent: "browser", custom },
        name: "TEMPLATE_EVENTS",
      });
    });
  });
}
