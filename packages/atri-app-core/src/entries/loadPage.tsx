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
	path: string,
	PageWrapper: React.FC<any>,
	Page: React.FC<any>
) {
	if (path.startsWith("/blog")) {
		path = "blog";
	}
	if (path.startsWith("/new")) {
		path = "new";
	}
	atriRouter.addPage({
		path,
		element: <FinalPageComponent Page={Page} PageWrapper={PageWrapper} />,
	});
}
