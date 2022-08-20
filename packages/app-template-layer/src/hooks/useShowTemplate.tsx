import { api } from "@atrilabs/core";
import { CreateEvent, LinkEvent } from "@atrilabs/forest";
import { useEffect, useRef, useState } from "react";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { getReactComponentManifest } from "@atrilabs/canvas-runtime-utils";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import CallbackTreeId from "@atrilabs/app-design-forest/lib/callbackHandlerTree?id";

type ComponentData = {
  FC: React.FC<any>;
  props: any;
  children?: { id: string; index: number }[];
};

// ComponentData sorted in the direction of parent to child
type TemplateComponents = { [compId: string]: ComponentData };

// data structure required in intermediate computation
type PartialTemplateComponents = { [compId: string]: Partial<ComponentData> };

type FormattedTemplateData = {
  [dir: string]: { name: string; components: TemplateComponents }[];
};

function getComponentsFromTemplate(dir: string, name: string) {
  return new Promise<TemplateComponents>((res) => {
    api.getTemplateEvents(dir, name, (events) => {
      const templateComps: PartialTemplateComponents = {};
      const propMap: { [propNodeId: string]: any } = {};
      const links: { [propNodeId: string]: string } = {};

      events.forEach((event) => {
        const [eventType, eventTree] = event.type.split("$$");

        if (eventType === "CREATE" && eventTree === ComponentTreeId) {
          const createEvent = event as CreateEvent;
          const compId = createEvent.id;
          const { key, manifestSchemaId } = createEvent.meta;
          if (manifestSchemaId === ReactManifestSchemaId) {
            const manifestComp = getReactComponentManifest(key);
            // add FC
            templateComps[createEvent.id] = {
              FC: manifestComp.dev.comp || manifestComp.render.comp,
            };
            // add to parent's children
            const parent = createEvent.state.parent;
            if (templateComps[parent.id] === undefined) {
              templateComps[parent.id] = { children: [] };
            }
            templateComps[parent.id].children!.push({
              id: compId,
              index: parent.index,
            });
          } else {
            console.log("cannot handle non-react component manifest");
          }
        }

        if (
          eventType === "CREATE" &&
          eventTree !== ComponentTreeId &&
          eventTree !== CallbackTreeId
        ) {
          const createEvent = event as CreateEvent;
          if (propMap[createEvent.id]) {
            propMap[createEvent.id] = {
              ...createEvent.state.property,
              ...propMap[createEvent.id],
            };
          } else {
            propMap[createEvent.id] = createEvent.state.property;
          }
        }

        if (
          eventType === "LINK" &&
          eventTree !== ComponentTreeId &&
          eventTree !== CallbackTreeId
        ) {
          const linkEvent = event as LinkEvent;
          links[linkEvent.childId] = linkEvent.refId;
        }
      });

      // add props to components
      Object.keys(links).forEach((propNodeId) => {
        const compId = links[propNodeId];
        if (templateComps[compId]) {
          if (templateComps[compId].props) {
            templateComps[compId].props = {
              ...templateComps[compId].props,
              ...propMap[propNodeId],
            };
          } else {
            templateComps[compId].props = propMap[propNodeId] || {};
          }
        }
      });

      res(templateComps as TemplateComponents);
    });
  });
}

function recursive(
  dir: string,
  names: string[],
  currentFetchedIndex: number,
  cb: (templateComps: TemplateComponents, fetchIndex: number) => void
) {
  if (currentFetchedIndex < names.length) {
    getComponentsFromTemplate(dir, names[currentFetchedIndex]).then(
      (templateComps) => {
        cb(templateComps, currentFetchedIndex);
        currentFetchedIndex++;
        recursive(dir, names, currentFetchedIndex, cb);
      }
    );
  }
}

export const useShowTemplate = (dir: string, names: string[]) => {
  const [formattedData, setFormattedData] = useState<FormattedTemplateData>({});

  // do not fetch already fetched names
  const fetchedNames = useRef<{ [name: string]: boolean }>({});

  useEffect(() => {
    // conver names to map
    const namesMap: { [name: string]: boolean } = {};
    names.forEach((name) => {
      namesMap[name] = true;
    });

    // new templates to add
    const newNames: string[] = [];
    names.forEach((name) => {
      if (!(name in fetchedNames.current)) {
        newNames.push(name);
      }
    });

    // add new templates
    let currentFetchedIndex = 0;
    recursive(
      dir,
      newNames,
      currentFetchedIndex,
      (templateComps, fetchIndex) => {
        setFormattedData((formattedData) => {
          const newFormattedData = { ...formattedData };
          if (formattedData[dir]) {
            newFormattedData[dir].push({
              name: names[fetchIndex],
              components: templateComps,
            });
          } else {
            newFormattedData[dir] = [
              { name: names[fetchIndex], components: templateComps },
            ];
          }
          return newFormattedData;
        });
      }
    );

    // templates to remove
    Object.keys(fetchedNames.current).forEach((name) => {
      if (!(name in namesMap)) {
        setFormattedData((formattedData) => {
          const newFormattedData = { ...formattedData };
          delete newFormattedData[name];
          return { ...newFormattedData };
        });
        delete fetchedNames.current[name];
      }
    });
  }, [dir, names]);

  return formattedData;
};
