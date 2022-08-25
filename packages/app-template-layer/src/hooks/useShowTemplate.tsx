import { api, TemplateDetail } from "@atrilabs/core";
import { CreateEvent, LinkEvent } from "@atrilabs/forest";
import { useEffect, useMemo, useRef, useState } from "react";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { getReactComponentManifest } from "@atrilabs/canvas-runtime-utils";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import CallbackTreeId from "@atrilabs/app-design-forest/lib/callbackHandlerTree?id";
import {
  FormattedTemplateData,
  PartialTemplateComponents,
  TemplateComponents,
} from "../types";

function getComponentsFromTemplate(relativeDir: string, name: string) {
  return new Promise<TemplateComponents>((res) => {
    api.getTemplateEvents(relativeDir, name, (events) => {
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
              ...templateComps[createEvent.id],
              FC: manifestComp.dev.comp || manifestComp.render.comp,
              acceptsChildren: manifestComp.dev.acceptsChild ? true : false,
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
  relativeDir: string,
  names: string[],
  currentFetchedIndex: number,
  cb: (templateComps: TemplateComponents, fetchIndex: number) => void
) {
  if (currentFetchedIndex < names.length) {
    getComponentsFromTemplate(relativeDir, names[currentFetchedIndex]).then(
      (templateComps) => {
        cb(templateComps, currentFetchedIndex);
        currentFetchedIndex++;
        recursive(relativeDir, names, currentFetchedIndex, cb);
      }
    );
  }
}

/**
 * This hook doesn't create the nodes that have already been created when
 * the templateDetails change. In other words, it takes a diff between already
 * rendered template names and newly created templates. It also takes a diff between
 * already rendered template and recenlty deleted template. To achieve this, it maintains
 * a fetchedNames ref as list of currently fetched nodes. It assumes templateDetails have
 * no duplicate entry.
 */
export const useShowTemplate = (
  selectedDir: string | null,
  templateDetails: TemplateDetail[]
) => {
  const [formattedData, setFormattedData] = useState<FormattedTemplateData>([]);

  // do not fetch already fetched names
  const fetchedNames = useRef<{ [name: string]: boolean }>({});

  // if selectedDir changes, we remove all previous data
  useEffect(() => {
    setFormattedData([]);
    fetchedNames.current = {};
  }, [selectedDir]);

  const filteredTemplateDetails = useMemo(() => {
    return [...templateDetails].filter(
      (detail) => detail.relativeDir === selectedDir
    );
  }, [templateDetails, selectedDir]);

  useEffect(() => {
    // convert names to map
    const namesMap: { [name: string]: boolean } = {};
    filteredTemplateDetails.forEach(({ templateName }) => {
      namesMap[templateName] = true;
    });

    // remove templates
    setFormattedData((formattedData) => {
      const newFormattedData = [...formattedData];
      Object.keys(fetchedNames.current).forEach((name) => {
        if (!(name in namesMap)) {
          const index = newFormattedData.findIndex(
            (curr) => curr.name === name
          );
          if (index >= 0) {
            newFormattedData.splice(index, 1);
            // update fetched name list
            delete fetchedNames.current[name];
          }
        }
      });
      return newFormattedData;
    });
  }, [filteredTemplateDetails]);

  useEffect(() => {
    if (selectedDir === null) return;
    // new templates to add
    const newNames: string[] = [];
    filteredTemplateDetails.forEach(({ templateName }) => {
      if (!(templateName in fetchedNames.current)) {
        newNames.push(templateName);
      }
    });

    // add new templates
    let currentFetchedIndex = 0;
    recursive(
      selectedDir,
      newNames,
      currentFetchedIndex,
      (templateComps, fetchIndex) => {
        // update fetched name list
        fetchedNames.current[newNames[fetchIndex]] = true;

        setFormattedData((formattedData) => {
          const newFormattedData = [...formattedData];
          newFormattedData.push({
            name: newNames[fetchIndex],
            components: templateComps,
          });
          return newFormattedData;
        });
      }
    );
  }, [selectedDir, filteredTemplateDetails]);

  return { formattedData };
};
