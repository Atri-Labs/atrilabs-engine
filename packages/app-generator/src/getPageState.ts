import { AppInfo, PageState } from "./types";

export function getPageStates(appInfo: AppInfo) {
  const pages = appInfo.pages;
  const pageIds = Object.keys(pages);
  const result: { [pageId: string]: PageState } = {};
  pageIds.forEach((pageId) => {
    // create props for state
    let componentGeneratorOutput =
      appInfo.pages[pageId].componentGeneratorOutput;
    let propsGeneratorOutput = appInfo.pages[pageId].propsGeneratorOutput;
    const compIds = Object.keys(componentGeneratorOutput);
    const pageState: { [alias: string]: any } = {};
    compIds.forEach((compId) => {
      if (propsGeneratorOutput[compId]) {
        const alias = componentGeneratorOutput[compId].alias;
        const props = propsGeneratorOutput[compId].props;
        pageState[alias] = props;
      } else {
        console.log(`WARNING: props not found for ${compId}`);
      }
    });
    result[pageId] = pageState;
  });
  return result;
}
