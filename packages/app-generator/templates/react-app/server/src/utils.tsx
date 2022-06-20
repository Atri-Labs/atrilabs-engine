import path from "path";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

export const appDistHtml = path.resolve("dist/app/index.html");

export function renderRoute(App: React.FC, route: string): string {
	const appStr = ReactDOMServer.renderToString(
		<StaticRouter location={route}>
			<App />
		</StaticRouter>
	);
	return appStr;
}
