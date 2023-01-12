import { Configuration } from "webpack-dev-server";
import ignoredFiles from "react-dev-utils/ignoredFiles";
import evalSourceMapMiddleware from "react-dev-utils/evalSourceMapMiddleware";
import noopServiceWorkerMiddleware from "react-dev-utils/noopServiceWorkerMiddleware";
import redirectServedPath from "react-dev-utils/redirectServedPathMiddleware";

export default function createDevConfig(
	allowedHost: string,
	paths: { appPublic: string; publicUrlOrPath: string; appSrc: string },
	webSocketURL: { hostname?: string; pathname?: string; port?: string },
	proxy: Configuration["proxy"],
	middlewares?: (app: Express.Application) => void
): Configuration {
	return {
		allowedHosts: [allowedHost],
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "*",
			"Access-Control-Allow-Headers": "*",
		},
		compress: true,
		static: {
			// By default WebpackDevServer serves physical files from current directory
			// in addition to all the virtual build products that it serves from memory.
			// This is confusing because those files won’t automatically be available in
			// production build folder unless we copy them. However, copying the whole
			// project directory is dangerous because we may expose sensitive files.
			// Instead, we establish a convention that only files in `public` directory
			// get served. Our build script will copy `public` into the `build` folder.
			// In `index.html`, you can get URL of `public` folder with %PUBLIC_URL%:
			// <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
			// In JavaScript code, you can access it with `process.env.PUBLIC_URL`.
			// Note that we only recommend to use `public` folder as an escape hatch
			// for files like `favicon.ico`, `manifest.json`, and libraries that are
			// for some reason broken when imported through webpack. If you just want to
			// use an image, put it in `src` and `import` it from JavaScript instead.
			directory: paths.appPublic,
			publicPath: [paths.publicUrlOrPath],
			// By default files from `contentBase` will not trigger a page reload.
			watch: {
				// Reportedly, this avoids CPU overload on some systems.
				// https://github.com/facebook/create-react-app/issues/293
				// src/node_modules is not ignored to support absolute imports
				// https://github.com/facebook/create-react-app/issues/1065
				ignored: ignoredFiles(paths.appSrc),
			},
		},
		client: {
			webSocketURL: webSocketURL,
			overlay: {
				errors: true,
				warnings: false,
			},
		},
		devMiddleware: {
			// It is important to tell WebpackDevServer to use the same "publicPath" path as
			// we specified in the webpack config. When homepage is '.', default to serving
			// from the root.
			// remove last slash so user can land on `/test` instead of `/test/`
			publicPath: paths.publicUrlOrPath.slice(0, -1),
		},
		historyApiFallback: {
			// Paths with dots should still use the history fallback.
			// See https://github.com/facebook/create-react-app/issues/387.
			disableDotRule: true,
			index: paths.publicUrlOrPath,
		},
		// `proxy` is run between `before` and `after` `webpack-dev-server` hooks
		proxy,
		onBeforeSetupMiddleware(devServer) {
			// Keep `evalSourceMapMiddleware`
			// middlewares before `redirectServedPath` otherwise will not have any effect
			// This lets us fetch source contents from webpack for the error overlay
			devServer.app?.use(evalSourceMapMiddleware(devServer));

			if (middlewares && devServer.app) {
				// This registers user provided middleware for proxy reasons
				middlewares(devServer.app);
			}
		},
		onAfterSetupMiddleware(devServer) {
			// Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
			devServer.app?.use(redirectServedPath(paths.publicUrlOrPath));

			// This service worker file is effectively a 'no-op' that will reset any
			// previous service worker registered for the same host:port combination.
			// We do this in development to avoid hitting the production cache if
			// it used the same host and port.
			// https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
			devServer.app?.use(
				noopServiceWorkerMiddleware(paths.publicUrlOrPath)
			);
		},
	};
}
