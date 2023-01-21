import { RouterContext } from "../contexts/RouterContext";
import App from "./App";
import { createMemoryRouter } from "react-router-dom";
import { atriRouter } from "./atriRouter";
import { AppEntryOptions } from "./AppEntryOptions";

export function renderReactAppServerSide(options: AppEntryOptions) {
  const { routeObjectPath, urlPath } = options;
  if (urlPath === undefined) {
    throw Error("Please check if you passed url path correctly!");
  }
  atriRouter.setRouterFactory(createMemoryRouter);
  atriRouter.addPage(
    { path: routeObjectPath },
    {
      initialEntries: [urlPath],
      initialIndex: 0,
    }
  );

  return (
    <RouterContext.Provider value={atriRouter}>
      <App />
    </RouterContext.Provider>
  );
}
