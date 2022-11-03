import App from "../../app/src/App";
import ReactDOMServer from "react-dom/server";
import React from "react";
import { StaticRouter } from "react-router-dom/server";
import { GlobalContext } from "@atrilabs/core/lib/reactUtilities";

function renderRoute(App: React.FC, route: string): string {
  const appStr = ReactDOMServer.renderToString(
    <GlobalContext.Provider value={{ window, portals: undefined }}>
      <StaticRouter location={route}>
        <App />
      </StaticRouter>
    </GlobalContext.Provider>
  );
  return appStr;
}

export function getAppText(url: string, appHtmlContent: string) {
  const appText = renderRoute(App, url);
  const finalText = appHtmlContent.replace(
    '<div id="root" style="height: 100vh"></div>',
    `<div id="root" style="height: 100vh">${appText}</div>`
  );
  return finalText;
}
