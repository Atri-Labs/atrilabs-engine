import App from "../../app/src/App";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

function renderRoute(App: React.FC, route: string): string {
  const appStr = ReactDOMServer.renderToString(
    <StaticRouter location={route}>
      <App />
    </StaticRouter>
  );
  return appStr;
}

export function getAppText(url: string, appHtmlContent: string) {
  const appText = renderRoute(App, url);
  const finalText = appHtmlContent.replace(
    '<div id="root"></div>',
    `<div id="root">${appText}</div>`
  );
  return finalText;
}
