import buildReactApp from "./build-scripts/react-app";
import deployApp from "./deploy-scripts/react-app";
import generateApp from "./gen-script";

export { getAppInfo } from "./getAppInfo";
export {
  getPageStateAsAliasMap,
  getPageStateAsCompIdMap,
} from "./getPageState";
export const scripts = {
  // generates the code (both react and python)
  generateApp: generateApp,
  // build app (install deps and update props from controller)
  buildReactApp: buildReactApp,
  deployApp: deployApp,
};
