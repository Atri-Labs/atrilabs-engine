import { api } from "@atrilabs/pwa-builder-manager";
import { CreateEvent, LinkEvent } from "@atrilabs/forest";
import React, { useEffect, useMemo, useState } from "react";
import { getReactManifest } from "@atrilabs/core";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import CallbackTreeId from "@atrilabs/app-design-forest/src/callbackHandlerTree?id";
import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import {
  FormattedTemplateData,
  PartialTemplateComponents,
  TemplateComponents,
} from "../types";

function getComponentsFromTemplate(name: string) {
  if (!name) return;
  return new Promise<FormattedTemplateData>((resolve) => {
    api.getTemplateEvents(name, (events) => {
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
            const manifestComp = getReactManifest(createEvent.meta);
            // add FC
            templateComps[createEvent.id] = {
              ...templateComps[createEvent.id],
              FC:
                manifestComp?.devComponent ||
                manifestComp?.component ||
                undefined,
              acceptsChildren: manifestComp?.manifest.dev.acceptsChild
                ? true
                : false,
            };
            // add to parent's children
            const parent = createEvent.state.parent;
            if (templateComps[parent.id] === undefined) {
              templateComps[parent.id] = { children: [] };
            }
            templateComps[parent.id]?.children!.push({
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
      resolve({
        name,
        components: templateComps as TemplateComponents,
        events,
      } as FormattedTemplateData);
    });
  });
}

/**
 * This hook doesn't create the nodes that have already been created when
 * the templateDetails change. In other words, it takes a diff between already
 * rendered template names and newly created templates. It also takes a diff between
 * already rendered template and recently deleted template. To achieve this, it maintains
 * a fetchedNames ref as list of currently fetched nodes. It assumes templateDetails have
 * no duplicate entry.
 */
export const useShowTemplate = (templateDetails: string[]) => {
  const [formattedData, setFormattedData] = useState<
    Array<FormattedTemplateData>
  >([]);

  const mapFormattedTemplateData = useMemo(() => {
    const namesMap: { [name: string]: FormattedTemplateData } = {};
    formattedData.forEach((data: FormattedTemplateData) => {
      namesMap[data.name.toString()] = data;
    });
    return namesMap;
  }, [formattedData]);

  useEffect(() => {
    if (!templateDetails.length) return;
    const mappedFormatData = mapFormattedTemplateData;
    const data: any = templateDetails.map((name: string) => {
      // if already template fetched
      if (mappedFormatData[name]) {
        return mappedFormatData[name];
      }
      return getComponentsFromTemplate(name);
    });
    Promise.all<FormattedTemplateData[]>(data).then(
      (newFormatData: FormattedTemplateData[]) =>
        setFormattedData(newFormatData)
    );
  }, [templateDetails]);

  return { formattedData };
};
