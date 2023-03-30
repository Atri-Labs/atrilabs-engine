import { processRoute } from "./processRoute";

export function renderReactString(route: string) {
  const processedRoute = processRoute(route);
  // @ts-ignore
  const mod = __non_webpack_require__(processedRoute.jsPath);
  return mod.default.renderPage();
}
