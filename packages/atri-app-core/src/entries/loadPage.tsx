import React from "react";
import { AtriRouter } from "../router/AtriRouter";
import { FinalPageComponent } from "./FinalPageComponent";

export default function loadPage(
  atriRouter: AtriRouter,
  reactRouterPath: string,
  PageWrapper: React.FC<any>,
  Page: React.FC<any>
) {
  atriRouter.addPage({
    path: reactRouterPath,
    element: <FinalPageComponent Page={Page} PageWrapper={PageWrapper} />,
  });
}
