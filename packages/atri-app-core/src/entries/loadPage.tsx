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
  urlPath: string,
  PageWrapper: React.FC<any>,
  Page: React.FC<any>
) {
  if (urlPath.startsWith("/blog")) {
    urlPath = "blog";
  }
  if (urlPath.startsWith("/new")) {
    urlPath = "new";
  }
  atriRouter.addPage({
    path: urlPath,
    element: <FinalPageComponent Page={Page} PageWrapper={PageWrapper} />,
  });
}
