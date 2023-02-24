import { AnyEvent, CreateEvent, LinkEvent } from "@atrilabs/forest";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import CallbackTreeId from "@atrilabs/app-design-forest/src/callbackHandlerTree?id";
import { getId } from "./getID";

export function createEventsFromManifest(options: {
  manifest: ReactComponentManifestSchema;
  compId: string;
  manifestSchema: string;
  pkg: string;
  key: string;
  parent: { id: string; index: number; canvasZoneId: string };
}) {
  /**
   * First create the props for the component because the component
   * needs it upon first render. Hence, the order of the api calls is:
   * 1. Create Props
   * 2. Create Component
   * 3. Associate Alias with the Component
   */
  // 1. Create Props
  const { manifest, compId, manifestSchema, pkg, key, parent } = options;

  const events: AnyEvent[] = [];

  const propsKeys = Object.keys(manifest.dev.attachProps);
  for (let i = 0; i < propsKeys.length; i++) {
    const propKey = propsKeys[i];
    const treeId = manifest.dev.attachProps[propKey].treeId;
    const initialValue = manifest.dev.attachProps[propKey].initialValue;
    const propCompId = getId();
    const createEvent: CreateEvent = {
      id: propCompId,
      type: `CREATE$$${treeId}`,
      meta: {},
      state: {
        parent: { id: "", index: 0 },
        // NOTE: Introducting a convention to store node value in state's property field
        property: { [propKey]: initialValue },
      },
    };
    events.push(createEvent);

    const linkEvent: LinkEvent = {
      type: `LINK$$${treeId}`,
      refId: compId,
      childId: propCompId,
    };
    events.push(linkEvent);
  }

  // 2. Create Callback Handlers
  const defaultCallbacks = manifest.dev.defaultCallbackHandlers;
  const callbackCompId = getId();
  const createEvent: CreateEvent = {
    id: callbackCompId,
    type: `CREATE$$${CallbackTreeId}`,
    meta: {},
    state: {
      parent: { id: "", index: 0 },
      // NOTE: Introducting a convention to store node value in state's property field
      property: { callbacks: defaultCallbacks },
    },
  };
  events.push(createEvent);

  const linkEvent: LinkEvent = {
    type: `LINK$$${CallbackTreeId}`,
    refId: compId,
    childId: callbackCompId,
  };
  events.push(linkEvent);

  // 3. Create Component
  const event: CreateEvent = {
    id: compId,
    type: `CREATE$$${ComponentTreeId}`,
    meta: {
      pkg: pkg,
      key: key,
      manifestSchemaId: manifestSchema,
    },
    state: {
      parent,
    },
  };
  events.push(event);

  return events;
}
