import { useEffect, useState } from "react";
import {
  editorAppMachineInterpreter,
  subscribeEditorMachine,
} from "@atrilabs/pwa-builder-manager";

export function useGetPageInfo() {
  const [pagesInfo, setPagesInfo] = useState<
    | {
        routeObjectPath: string;
        unixFilepath: string;
      }[]
    | null
  >();

  const [currentPageUnixFilepath] = useState<string>("/index");

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
  return { pagesInfo, currentPageUnixFilepath };
}
