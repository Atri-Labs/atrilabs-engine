import { useEffect, useState } from "react";
import {
  editorAppMachineInterpreter,
  subscribeEditorMachine,
} from "@atrilabs/pwa-builder-manager";
import { PageInfo } from "../types";

export function useGetPageInfo() {
  const [pagesInfo, setPagesInfo] = useState<PageInfo | null>(null);

  const [selectedPageRouteObjectPath] = useState<string>("/");

  useEffect(() => {
    if (editorAppMachineInterpreter.getSnapshot().value !== "booting") {
      const pagesInfo = editorAppMachineInterpreter.machine.context.pagesInfo;
      setPagesInfo(pagesInfo);
    } else {
      return subscribeEditorMachine("afterbootup", (context) => {
        setPagesInfo(context.pagesInfo);
      });
    }
  }, []);
  return { pagesInfo, selectedPageRouteObjectPath };
}