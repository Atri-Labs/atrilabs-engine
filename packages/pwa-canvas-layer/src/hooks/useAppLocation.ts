import { useEffect, useState } from "react";
import { subscribeEditorMachine } from "@atrilabs/pwa-builder-manager";

export function useAppLocation() {
  const [currentRouteObjectPath, setCurrentRouteObjectPath] =
    useState<string>("/");
  useEffect(() => {
    subscribeEditorMachine("before_app_load", (context) => {
      console.log(context);
      setCurrentRouteObjectPath(context.currentRouteObjectPath);
    });
  }, []);
  return { currentRouteObjectPath };
}
