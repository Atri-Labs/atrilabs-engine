import { Router } from "@remix-run/router";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import type { createMemoryRouter } from "react-router-dom";

export class AtriRouter {
  private paths: Set<RouteObject["path"]> = new Set();
  private routeObjects: RouteObject[] = [];
  private router: Router | null = null;
  private createRouter: typeof createBrowserRouter | typeof createMemoryRouter =
    createBrowserRouter;
  private navigateToWhenNewRouterLoaded: string | null = null;

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

  /**
   * setPages is used in production. addPage is used in development.
   */
  setPages(
    routeObjects: RouteObject[],
    routerOpts?: { initialEntries: string[]; initialIndex: number }
  ) {
    routeObjects.forEach((routeObject) => {
      this.paths.add(routeObject.path);
    });
    this.routeObjects.push(...routeObjects);
    this.router = this.createRouter(routeObjects, routerOpts);
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

  setNavigateToWhenNewRouterLoaded(urlPath: string) {
    this.navigateToWhenNewRouterLoaded = urlPath;
  }

  removeNavigateToWhenNewRouterLoaded() {
    const temp = this.navigateToWhenNewRouterLoaded;
    this.navigateToWhenNewRouterLoaded = null;
    return temp;
  }
}
