import { ComponentManifests, PageInfo } from "./types";
import { createCommonEntry } from "./createCommonEntry";

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
