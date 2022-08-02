import ReactRuntime from "react/jsx-runtime";
import React from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./types";
import type { ManifestRegistry } from "@atrilabs/core";
import { manifestRegistryController } from "@atrilabs/core";

// @ts-ignore
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env["ATRI_TOOL_MANIFEST_SERVER_CLIENT"] as string
);

// @ts-ignore
function registerComponents(scriptName: string, pkg: string) {
  //do stuff with the script
  const handle = (window as any)[scriptName];
  console.log("loaded", handle.setup);
  handle.setup(
    (registry: {
      [manifestId: string]: {
        components: ManifestRegistry["0"]["components"]["0"]["component"][];
      };
    }) => {
      console.log("registry received", registry);
      const manifestIds = Object.keys(registry);
      manifestIds.forEach((manifestId) => {
        const components = registry[manifestId]!.components.map((component) => {
          return { component, pkg };
        });
        manifestRegistryController.writeComponents(manifestId, components);
        console.log(manifestRegistryController.readManifestRegistry());
      });
    },
    React,
    ReactRuntime
  );
}

/**
 * Temporarily disabling fetching of manifests. Once support to add
 * external components is ready, we can switch this back on.
 */
// socket.emit("sendManifestScripts", (bundles) => {
//   console.log("received bundles", bundles);
//   bundles.forEach((bundle) => {
//     const pkg = bundle.pkg;
//     const scriptName = bundle.scriptName;
//     const script = document.createElement("script");
//     script.innerHTML = bundle.src;
//     document.body.appendChild(script);
//     registerComponents(scriptName, pkg);
//   });
// });
