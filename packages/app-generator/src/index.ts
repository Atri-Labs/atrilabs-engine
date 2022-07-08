import buildReactApp from "./build-scripts/react-app";
import deployApp from "./deploy-scripts/react-app";
import generateApp from "./gen-script";

export { getAppInfo } from "./getAppInfo";
export { getPageStates } from "./getPageState";
export const scripts = {
  generateApp: generateApp,
  buildReactApp: buildReactApp,
  deployApp: deployApp,
};
