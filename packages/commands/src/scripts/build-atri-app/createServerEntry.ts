import { PageInfo } from "./types";
import { createCommonEntry } from "./createCommonEntry";
import type { ComponentManifests } from "@atrilabs/atri-app-core/src/types";

export async function createServerEntry(options: {
  pageInfos: PageInfo[];
  componentManifests: ComponentManifests;
}) {
  const { pageInfos, componentManifests } = options;
  return createCommonEntry({
    pageInfos,
    componentManifests,
    loaderName: "atri-pages-server-loader",
  });
}
