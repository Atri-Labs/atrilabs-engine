import { Router } from "@remix-run/router";
import { createBrowserRouter, RouteObject } from "react-router-dom";

export class AtriRouter {
	private paths = new Set();
	private routeObjects: RouteObject[] = [];
	private router: Router | null = null;

	addPage(routeObject: RouteObject) {
		if (routeObject.path && !this.paths.has(routeObject.path)) {
			this.paths.add(routeObject.path);
			this.routeObjects.push(routeObject);
			this.router = createBrowserRouter(this.routeObjects);
			this.subs.forEach((cb) => cb());
		}
	}

	removePage(path: string) {
		this.routeObjects.filter((routeObject) => {
			routeObject.path !== path;
		});
	}

	getRouter() {
		return this.router;
	}

	private subs: (() => void)[] = [];

	subscribe(cb: () => void) {
		this.subs.push(cb);
		return () => {
			const index = this.subs.findIndex((curr) => curr === cb);
			if (index >= 0) {
				this.subs.splice(index, 1);
			}
		};
	}
}

declare global {
	interface Window {
		__atriRotuer: AtriRouter;
	}
}

export const atriRouter = new AtriRouter();

window.__atriRotuer = atriRouter;
