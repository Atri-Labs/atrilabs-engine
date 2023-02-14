import { useEffect, useState } from "react";
import {
  editorAppMachineInterpreter,
  subscribeEditorMachine,
} from "@atrilabs/pwa-builder-manager";

export function useAppInfo() {
  const [appInfo, setAppInfo] = useState<{ hostname: string } | null>(null);
  useEffect(() => {
    if (editorAppMachineInterpreter.getSnapshot().value !== "booting") {
      const appInfo = editorAppMachineInterpreter.machine.context.appInfo;
      setAppInfo(appInfo);
    } else {
      return subscribeEditorMachine("afterbootup", (context) => {
        setAppInfo(context.appInfo);
      });
    }
  }, []);
  return { appInfo };
}
