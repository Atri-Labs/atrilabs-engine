// @ts-ignore
global.window = undefined;

import App from "../../app/src/App";
import ReactDOMServer from "react-dom/server";
import React from "react";
import { StaticRouter } from "react-router-dom/server";
import { GlobalContext } from "@atrilabs/core/lib/reactUtilities";
import { Portals } from "@atrilabs/core/lib/types";

function renderRoute(App: React.FC, route: string, portals: Portals): string {
  const appStr = ReactDOMServer.renderToString(
    <GlobalContext.Provider value={{ window, portals }}>
      <StaticRouter location={route}>
        <App />
      </StaticRouter>
    </GlobalContext.Provider>
  );
  return appStr;
}

export function getAppText(url: string, appHtmlContent: string) {
  const portals: Portals = [];
  const appText = renderRoute(App, url, portals);
  const finalText = appHtmlContent.replace(
    '<div id="root" style="height: 100vh"></div>',
    `<div id="root" style="height: 100vh">${appText}</div>`
  );
  return finalText;
}
