import { Router } from "@remix-run/router";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import type { createMemoryRouter } from "react-router-dom";

export class AtriRouter {
  private paths: Set<RouteObject["path"]> = new Set();
  private routeObjects: RouteObject[] = [];
  private router: Router | null = null;
  private createRouter: typeof createBrowserRouter | typeof createMemoryRouter =
    createBrowserRouter;

  setRouterFactory(
    factory: typeof createBrowserRouter | typeof createMemoryRouter
  ) {
    this.createRouter = factory;
  }

  addPage(
    routeObject: RouteObject,
    routerOpts?: { initialEntries: string[]; initialIndex: number }
  ) {
    if (routeObject.path && !this.paths.has(routeObject.path)) {
      this.paths.add(routeObject.path);
      this.routeObjects.push(routeObject);
      this.router = this.createRouter(this.routeObjects, routerOpts);
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
