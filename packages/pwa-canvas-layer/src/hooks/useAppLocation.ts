import { useEffect, useState } from "react";
import {
  editorAppMachineInterpreter,
  subscribeEditorMachine,
} from "@atrilabs/pwa-builder-manager";

export function useAppLocation() {
  const [currentRouteObjectPath, setCurrentRouteObjectPath] =
    useState<string>("/");
  useEffect(() => {}, []);
  return { currentRouteObjectPath };
}
