import { useEffect, useState } from "react";
import { subscribeEditorMachine } from "@atrilabs/pwa-builder-manager";

export function useAppLocation() {
  const [currentRouteObjectPath, setCurrentRouteObjectPath] =
    useState<string>("/");
  useEffect(() => {
    return subscribeEditorMachine("before_app_load", (context) => {
      setCurrentRouteObjectPath(context.currentRouteObjectPath);
    });
  }, []);
  return { currentRouteObjectPath };
}
