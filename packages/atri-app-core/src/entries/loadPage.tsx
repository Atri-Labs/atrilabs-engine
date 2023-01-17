import React from "react";
import { AtriRouter } from "../router/AtriRouter";

function FinalPageComponent(props: {
  PageWrapper: React.FC<any>;
  Page: React.FC<any>;
}) {
  const { PageWrapper, Page } = props;
  return <PageWrapper Component={Page}></PageWrapper>;
}

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
