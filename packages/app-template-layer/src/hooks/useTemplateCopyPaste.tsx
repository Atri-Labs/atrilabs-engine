import { useCallback } from "react";
import { useClipboard } from "./useClipboard";
import { useCreateTemplate } from "./useCreateTemplate";
import { useListenCopyPaste } from "./useListenCopyPaste";
import {
  computeChildIndex,
  getReactComponentManifest,
  postTemplateEvents,
} from "@atrilabs/canvas-runtime-utils";
import { AnyEvent } from "@atrilabs/forest";
import {
  getComponentParent,
  getComponentRef,
  getCSSBoxCoords,
  Location,
} from "@atrilabs/canvas-runtime";
import { BrowserForestManager, getId, useTree } from "@atrilabs/core";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";

export const useTemplateCopyPaste = () => {
  const createTemplate = useCreateTemplate();
  const { putInClipboard, getFromClipboard } = useClipboard();
  const compTree = useTree(ComponentTreeId);

  const onCopy = useCallback(
    (selectedId: string) => {
      const template = createTemplate(selectedId, {
        copyCallbacks: true,
        copyDefaulCallbacks: false,
      });
      putInClipboard(
        JSON.stringify({ type: "template", template, copiedId: selectedId })
      );
    },
    [createTemplate, putInClipboard]
  );

  const onPaste = useCallback(
    (selectedId: string) => {
      getFromClipboard()?.then((text) => {
        try {
          const obj = JSON.parse(text);
          if (
            "type" in obj &&
            obj["type"] === "template" &&
            "copiedId" in obj &&
            "template" in obj
          ) {
            const copiedId = obj["copiedId"] as string;
            const events = obj["template"] as AnyEvent[];
            if (
              getComponentRef(selectedId) &&
              getComponentRef(selectedId).current
            ) {
              const selectedRef = getComponentRef(selectedId).current!;
              const selectedBoxCoords = getCSSBoxCoords(selectedRef);
              const bottomWM = selectedBoxCoords.bottomWM;
              const rightWM = selectedBoxCoords.rightWM;

              // get location pageX, pageY
              const loc: Location = { pageX: rightWM, pageY: bottomWM };

              // get parent id
              let parentId: string;
              if (selectedId === "body") {
                parentId = "body";
              } else if (selectedId === copiedId) {
                // get immidiate parent
                console.log("parentId because equal", selectedId);
                parentId = getComponentParent(copiedId).id;
              } else {
                // get parent i.e. selectedId if it accepts child or it's parent
                const key = compTree.nodes[selectedId].meta["key"];
                const compManifest = getReactComponentManifest(key);
                if (compManifest) {
                  if (compManifest.dev.acceptsChild) {
                    parentId = selectedId;
                  } else {
                    parentId = compTree.nodes[selectedId].state.parent.id;
                  }
                } else {
                  console.log("react component manifest not found");
                  return;
                }
              }

              if (!parentId) {
                console.log("Failed to identify parent for paster operation.");
              }

              // get index
              const index = computeChildIndex(parentId, loc, compTree) || 0;

              // TODO: handle body paste
              if (copiedId === "body") {
                console.log("Cannot paste body.");
                return;
              }

              const forestPkgId =
                BrowserForestManager.currentForest.forestPkgId;
              const forestId = BrowserForestManager.currentForest.forestId;
              // post template events
              const newTemplateRootId = getId();
              postTemplateEvents({
                events,
                newTemplateRootId,
                forestPkgId,
                forestId,
                parentId,
                index,
              });
            }
          }
        } catch {}
      });
    },
    [getFromClipboard, compTree]
  );

  useListenCopyPaste({ onCopyKeyPressed: onCopy, onPasteKeyPressed: onPaste });
};
