import { RouterContext } from "../contexts/RouterContext";
import App from "./App";
import { AtriRouter } from "../router/AtriRouter";
import { createMemoryRouter, RouteObject } from "react-router-dom";

export function renderReactAppServerSide(
  routeObject: RouteObject,
  urlPath: string
) {
  const atriRouter = new AtriRouter();
  atriRouter.setRouterFactory(createMemoryRouter);
  atriRouter.addPage(routeObject, {
    initialEntries: [urlPath],
    initialIndex: 0,
  });

  return (
    <RouterContext.Provider value={atriRouter}>
      <App />
    </RouterContext.Provider>
  );
}
