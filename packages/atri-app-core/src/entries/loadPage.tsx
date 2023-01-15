import React from "react";
import { atriRouter } from "../router/AtriRouter";

function FinalPageComponent(props: {
  PageWrapper: React.FC<any>;
  Page: React.FC<any>;
}) {
  const { PageWrapper, Page } = props;
  return <PageWrapper Component={Page}></PageWrapper>;
}

export default function loadPage(
  reactRouterPath: string,
  PageWrapper: React.FC<any>,
  Page: React.FC<any>
) {
  atriRouter.addPage({
    path: reactRouterPath,
    element: <FinalPageComponent Page={Page} PageWrapper={PageWrapper} />,
  });
}
