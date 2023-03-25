import { ComponentManifests, PageInfo } from "./types";
import { createCommonEntry } from "./createCommonEntry";

export async function createClientEntry(options: {
  pageInfos: PageInfo[];
  componentManifests: ComponentManifests;
}) {
  const { pageInfos, componentManifests } = options;
  return createCommonEntry({
    pageInfos,
    componentManifests,
    loaderName: "atri-pages-client-loader",
  }).then((entry) => {
    const existingKeys = Object.keys(entry);
    entry["vendors"] = ["react", "react-dom", "react-router-dom"];
    entry["prod-contexts"] = {
      import: "@atrilabs/atri-app-core/src/prod-contexts",
      dependOn: ["vendors"],
    };
    entry["atri-router"] = {
      import: "@atrilabs/atri-app-core/src/router/AtriRouter",
      dependOn: ["vendors"],
    };
    existingKeys.forEach((key) => {
      if (typeof entry[key] === "object" && !Array.isArray(entry[key])) {
        const currEntry = entry[key] as { import: string };
        entry[key] = {
          ...currEntry,
          dependOn: ["vendors", "atri-router", "prod-contexts"],
        } as {
          import: string;
          dependOn: string[];
        };
      }
    });
    return entry;
  });
}
